// src/components/TODO.md

# Fichiers TODO pour le projet (générés)

> Document central contenant les modèles de TODO et le squelette du worker automatique.

---

## Chemin : `src/components/TODO.md`
Contenu modèle pour les TODOs des composants React / UI.

```
# src/components/TODO.md

## But
Centraliser les tâches en attente pour les composants UI.

## Template TODO (copy/paste pour chaque composant)
- [ ] **Composant :** `ComponentName`
  - Path: `src/components/ComponentName/`
  - Description: courte description du rôle du composant
  - Priorité: High / Medium / Low
  - Tickets liés: #123, #124
  - Tests: unit / integration
  - Notes de style: tailwind / shadcn / accessibility
  - Étapes :
    1. Créer le fichier `index.tsx`
    2. Ajouter props et types dans `types.ts`
    3. Ajouter tests `ComponentName.test.tsx`
    4. Documentation `README.md`

## Exemples rapides
- [ ] `Header` — wireup responsive, accessible
- [ ] `TodoList` — stateful, fetch API

---
```

---

## Chemin : `todos/REVISE_OLD_CHATS.md`
Checklist et méthode pour réviser les anciens chats et en extraire des tâches actionnables.

```
# todos/REVISE_OLD_CHATS.md

## Objectif
Parcourir les anciens échanges, extraire les actions, regrouper les tâches et prioriser.

## Méthode
1. Lister les conversations pertinentes (par date / tag / sujet).
2. Pour chaque conversation :
   - Extraire les demandes actionnables (création de fichier, correction de bug, feature).
   - Normaliser en tickets TODO: titre, description, priorité, fichier cible, étapes.
3. Dédupliquer et fusionner les doublons.
4. Générer fichiers TODO correspondants dans `src/components/` et `todos/`.

## Outils suggérés
- Script: `scripts/extract_todos_from_chats.py`
- Format de sortie: Markdown + JSON pour ingestion automatique

```

---

## Chemin : `src/worker/worker.py` (squelette Python — worker asynchrone / scheduler)
Un worker simple qui lit les TODOs (JSON/MD), exécute des tâches basiques (création de fichiers, génération), et peut être étendu pour CI/CD.

```
# src/worker/worker.py
"""
Squelette de worker automatique.
Fonctions:
 - scan_todos(): lit todos/*.md ou todos/*.json
 - create_files_from_todos(): crée les fichiers indiqués
 - run_periodic(): loop principal (peut être appelé depuis un cron ou systemd)
"""
from pathlib import Path
import json
import time

TODOS_DIR = Path('todos')
PROJECT_ROOT = Path('.')


def scan_todos():
    todos = []
    for f in TODOS_DIR.glob('**/*.json'):
        try:
            data = json.loads(f.read_text())
            todos.extend(data if isinstance(data, list) else [data])
        except Exception:
            # fallback: parse markdown heuristically
            text = f.read_text()
            # TODO: extraire titres et checkboxes
    return todos


def create_file(path: str, content: str):
    p = PROJECT_ROOT / path
    p.parent.mkdir(parents=True, exist_ok=True)
    p.write_text(content, encoding='utf-8')
    print(f"CREATED: {p}")


def create_files_from_todos(todos):
    for t in todos:
        # t expected fields: target_path, template
        target = t.get('target_path')
        template = t.get('template', '')
        if target:
            create_file(target, template)


def run_once():
    todos = scan_todos()
    create_files_from_todos(todos)


if __name__ == '__main__':
    run_once()
```

---

## Chemin : `scripts/generate_todos.py` (node / python alternative)
Génère automatiquement `todos/*.json` depuis les anciens chats (exportés).

```
# scripts/generate_todos.py
# Script placeholder: parse exported chat transcripts and create todos JSON
# Input: folder `chats_exported/` contenant .txt ou .json

from pathlib import Path
import re, json

EXPORT_DIR = Path('chats_exported')
OUT_DIR = Path('todos')
OUT_DIR.mkdir(exist_ok=True)

# méthode simple: détecter lignes contenant mots-clés "TODO", "create file", "worker"

keywords = ['todo', 'create file', 'worker', 'fix', 'bug', 'implement', 'créer']

for f in EXPORT_DIR.glob('*.txt'):
    text = f.read_text(encoding='utf-8')
    items = []
    for line in text.splitlines():
        low = line.lower()
        if any(k in low for k in keywords):
            items.append({'source_file': str(f), 'line': line.strip()})
    if items:
        out = OUT_DIR / (f.stem + '.json')
        out.write_text(json.dumps(items, ensure_ascii=False, indent=2))
        print('WROTE', out)
```

---

## Chemin : `README_TODO_PROCESS.md`
Explication courte du flux de travail pour finaliser le worker automatique.

```
# README_TODO_PROCESS.md

1. Exporter anciens chats dans `chats_exported/` (format .txt ou .json).
2. Lancer `python scripts/generate_todos.py` -> produit `todos/*.json`.
3. Lancer `python src/worker/worker.py` -> crée fichiers cibles à partir des todos.
4. Vérifier `git status` et valider les fichiers.

Notes:
- Adapter `scan_todos()` pour parser markdown si nécessaire.
- Ajouter un job cron / systemd pour exécuter le worker régulièrement.
```

---

## Checklist initiale — Priorité immédiate
- [ ] `src/components/TODO.md` (créé)
- [ ] `todos/REVISE_OLD_CHATS.md` (créé)
- [ ] `src/worker/worker.py` (squelette créé)
- [ ] `scripts/generate_todos.py` (squelette créé)
- [ ] Exporter vos anciens chats dans `chats_exported/`
- [ ] Lancer le script de génération et exécuter le worker

---

## Notes du créateur
- J'ai inclus les chemins de fichiers dans chaque bloc, comme demandé.
- Ces fichiers sont des templates — ils doivent être adaptés selon votre stack (Node/TS, Python, Docker).
- Si vous voulez que je convertisse le worker en Node.js (worker.ts) ou que je génère les todos directement depuis l'API des conversations, dites-le et je produirai le code.

---

Fin du fichier central des TODOs.
