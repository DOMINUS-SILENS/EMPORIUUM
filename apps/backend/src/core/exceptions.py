from http import HTTPStatus
from typing import Any, Dict, Optional

from fastapi import HTTPException
from fastapi.exceptions import RequestValidationError
from pydantic import ValidationError
from starlette.requests import Request
from starlette.responses import JSONResponse

from src.core.config import settings


class AppExceptionCase(Exception):
    """Classe de base pour les exceptions personnalisées de l'application."""
    
    def __init__(self, status_code: int, context: Dict[str, Any] = None):
        self.status_code = status_code
        self.context = context or {}
        super().__init__()

    def __str__(self):
        return f"<{self.__class__.__name__}>(status_code={self.status_code}, context={self.context})"


class NotFoundException(AppExceptionCase):
    """Exception levée lorsqu'une ressource n'est pas trouvée."""
    
    def __init__(self, context: Dict[str, Any] = None):
        super().__init__(HTTPStatus.NOT_FOUND, context)


class UnauthorizedException(AppExceptionCase):
    """Exception levée lorsqu'une authentification est requise ou a échoué."""
    
    def __init__(self, context: Dict[str, Any] = None):
        super().__init__(HTTPStatus.UNAUTHORIZED, context)


class ForbiddenException(AppExceptionCase):
    """Exception levée lorsque l'utilisateur n'a pas les permissions nécessaires."""
    
    def __init__(self, context: Dict[str, Any] = None):
        super().__init__(HTTPStatus.FORBIDDEN, context)


class BadRequestException(AppExceptionCase):
    """Exception levée pour une requête invalide."""
    
    def __init__(self, context: Dict[str, Any] = None):
        super().__init__(HTTPStatus.BAD_REQUEST, context)


class ConflictException(AppExceptionCase):
    """Exception levée en cas de conflit (par exemple, email déjà utilisé)."""
    
    def __init__(self, context: Dict[str, Any] = None):
        super().__init__(HTTPStatus.CONFLICT, context)


class InternalServerErrorException(AppExceptionCase):
    """Exception levée pour les erreurs internes du serveur."""
    
    def __init__(self, context: Dict[str, Any] = None):
        super().__init__(HTTPStatus.INTERNAL_SERVER_ERROR, context)


class ServiceUnavailableException(AppExceptionCase):
    """Exception levée lorsqu'un service externe est indisponible."""
    
    def __init__(self, context: Dict[str, Any] = None):
        super().__init__(HTTPStatus.SERVICE_UNAVAILABLE, context)


async def http_exception_handler(request: Request, exc: HTTPException):
    """Gestionnaire d'erreurs pour les exceptions HTTP standard de FastAPI."""
    return JSONResponse(
        status_code=exc.status_code,
        content={
            "error": {
                "code": exc.status_code,
                "message": exc.detail,
                "details": getattr(exc, "details", None),
                "path": request.url.path,
            }
        },
    )


async def validation_exception_handler(request: Request, exc: RequestValidationError):
    """Gestionnaire d'erreurs pour les erreurs de validation Pydantic."""
    errors = []
    for error in exc.errors():
        field = ".".join(str(loc) for loc in error["loc"] if loc != "body")
        errors.append(
            {
                "field": field or "body",
                "message": error["msg"],
                "type": error["type"],
            }
        )
    
    return JSONResponse(
        status_code=HTTPStatus.UNPROCESSABLE_ENTITY,
        content={
            "error": {
                "code": HTTPStatus.UNPROCESSABLE_ENTITY,
                "message": "Erreur de validation des données",
                "details": errors,
                "path": request.url.path,
            }
        },
    )


async def app_exception_handler(request: Request, exc: AppExceptionCase):
    """Gestionnaire d'erreurs pour les exceptions personnalisées de l'application."""
    return JSONResponse(
        status_code=exc.status_code,
        content={
            "error": {
                "code": exc.status_code,
                "message": HTTPStatus(exc.status_code).phrase,
                "details": exc.context,
                "path": request.url.path,
            }
        },
    )


async def unhandled_exception_handler(request: Request, exc: Exception):
    """Gestionnaire d'erreurs pour les exceptions non gérées."""
    if settings.DEBUG:
        import traceback
        traceback.print_exc()
    
    return JSONResponse(
        status_code=HTTPStatus.INTERNAL_SERVER_ERROR,
        content={
            "error": {
                "code": HTTPStatus.INTERNAL_SERVER_ERROR,
                "message": "Une erreur inattendue s'est produite",
                "details": str(exc) if settings.DEBUG else None,
                "path": request.url.path,
            }
        },
    )


def register_exception_handlers(app):
    """Enregistre les gestionnaires d'exceptions personnalisés dans l'application FastAPI."""
    app.add_exception_handler(HTTPException, http_exception_handler)
    app.add_exception_handler(RequestValidationError, validation_exception_handler)
    app.add_exception_handler(ValidationError, validation_exception_handler)
    app.add_exception_handler(AppExceptionCase, app_exception_handler)
    app.add_exception_handler(Exception, unhandled_exception_handler)
    return app
