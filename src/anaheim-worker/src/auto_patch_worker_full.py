#!/usr/bin/env python3
"""
auto_patch_worker_full.py
Worker tout-en-un pour auto-fix TypeScript dApp + workflow multi-branches.

Fonctions :
 - lance `npx tsc --noEmit` et analyse les erreurs
 - appelle node resolver (src/utils/resolver/index.js) pour obtenir actions
 - applique fixes (add_import, suggest_package, create_function, create_parameter, change_type)
 - met à jour TODO.md dans le dossier affecté (simple marqueur)
 - regroupe et crée des commits batch selon règles (temps, dossier, type)
 - pousse / merge selon branche (Orion automatic, Yew/Main interactif)
 - options : DRY_RUN, FORCE_PATCH, AUTO_IGNORE, BATCH_TIME_WINDOW
"""

import subprocess
import json
from pathlib import Path
import re
import time
from collections import defaultdict
from datetime import datetime, timedelta, timezone  # <-- ADD timezone for utcnow deprecation

# ------------ CONFIG ------------
ROOT = Path(__file__).resolve().parents[1]            # anaheim-worker
PROJECT_PATH = (ROOT / ".." / "anaheim-putsch-self-governance-solana-dapp").resolve()
RESOLVER_ENTRY = "src/utils/resolver/index.js"

# Branch names (case-sensitive as in your git)
ORION = "Orion"
ORION_EXPLORATION = "Orion-Exploration"
ROOTS = "Roots"
YEW = "Yew"
MAIN = "main"

# thresholds
MAX_ERRORS = 30
MAX_WARNINGS = 100
FORCE_PATCH = True      # allows partial patching beyond thresholds if True
DRY_RUN = False         # True -> simulate modifications, don't write files or commit
AUTO_IGNORE = ["unused variable", "console.log"]  # strings to ignore in tsc log lines

# commit grouping rules
BATCH_TIME_WINDOW_MINUTES = 30   # regroupe fixes si dernier commit récent
MIN_FILES_FOR_BATCH = 2          # si >= files changed, make a batch commit
COMMIT_PREFIX = "auto-patch"

# logs
LOG_DIR = ROOT / "logs"
LOG_DIR.mkdir(exist_ok=True)
ACTIVITY_LOG = LOG_DIR / f"auto_patch_activity_{int(time.time())}.log"

# ------------ UTIL HELPERS ------------
def log(msg: str):
    ts = datetime.now(timezone.utc).isoformat()  # <-- REPLACE datetime.utcnow()
    line = f"[{ts}] {msg}"
    print(line)
    with ACTIVITY_LOG.open("a") as f:
        f.write(line + "\n")

def run_cmd(cmd, cwd=None, capture_output=False, check=False, text=True):
    try:
        res = subprocess.run(cmd, cwd=cwd or PROJECT_PATH, capture_output=capture_output, check=check, text=text)
        return res
    except Exception as e:
        log(f"Command failed: {cmd} -- {e}")
        return None

# ------------ TSC / PARSE ------------
def run_tsc() -> Path:
    errors_path = PROJECT_PATH / "ts-errors.log"
    log("Running tsc --noEmit ...")
    with errors_path.open("w") as _f:
        run_cmd(["npx", "tsc", "--noEmit", "--pretty", "false"], cwd=PROJECT_PATH, capture_output=False)
    return errors_path

def parse_tsc_log(errors_file: Path):
    errors = 0
    warnings = 0
    details = []
    with errors_file.open("r", encoding="utf-8", errors="ignore") as f:
        for raw in f:
            line = raw.strip()
            if not line:
                continue
            low = line.lower()
            if any(ig in low for ig in AUTO_IGNORE):
                continue
            if "error" in low:
                errors += 1
                details.append(("error", line))
            elif "warning" in low:
                warnings += 1
                details.append(("warning", line))
            else:
                # some tsc outputs are just file:line messages - include
                details.append(("info", line))
    return errors, warnings, details

# ------------ RESOLVER ------------
def run_resolver(errors_file: Path):
    """Appelle le resolver Node et parse le JSON."""
    resolver_path = PROJECT_PATH / RESOLVER_ENTRY
    if not resolver_path.exists():
        log(f"Resolver not found: {resolver_path}")
        return []
    log("Calling resolver node module...")
    proc = run_cmd(["node", str(resolver_path), str(errors_file)], cwd=PROJECT_PATH, capture_output=True)
    if not proc:
        return []
    stdout = proc.stdout.strip()
    if not stdout:
        log(f"Resolver produced no JSON. stderr: {proc.stderr}")
        return []
    try:
        actions = json.loads(stdout)
        log(f"Resolver returned {len(actions)} actions.")
        return actions
    except Exception as e:
        log(f"Failed to parse JSON from resolver: {e}")
        log(f"Resolver stdout: {stdout[:1000]}")
        return []

# ------------ PATCH OPERATIONS ------------
def safe_write(file_path: Path, content: str, _mode="w"):
    if DRY_RUN:
        log(f"[DRY_RUN] Would write to {file_path} ({len(content)} bytes)")
        return
    file_path.parent.mkdir(parents=True, exist_ok=True)
    file_path.write_text(content, encoding="utf-8")
    log(f"WROTE {file_path}")

def insert_import(file_path: Path, symbol: str, from_path_hint: str = None):
    try:
        code = file_path.read_text(encoding="utf-8")
    except FileNotFoundError:
        log(f"insert_import: file not found {file_path}. Creating new file.")
        code = ""
    # check already imported
    if re.search(rf"\bimport\s+.*\b{re.escape(symbol)}\b", code):
        log(f"insert_import: {symbol} appears already imported in {file_path}")
        return False
    # simple import guess: prefer relative path if hint else './<stem>'
    imp_from = from_path_hint or f"./{file_path.stem}"
    new_import = f"import {{ {symbol} }} from '{imp_from}';\n"
    new_code = new_import + code
    safe_write(file_path, new_code)
    return True

def create_function(file_path: Path, symbol: str):
    try:
        code = file_path.read_text(encoding="utf-8")
    except FileNotFoundError:
        code = ""
    # avoid duplication
    if re.search(rf"(function|export function|const)\s+{re.escape(symbol)}\b", code):
        log(f"create_function: {symbol} already exists in {file_path}")
        return False
    skeleton = f"\n// Auto-generated by auto_patch_worker\nexport function {symbol}(...args: any[]): void {{\n  throw new Error('Function {symbol} not implemented');\n}}\n"
    new_code = code + skeleton
    safe_write(file_path, new_code)
    return True

def patch_function_signature(file_path: Path, function_name: str, new_param: str, new_type: str = "any"):
    try:
        code = file_path.read_text(encoding="utf-8")
    except FileNotFoundError:
        log(f"patch_function_signature: file not found {file_path}")
        return False
    pattern = rf"(function\s+{re.escape(function_name)}\s*\([^)]*)\)"
    m = re.search(pattern, code)
    if not m:
        # try exported const arrow functions: const fn = (a) => { ... }
        alt = rf"(const\s+{re.escape(function_name)}\s*=\s*\([^)]*)\)"
        m2 = re.search(alt, code)
        if not m2:
            log(f"patch_function_signature: function {function_name} not found in {file_path}")
            return False
        before = m2.group(1)
        updated = before + f", {new_param}: {new_type})"
        new_code = code[:m2.start()] + updated + code[m2.end():]
    else:
        before = m.group(1)
        updated = before + f", {new_param}: {new_type})"
        new_code = code[:m.start()] + updated + code[m.end():]
    safe_write(file_path, new_code)
    return True

def patch_type_annotation(file_path: Path, symbol: str, new_type: str):
    try:
        code = file_path.read_text(encoding="utf-8")
    except FileNotFoundError:
        log(f"patch_type_annotation: file not found {file_path}")
        return False
    pattern = rf"(\b{re.escape(symbol)}\s*:\s*)[A-Za-z0-9_\[\]\|\<\>]+"
    new_code, n = re.subn(pattern, rf"\1{new_type}", code)
    if n == 0:
        log(f"patch_type_annotation: no annotation found for {symbol} in {file_path}")
        return False
    safe_write(file_path, new_code)
    return True

def suggest_and_install_package(pkg_name: str):
    if DRY_RUN:
        log(f"[DRY_RUN] Would install {pkg_name}")
        return True
    log(f"Installing package {pkg_name} via pnpm...")
    res = run_cmd(["pnpm", "add", pkg_name], cwd=PROJECT_PATH, capture_output=True)
    if res and res.returncode == 0:
        log(f"Installed {pkg_name}")
        return True
    else:
        log(f"Failed to install {pkg_name}. res: {res}")
        return False

# ------------ TODO.md update (simple) ------------
def mark_todo_done_for_path(file_path: Path, note: str = "auto-fixed"):
    """
    Find nearest TODO.md in ancestor folders and add a short line.
    """
    cur = file_path.resolve().parent
    while True:
        todo = cur / "TODO.md"
        if todo.exists():
            if DRY_RUN:
                log(f"[DRY_RUN] Would append TODO note to {todo}")
                return
            content = todo.read_text(encoding="utf-8")
            entry = f"\n- [x] {note} -> {file_path.name} ({datetime.now(timezone.utc).isoformat()})\n"  # <-- REPLACE utcnow()
            todo.write_text(content + entry, encoding="utf-8")
            log(f"Appended TODO done to {todo}")
            return
        if cur == PROJECT_PATH or cur == cur.parent:
            # reached project root
            return
        cur = cur.parent

# ------------ COMMIT / BATCH LOGIC ------------
def git_get_current_branch():
    res = run_cmd(["git", "rev-parse", "--abbrev-ref", "HEAD"], cwd=PROJECT_PATH, capture_output=True)
    if res:
        return res.stdout.strip()
    return None

def git_diff_changed_files():
    res = run_cmd(["git", "status", "--porcelain"], cwd=PROJECT_PATH, capture_output=True)
    changed = []
    if res:
        for line in res.stdout.splitlines():
            # output like: M path/to/file
            parts = line.strip().split()
            if len(parts) == 2:
                changed.append(Path(parts[1]))
    return changed

# store last commit time (simple local stamp file)
LAST_COMMIT_FILE = ROOT / ".last_auto_commit"
def get_last_commit_time():
    if LAST_COMMIT_FILE.exists():
        try:
            t = float(LAST_COMMIT_FILE.read_text())
            return datetime.fromtimestamp(t)
        except (ValueError, OSError) as e:  # FIX: Too broad exception clause
            log(f"Error reading last commit time: {e}")
            return None
    return None

def set_last_commit_time(dt: datetime):
    if DRY_RUN:
        log("[DRY_RUN] Would set last commit time")
        return
    LAST_COMMIT_FILE.write_text(str(dt.timestamp()))

def make_commit_if_needed(commit_message: str, target_branch: str):
    changed = git_diff_changed_files()
    if not changed:
        log("No changes to commit.")
        return False
    # decide grouping: if last commit within time window, append; else new commit
    last = get_last_commit_time()
    now = datetime.now(timezone.utc)  # <-- REPLACE utcnow()
    group_commit = False
    if last and (now - last) < timedelta(minutes=BATCH_TIME_WINDOW_MINUTES):
        group_commit = True
    # prepare commit
    if DRY_RUN:
        log(f"[DRY_RUN] Would git add/commit with message: {commit_message}")
        set_last_commit_time(now)
        return True
    run_cmd(["git", "add", "."], cwd=PROJECT_PATH)
    # commit message appended if grouping
    message = commit_message
    if group_commit:
        message = commit_message + " (grouped)"
    # allow empty commit skip
    res = run_cmd(["git", "commit", "-m", message], cwd=PROJECT_PATH, capture_output=True)
    if res and res.returncode == 0:
        log(f"Committed: {message}")
        set_last_commit_time(now)
        # push
        run_cmd(["git", "push", "origin", target_branch], cwd=PROJECT_PATH)
        log(f"Pushed {target_branch}")
        return True
    else:
        # if commit failed (no changes?), just log
        log(f"Commit skipped/failed: {res.stdout if res else 'no res'}")
        return False

# ------------ APPLY ACTIONS & TRACK CHANGES ------------
def apply_actions(actions, _branch):
    """
    Apply and record which files were changed to drive commit messages.
    Returns dict: { file_path: [action_types...] }
    """
    changed_map = defaultdict(list)
    for act in actions:
        act_type = act.get("action")
        target_rel = act.get("file", "")
        target_file = (PROJECT_PATH / target_rel).resolve() if target_rel else None
        try:
            if act_type == "add_import" and target_file:
                ok = insert_import(target_file, act.get("symbol", ""))
            elif act_type == "suggest_package":
                ok = suggest_and_install_package(act.get("package"))
            elif act_type == "create_function" and target_file:
                ok = create_function(target_file, act.get("symbol", ""))
            elif act_type in ("create_parameter", "create_param", "missingArg") and target_file:
                ok = patch_function_signature(target_file, act.get("function", ""), act.get("param", "arg"), act.get("type", "any"))
            elif act_type in ("change_type", "type_change") and target_file:
                ok = patch_type_annotation(target_file, act.get("symbol", "arg"), act.get("newType", "any"))
            elif act_type == "unresolved_import" and target_file:
                # fallback: create skeleton where referenced
                ok = create_function(target_file, act.get("symbol", "unknown"))
            else:
                log(f"Ignored / unknown action type: {act_type}")
                ok = False
        except Exception as e:
            log(f"Error applying action {act}: {e}")
            ok = False

        if ok and target_file:
            changed_map[str(target_file.relative_to(PROJECT_PATH))].append(act_type)
            # mark TODO
            mark_todo_done_for_path(target_file, note=f"auto-fixed ({act_type})")
    return changed_map

# ------------ INTERACTIVE for YEW/MAIN ------------
def interactive_apply(actions, branch):
    log(f"Interactive apply for {branch} (you approve each or batch by type).")
    # group by action type for batch option
    grouped = defaultdict(list)
    for a in actions:
        grouped[a.get("action")].append(a)
    # interactive loop by action type
    final_actions = []
    for action_type, acts in grouped.items():
        print(f"\nAction type: {action_type} ({len(acts)} instances)")
        choice = input("Apply all [a], batch by type [b], prompt each [p], skip [s]? [b/p/s/a]: ").strip().lower() or "b"
        if choice == "a":
            final_actions.extend(acts)
        elif choice == "b":
            # apply all of this type
            final_actions.extend(acts)
        elif choice == "p":
            for i, act in enumerate(acts, 1):
                print(f"{i}/{len(acts)} -> file: {act.get('file')} symbol: {act.get('symbol')}")
                yn = input("Apply this instance? [y/N]: ").strip().lower()
                if yn == "y":
                    final_actions.append(act)
        else:
            log(f"Skipping action type {action_type}")
    # apply selected
    return apply_actions(final_actions, branch)

# ------------ MAIN FLOW ------------
def main():
    log("=== auto_patch_worker_full START ===")
    branch = git_get_current_branch()
    log(f"Current branch: {branch}")
    if branch is None:
        log("Cannot determine git branch. Exiting.")
        return

    # run tsc
    errors_file = run_tsc()
    errors, warnings, details = parse_tsc_log(errors_file)
    log(f"TS errors: {errors}, warnings: {warnings}")
    # write detailed log
    detailed = PROJECT_PATH / "ts-errors-detailed.log"
    detailed.write_text("\n".join([d[1] for d in details]), encoding="utf-8")

    # safety checks
    if (errors > MAX_ERRORS or warnings > MAX_WARNINGS) and not FORCE_PATCH:
        log(f"Too many issues (errors:{errors} warnings:{warnings}). Stopping automatic patch.")
        return

    actions = run_resolver(errors_file)
    if not actions:
        log("No resolver actions. exiting.")
        return

    # branch handling
    if branch in (ORION, ORION_EXPLORATION):
        log("Automatic apply on Orion / Orion-Exploration")
        changed_map = apply_actions(actions, branch)
        # prepare commit message
        summary = summarize_changes_for_commit(changed_map)
        if summary:
            commit_msg = f"{COMMIT_PREFIX}: {summary}"
            # commit to ORION branch
            made = make_commit_if_needed(commit_msg, branch)
            if made:
                # propagate to Yew if on Orion
                if branch == ORION:
                    log("Merging Orion -> Yew")
                    run_cmd(["git", "checkout", YEW], cwd=PROJECT_PATH)
                    run_cmd(["git", "merge", ORION, "--no-ff", "-m", "Merge fixes depuis Orion"], cwd=PROJECT_PATH)
                    run_cmd(["git", "push", "origin", YEW], cwd=PROJECT_PATH)
                    # switch back to original branch
                    run_cmd(["git", "checkout", ORION], cwd=PROJECT_PATH)

    elif branch in (YEW, MAIN):
        # interactive
        log(f"Interactive branch: {branch}.")
        changed_map = interactive_apply(actions, branch)
        # commit selected changes
        summary = summarize_changes_for_commit(changed_map)
        if summary:
            commit_msg = f"{COMMIT_PREFIX}: {summary}"
            make_commit_if_needed(commit_msg, branch)

    elif branch == ROOTS:
        # allow more frequent commits but remain cautious
        log("ROOTS branch: applying but keep commits more frequent for experimentation.")
        changed_map = apply_actions(actions, branch)
        summary = summarize_changes_for_commit(changed_map)
        if summary:
            commit_msg = f"{COMMIT_PREFIX}-roots: {summary}"
            make_commit_if_needed(commit_msg, branch)
    else:
        log(f"Branch {branch} not recognized by workflow. No action taken.")

    log("=== auto_patch_worker_full END ===")

# ------------ UTIL: summarizer for commit message ------------
def summarize_changes_for_commit(changed_map: dict) -> str:
    if not changed_map:
        return ""
    # summarize by folder and action count
    folders = defaultdict(int)
    actions_count = 0
    files = list(changed_map.keys())
    for f, acts in changed_map.items():
        actions_count += len(acts)
        folder = str(Path(f).parent)
        folders[folder] += 1
    # pick top folders
    top = sorted(folders.items(), key=lambda x: -x[1])[:3]
    folder_summary = ",".join([f"{p}:{c}" for p, c in top])
    file_count = len(files)
    return f"{actions_count} fixes across {file_count} files ({folder_summary})"

# run
if __name__ == "__main__":
    main()