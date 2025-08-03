import logging
import logging.config
import os
from pathlib import Path
from typing import Dict, Any

from pythonjsonlogger import jsonlogger


def setup_logging() -> None:
    """Configure la journalisation pour l'application.
    
    Configure à la fois la journalisation au format JSON pour la production
    et la journalisation en clair pour le développement.
    """
    log_level = os.getenv("LOG_LEVEL", "INFO").upper()
    log_format = os.getenv("LOG_FORMAT", "json").lower()
    
    # Créer le répertoire de logs s'il n'existe pas
    log_dir = Path("logs")
    log_dir.mkdir(exist_ok=True)
    
    log_config: Dict[str, Any] = {
        "version": 1,
        "disable_existing_loggers": False,
        "formatters": {
            "json": {
                "()": "pythonjsonlogger.jsonlogger.JsonFormatter",
                "format": "%(asctime)s %(levelname)s %(name)s %(message)s",
                "timestamp": True,
            },
            "simple": {
                "format": "%(asctime)s - %(name)s - %(levelname)s - %(message)s",
                "datefmt": "%Y-%m-%d %H:%M:%S",
            },
        },
        "handlers": {
            "console": {
                "class": "logging.StreamHandler",
                "level": log_level,
                "formatter": "simple" if log_format != "json" else "json",
                "stream": "ext://sys.stdout",
            },
            "file": {
                "class": "logging.handlers.RotatingFileHandler",
                "level": log_level,
                "formatter": "json",
                "filename": log_dir / "app.log",
                "maxBytes": 10485760,  # 10MB
                "backupCount": 5,
                "encoding": "utf8",
            },
            "error_file": {
                "class": "logging.handlers.RotatingFileHandler",
                "level": "ERROR",
                "formatter": "json",
                "filename": log_dir / "error.log",
                "maxBytes": 10485760,  # 10MB
                "backupCount": 5,
                "encoding": "utf8",
            },
        },
        "loggers": {
            "": {  # root logger
                "level": log_level,
                "handlers": ["console", "file", "error_file"],
                "propagate": False,
            },
            "uvicorn": {
                "level": log_level,
                "handlers": ["console", "file"],
                "propagate": False,
            },
            "uvicorn.error": {
                "level": log_level,
                "handlers": ["console", "file"],
                "propagate": False,
            },
            "uvicorn.access": {
                "level": "INFO",
                "handlers": ["console", "file"],
                "propagate": False,
            },
            "sqlalchemy": {
                "level": "WARNING",
                "handlers": ["console", "file"],
                "propagate": False,
            },
        },
    }
    
    # Appliquer la configuration
    logging.config.dictConfig(log_config)
    
    # Désactiver les logs de niveau inférieur à WARNING pour les bibliothèques tierces
    for name in logging.root.manager.loggerDict:
        if name not in log_config["loggers"] and not name.startswith("app"):
            logging.getLogger(name).setLevel(logging.WARNING)


def get_logger(name: str) -> logging.Logger:
    """Retourne un logger configuré avec le nom spécifié.
    
    Args:
        name: Nom du logger (généralement __name__)
        
    Returns:
        Un logger configuré
    """
    logger = logging.getLogger(name)
    return logger
