# Architecture du projet E-Commerce

- Microservices : backend (FastAPI), 3 apps React (welcome, vendeur, acheteur)
- Authentification JWT centralisée, rôle transmis dans le token
- Schémas de validation synchronisés (Zod côté front, Pydantic côté back)
- Docker-compose pour orchestration locale/staging/prod

## Diagramme général

> Ajouter un diagramme d’architecture ici (ex : draw.io, mermaid, etc.)
