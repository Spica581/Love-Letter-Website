import os
from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from .routers import users, letters, uploads

app = FastAPI()
app.include_router(users.router)
app.include_router(letters.router)
app.include_router(uploads.router)
app.mount("/static", StaticFiles(directory="uploads"), name="static")

# Public route for shared letters
@app.get("/letter/{letter_id}")
async def view_letter(letter_id: str):
    return await letters.get_letter(letter_id)  # Returns JSON for frontend to render
