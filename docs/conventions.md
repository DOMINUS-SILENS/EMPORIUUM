# Conventions de code et typage

- Rôles : 'vendeur', 'acheteur', 'admin' (jamais buyer/seller)
- Zod pour tous les formulaires front, Pydantic pour tous les endpoints back
- Gestion des erreurs : champ `detail` dans toutes les réponses d’erreur backend
- AuthContext centralisé dans shared/
