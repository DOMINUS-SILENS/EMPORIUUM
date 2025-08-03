import logging
from datetime import datetime, timedelta
from typing import List, Dict, Any

from sqlalchemy.orm import Session

from src.core.config import settings
from src.core.security import get_password_hash
from .base import Base, SessionLocal, engine
from .models import User, UserRole  # Updated to use db.models
# Uncomment and update these imports when the models are available
# from .models import Product
# from .models import Purchase, PurchaseStatus

# Configuration du logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def init_db() -> None:
    """Initialise la base de données avec des données de test."""
    logger.info("Début de l'initialisation de la base de données...")
    
    # Créer les tables si elles n'existent pas
    Base.metadata.create_all(bind=engine)
    
    db = SessionLocal()
    
    try:
        # Vérifier si des utilisateurs existent déjà
        if db.query(User).first() is not None:
            logger.info("La base de données contient déjà des données. Rien à faire.")
            return
        
        logger.info("Création des données initiales...")
        
        # Créer l'utilisateur administrateur
        admin_user = User(
            email=settings.FIRST_SUPERUSER_EMAIL,
            hashed_password=get_password_hash(settings.FIRST_SUPERUSER_PASSWORD),
            full_name=settings.FIRST_SUPERUSER_FULL_NAME,
            is_active=True,
            is_superuser=True,
            role=UserRole.ADMIN,
            created_at=datetime.utcnow(),
            updated_at=datetime.utcnow()
        )
        db.add(admin_user)
        db.flush()  # Pour obtenir l'ID de l'utilisateur
        
        # Créer des utilisateurs de test
        users_data = [
            {
                "email": "vendeur1@example.com",
                "password": "vendeur123",
                "full_name": "Jean Vendeur",
                "role": "vendeur",
                "is_active": True,
            },
            {
                "email": "acheteur1@example.com",
                "password": "acheteur123",
                "full_name": "Marie Acheteuse",
                "role": "acheteur",
                "is_active": True,
            },
            {
                "email": "vendeur2@example.com",
                "password": "vendeur456",
                "full_name": "Sophie Commerçante",
                "role": "vendeur",
                "is_active": True,
            },
            {
                "email": "acheteur2@example.com",
                "password": "acheteur456",
                "full_name": "Pierre Acheteur",
                "role": "acheteur",
                "is_active": True,
            },
        ]
        
        users = [admin_user]
        for user_data in users_data:
            user = User(
                email=user_data["email"],
                hashed_password=get_password_hash(user_data["password"]),
                full_name=user_data["full_name"],
                role=user_data["role"],
                is_active=user_data["is_active"],
                is_superuser=False,
                created_at=datetime.utcnow(),
                updated_at=datetime.utcnow()
            )
            db.add(user)
            users.append(user)
        
        db.flush()  # Pour obtenir les IDs des utilisateurs
        
        # Créer des catégories de produits
        categories = [
            "Électronique", "Informatique", "Mode", "Maison", "Beauté", "Sport"
        ]
        
        # Créer des produits de test
        vendeurs = [u for u in users if u.role == "vendeur"]
        acheteurs = [u for u in users if u.role == "acheteur"]
        
        products_data = [
            {
                "name": "Ordinateur portable",
                "description": "Ordinateur portable haute performance avec écran 15.6\"",
                "price": 999.99,
                "stock_quantity": 10,
                "category": "Informatique",
                "image_url": "https://example.com/laptop.jpg",
            },
            {
                "name": "Smartphone dernier cri",
                "description": "Dernier modèle de smartphone avec appareil photo haute résolution",
                "price": 799.99,
                "stock_quantity": 25,
                "category": "Électronique",
                "image_url": "https://example.com/phone.jpg",
            },
            {
                "name": "Casque audio sans fil",
                "description": "Casque audio Bluetooth avec réduction de bruit",
                "price": 199.99,
                "stock_quantity": 15,
                "category": "Électronique",
                "image_url": "https://example.com/headphones.jpg",
            },
            {
                "name": "Sac à dos élégant",
                "description": "Sac à dos spacieux et élégant pour un usage quotidien",
                "price": 59.99,
                "stock_quantity": 30,
                "category": "Mode",
                "image_url": "https://example.com/backpack.jpg",
            },
            {
                "name": "Montre connectée",
                "description": "Montre connectée avec suivi d'activité et notifications",
                "price": 149.99,
                "stock_quantity": 12,
                "category": "Électronique",
                "image_url": "https://example.com/smartwatch.jpg",
            },
        ]
        
        products = []
        for i, product_data in enumerate(products_data):
            # Répartir les produits entre les vendeurs
            vendeur = vendeurs[i % len(vendeurs)]
            
            product = ProductDB(
                name=product_data["name"],
                description=product_data["description"],
                price=product_data["price"],
                stock_quantity=product_data["stock_quantity"],
                category=product_data["category"],
                image_url=product_data["image_url"],
                seller_id=vendeur.id,
                created_at=datetime.utcnow(),
                updated_at=datetime.utcnow()
            )
            db.add(product)
            products.append(product)
        
        db.flush()  # Pour obtenir les IDs des produits
        
        # Créer des achats de test
        purchases_data = [
            {
                "product_index": 0,  # Ordinateur portable
                "buyer_index": 0,    # Premier acheteur
                "quantity": 1,
                "unit_price": 999.99,
                "status": PurchaseStatus.DELIVERED,
                "shipping_address": "123 Rue de la Paix",
                "shipping_city": "Paris",
                "shipping_postal_code": "75001",
                "shipping_country": "France",
                "created_at": datetime.utcnow() - timedelta(days=10),
            },
            {
                "product_index": 1,  # Smartphone
                "buyer_index": 0,    # Premier acheteur
                "quantity": 2,
                "unit_price": 799.99,
                "status": PurchaseStatus.SHIPPED,
                "tracking_number": "TRK123456789",
                "shipping_address": "123 Rue de la Paix",
                "shipping_city": "Paris",
                "shipping_postal_code": "75001",
                "shipping_country": "France",
                "created_at": datetime.utcnow() - timedelta(days=3),
            },
            {
                "product_index": 2,  # Casque audio
                "buyer_index": 1,    # Deuxième acheteur
                "quantity": 1,
                "unit_price": 199.99,
                "status": PurchaseStatus.PAID,
                "shipping_address": "456 Avenue des Champs-Élysées",
                "shipping_city": "Lyon",
                "shipping_postal_code": "69002",
                "shipping_country": "France",
                "created_at": datetime.utcnow() - timedelta(days=1),
            },
            {
                "product_index": 3,  # Sac à dos
                "buyer_index": 1,    # Deuxième acheteur
                "quantity": 1,
                "unit_price": 59.99,
                "status": PurchaseStatus.PENDING,
                "shipping_address": "456 Avenue des Champs-Élysées",
                "shipping_city": "Lyon",
                "shipping_postal_code": "69002",
                "shipping_country": "France",
                "created_at": datetime.utcnow() - timedelta(hours=2),
            },
        ]
        
        for purchase_data in purchases_data:
            product = products[purchase_data["product_index"]]
            buyer = acheteurs[purchase_data["buyer_index"]]
            
            purchase = PurchaseDB(
                product_id=product.id,
                buyer_id=buyer.id,
                quantity=purchase_data["quantity"],
                unit_price=purchase_data["unit_price"],
                status=purchase_data["status"],
                tracking_number=purchase_data.get("tracking_number"),
                shipping_address=purchase_data["shipping_address"],
                shipping_city=purchase_data["shipping_city"],
                shipping_postal_code=purchase_data["shipping_postal_code"],
                shipping_country=purchase_data["shipping_country"],
                created_at=purchase_data.get("created_at", datetime.utcnow()),
                updated_at=datetime.utcnow()
            )
            db.add(purchase)
            
            # Mettre à jour le stock du produit si l'achat est validé
            if purchase.status in [PurchaseStatus.PAID, PurchaseStatus.SHIPPED, PurchaseStatus.DELIVERED]:
                product.stock_quantity -= purchase.quantity
        
        # Valider toutes les modifications
        db.commit()
        logger.info("Données initiales créées avec succès!")
        
    except Exception as e:
        db.rollback()
        logger.error(f"Erreur lors de l'initialisation de la base de données: {e}")
        raise
    finally:
        db.close()

if __name__ == "__main__":
    print("Initialisation de la base de données...")
    init_db()
    print("Base de données initialisée avec succès!")
