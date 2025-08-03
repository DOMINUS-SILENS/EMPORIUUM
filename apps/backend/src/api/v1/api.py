from fastapi import APIRouter

from .endpoints import auth, users, products, orders, analytics, coupons, clients, payments, cart, checkout, rewards, support, admin, wishlist, recommendations, preferences, vendeur, store, settings, chat

# Création du routeur API
api_router = APIRouter()

# Inclusion des routeurs d'endpoints
api_router.include_router(auth.router, prefix="/auth", tags=["auth"])
api_router.include_router(users.router, prefix="/users", tags=["users"])
api_router.include_router(store.router, prefix="/stores", tags=["stores"])
api_router.include_router(products.router, prefix="/products", tags=["products"])
api_router.include_router(orders.router, prefix="/orders", tags=["orders"])
api_router.include_router(analytics.router, prefix="/analytics", tags=["analytics"])
api_router.include_router(coupons.router, prefix="/coupons", tags=["coupons"])
api_router.include_router(clients.router, prefix="/clients", tags=["clients"])
api_router.include_router(payments.router, prefix="/payments", tags=["payments"])
api_router.include_router(vendeur.router, prefix="/vendeur", tags=["vendeur"])
api_router.include_router(settings.router, prefix="/settings", tags=["settings"])
api_router.include_router(chat.router, prefix="/chat", tags=["chat"])
api_router.include_router(cart.router, prefix="/cart", tags=["cart"])
api_router.include_router(checkout.router, prefix="/checkout", tags=["checkout"])
api_router.include_router(rewards.router, prefix="/rewards", tags=["rewards"])
api_router.include_router(support.router, prefix="/support", tags=["support"])
api_router.include_router(admin.router, prefix="/admin", tags=["admin"])
api_router.include_router(wishlist.router, prefix="/wishlist", tags=["wishlist"])
api_router.include_router(recommendations.router, prefix="/recommendations", tags=["recommendations"])
api_router.include_router(preferences.router, prefix="/preferences", tags=["preferences"])
api_router.include_router(vendeur.router, prefix="/vendeur", tags=["vendeur"])
api_router.include_router(store.router, prefix="/store", tags=["store"])
