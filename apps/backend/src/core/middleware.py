import time
import json
from typing import Callable, Awaitable

from fastapi import Request, Response
from starlette.middleware.base import BaseHTTPMiddleware, RequestResponseEndpoint

from core.logging_config import get_logger

logger = get_logger(__name__)

class LoggingMiddleware(BaseHTTPMiddleware):
    """Middleware pour le logging des requêtes et réponses.
    
    Enregistre les informations de base sur chaque requête et réponse,
    y compris le temps d'exécution.
    """
    
    async def dispatch(self, request: Request, call_next: RequestResponseEndpoint) -> Response:
        # Enregistrement de la requête entrante
        request_id = request.headers.get('X-Request-ID', 'no-request-id')
        logger.info(
            "Requête reçue",
            extra={
                "request_id": request_id,
                "method": request.method,
                "url": str(request.url),
                "client": f"{request.client.host}:{request.client.port}" if request.client else "unknown",
                "headers": dict(request.headers),
                "query_params": dict(request.query_params),
            }
        )
        
        # Mesure du temps d'exécution
        start_time = time.time()
        
        try:
            # Appel du prochain middleware ou du gestionnaire de route
            response = await call_next(request)
            process_time = time.time() - start_time
            
            # Enregistrement de la réponse
            logger.info(
                "Réponse envoyée",
                extra={
                    "request_id": request_id,
                    "status_code": response.status_code,
                    "process_time": f"{process_time:.4f}s",
                    "response_headers": dict(response.headers),
                }
            )
            
            # Ajout du temps de traitement dans les en-têtes de réponse
            response.headers["X-Process-Time"] = str(process_time)
            response.headers["X-Request-ID"] = request_id
            
            return response
            
        except Exception as exc:
            # Gestion des erreurs non capturées
            process_time = time.time() - start_time
            logger.error(
                f"Erreur lors du traitement de la requête: {str(exc)}",
                extra={
                    "request_id": request_id,
                    "process_time": f"{process_time:.4f}s",
                    "error": str(exc),
                    "error_type": exc.__class__.__name__,
                },
                exc_info=True
            )
            raise


def setup_middlewares(app):
    """Configure les middlewares de l'application.
    
    Args:
        app: L'application FastAPI
    """
    # Ajout du middleware de logging
    app.add_middleware(LoggingMiddleware)
    
    logger.info("Middlewares configurés avec succès")
