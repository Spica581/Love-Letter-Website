import os
from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from .routers import users, letters, uploads
from pydantic import BaseModel

class Item(BaseModel):
    name: str
    price: float

    class Config:
        validate_by_name = True

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
UPLOAD_DIR = os.path.join(BASE_DIR, "uploads")
os.makedirs(UPLOAD_DIR, exist_ok=True)

FRONTEND_DIR = os.path.join(BASE_DIR, "..", "frontend")

app = FastAPI()

# Routers
app.include_router(users.router)
app.include_router(letters.router)
app.include_router(uploads.router)

# Static files (uploads)
app.mount("/static", StaticFiles(directory=UPLOAD_DIR), name="static")

# Serve frontend files (HTML, CSS, JS, images)
app.mount("/", StaticFiles(directory=FRONTEND_DIR, html=True), name="frontend")

# Root route → serve index.html
@app.get("/")
async def root():
    return FileResponse(os.path.join(FRONTEND_DIR, "index.html"))
