import os
from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse, JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from backend.routers import users, letters, uploads

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
UPLOAD_DIR = os.path.join(BASE_DIR, "uploads")
os.makedirs(UPLOAD_DIR, exist_ok=True)

# point to built frontend
FRONTEND_DIR = os.path.join(BASE_DIR, "..", "frontend", "dist")
INDEX_PATH = os.path.join(FRONTEND_DIR, "index.html")

app = FastAPI()

# CORS for local development (adjust origins for production)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000", "http://localhost:8000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# include routers
app.include_router(users.router)
app.include_router(letters.router)
app.include_router(uploads.router)

# static uploads
app.mount("/static", StaticFiles(directory=UPLOAD_DIR), name="static")

# serve frontend build if it exists
if os.path.isdir(FRONTEND_DIR):
    app.mount("/", StaticFiles(directory=FRONTEND_DIR, html=True), name="frontend")

@app.get("/")
async def root():
    """
    Serve index.html if frontend build exists, otherwise return a helpful JSON message.
    """
    if os.path.exists(INDEX_PATH):
        return FileResponse(INDEX_PATH)
    return JSONResponse(
        {"message": "Frontend not built. In development run the Vite dev server at :5173. To serve from FastAPI build the frontend with `npm run build`."},
        status_code=200,
    )

# SPA fallback for any unmatched path (so client-side routing works)
@app.get("/{full_path:path}")
async def spa_fallback(full_path: str):
    if os.path.exists(INDEX_PATH):
        return FileResponse(INDEX_PATH)
    return JSONResponse({"detail": "Not Found"}, status_code=404)
