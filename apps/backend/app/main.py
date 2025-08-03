from fastapi import FastAPI
from app.core.config import settings

app = FastAPI(title="EMPORIUM Backend")

@app.get("/")
def read_root():
    return {"message": "Bienvenue dans le backend sacré d’EMPORIUM"}
