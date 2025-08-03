# Backend E-Commerce Platform

Backend FastAPI pour la plateforme e-commerce avec authentification JWT et gestion des rôles.

## Prérequis

- Python 3.8+
- PostgreSQL 13+
- Pipenv (recommandé) ou pip

## Installation rapide

1. Cloner le dépôt
2. Créer un fichier `.env` (voir `.env.example`)
3. Installer les dépendances :
   ```bash
   pip install --dev
   pip shell
   ```
4. Initialiser la base de données :
   ```bash
   python -m db.init_db
   ```
5. Démarrer le serveur :
   ```bash
   uvicorn src.main:app --reload
   ```

## Accès

- API : http://localhost:8000
- Documentation : http://localhost:8000/docs
- Compte admin : email et mot de passe définis dans `.env`

## Structure du projet

```
backend/
├── src/
│   ├── api/          # Points de terminaison API
│   ├── core/         # Configuration et sécurité
│   ├── db/           # Configuration et modèles de base de données
│   ├── models/       # Modèles SQLAlchemy
│   ├── schemas/      # Schémas Pydantic
│   └── services/     # Logique métier
└── tests/            # Tests automatisés
```

## Variables d'environnement

Copiez `.env.example` vers `.env` et configurez :

- `POSTGRES_*` : Configuration de la base de données
- `SECRET_KEY` : Clé secrète pour JWT
- `FIRST_SUPERUSER_*` : Crédentials du compte admin

## Démarrage avec Docker

```bash
docker-compose up --build
```

## Tests

```bash
pytest
```

## Documentation

Voir la documentation complète dans `docs/`.
