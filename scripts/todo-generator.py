#!/usr/bin/env python3
import os
from pathlib import Path

# Racine du projet
BASE = Path(__file__).resolve().parent.parent

# Répertoires cibles pour les TODO.md
TARGET_DIRS = [
    BASE / "src" / "app",
    BASE / "src" / "components",
    BASE / "src" / "hooks",
    BASE / "src" / "features",
    BASE / "src" / "lib",
    BASE / "src" / "scripts",
    BASE / "tools",
    BASE / "scripts",
    ]

# Contenu type de TODO.md
TODO_TEMPLATE = """# 📌 TODO

- [ ] Ajouter tâches spécifiques à ce module
- [ ] Organiser le backlog
- [ ] Assigner responsabilités
"""

def ensure_todo_file(path: Path):
    """Crée un TODO.md si absent"""
    path.mkdir(parents=True, exist_ok=True)
    todo_file = path / "TODO.md"
    if not todo_file.exists():
        todo_file.write_text(TODO_TEMPLATE, encoding="utf-8")
        print(f"✅ Créé : {todo_file}")
    else:
        print(f"⏭️ Déjà présent : {todo_file}")

def main():
    for d in TARGET_DIRS:
        ensure_todo_file(d)

if __name__ == "__main__":
    main()
