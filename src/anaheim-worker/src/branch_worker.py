import subprocess
from pathlib import Path

PROJECT_PATH = Path("../anaheim-putsch-self-governance-solana-dapp")
WORKER_PATH = Path(__file__).parent / "worker.py"

# Branches
ORION = "Orion"
ORION_EXPLORATION = "Orion-Exploration"
ROOTS = "Roots"
YEW = "Yew"
MAIN = "main"

def get_current_branch():
    """Retourne la branche git active."""
    result = subprocess.run(["git", "rev-parse", "--abbrev-ref", "HEAD"],
                            cwd=PROJECT_PATH, capture_output=True, text=True)
    branch = result.stdout.strip()
    print(f"🌿 Branche active : {branch}")
    return branch

def checkout_branch(branch_name: str):
    """Switch sur une branche donnée."""
    subprocess.run(["git", "checkout", branch_name], cwd=PROJECT_PATH)
    print(f"✅ Switched to branch {branch_name}")

def commit_and_push(branch_name: str, message: str):
    """Commit et push les changements automatiquement."""
    subprocess.run(["git", "add", "."], cwd=PROJECT_PATH)
    subprocess.run(["git", "commit", "-m", message], cwd=PROJECT_PATH)
    subprocess.run(["git", "push", "origin", branch_name], cwd=PROJECT_PATH)
    print(f"🚀 Commit & push sur {branch_name} : {message}")

def run_worker():
    """Execute le worker auto-patcher sur la branche active."""
    print("🤖 Lancement du worker auto-patcher...")
    subprocess.run(["python3", str(WORKER_PATH)], cwd=PROJECT_PATH)
    print("✅ Worker terminé")

def propagate_to_yew():
    """Merge les fixes validés vers Yew."""
    checkout_branch(YEW)
    subprocess.run(["git", "merge", ORION, "--no-ff", "-m", "Merge fixes depuis Orion"], cwd=PROJECT_PATH)
    print("🔄 Orion fusionné vers Yew")

def main():
    branch = get_current_branch()
    if branch in [ORION, ORION_EXPLORATION]:
        run_worker()
        propagate_to_yew()
        commit_and_push(YEW, "✅ Fixes automatiques appliqués depuis worker")
    elif branch == ROOTS:
        print("⚠️ Roots est branch live, pas d’auto patch direct. Utiliser Orion pour fixes.")
    elif branch == YEW:
        print("ℹ️ Yew est pré-main, on peut valider ou tester avant main.")
    elif branch == MAIN:
        print("⚠️ Main est protégé. Ne pas appliquer directement le worker.")
    else:
        print(f"⚠️ Branche {branch} inconnue. Vérifier le workflow.")

if __name__ == "__main__":
    main()
