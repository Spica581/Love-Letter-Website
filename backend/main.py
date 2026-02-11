# backend/main.py
import os
from dotenv import load_dotenv

# Load backend/.env regardless of working directory
BASE_DIR = os.path.dirname(__file__)
load_dotenv(os.path.join(BASE_DIR, ".env"))

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

# Import routers after load_dotenv so database can read env vars
from routers import admin, letters, uploads, users

app = FastAPI(title="Love Letter")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers under /api
app.include_router(admin, prefix="/api")
app.include_router(letters, prefix="/api")
app.include_router(uploads, prefix="/api")
app.include_router(users, prefix="/api")

# Serve uploaded static files (adjust directory if different)
app.mount("/static", StaticFiles(directory="uploads"), name="static")

# Temporary debug route to confirm env is loaded (remove after verifying)
from fastapi import APIRouter
debug = APIRouter()

@debug.get("/debug/env")
def debug_env():
    import os
    return {
        "MONGODB_URI_present": bool(os.getenv("MONGODB_URI")),
        "MONGODB_NAME": os.getenv("MONGODB_NAME") or "",
        "ADMIN_PASSWORD_present": bool(os.getenv("ADMIN_PASSWORD"))
    }

app.include_router(debug)
