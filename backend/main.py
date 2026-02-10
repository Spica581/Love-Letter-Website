from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from dotenv import load_dotenv
import os

load_dotenv()

from routers import users, letters, uploads

app = FastAPI(title="Love Letter App")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(users.router)
app.include_router(letters.router)
app.include_router(uploads.router)

app.mount("/static", StaticFiles(directory="uploads"), name="static")

@app.get("/")
def home():
    return {"message": "Love Letter API is running"}
