# backend/routers/admin.py
from fastapi import APIRouter, Query, HTTPException
from typing import List
from database import db
from models import Letter
from auth import check_admin_password
from bson import ObjectId

router = APIRouter(prefix="/admin", tags=["admin"])

@router.get("/all")
async def get_all_letters(password: str = Query(...)):
    check_admin_password(password)
    docs = list(db.letters.find())
    result = []
    for d in docs:
        result.append({
            "id": str(d.get("_id", "")),
            "from_name": d.get("from_name"),
            "to_name": d.get("to_name"),
            "date": d.get("date"),
            "content": d.get("content"),
            "colors": d.get("colors"),
            "hidden_message": d.get("hidden_message"),
            "music_url": d.get("music_url"),
            "tier": d.get("tier"),
        })
    return result

@router.post("/create")
async def create_letter(letter: Letter, password: str = Query(...)):
    check_admin_password(password)
    # Insert using the alias mapping if your model uses aliases
    doc = letter.dict(by_alias=True)
    result = db.letters.insert_one(doc)
    return {"id": str(result.inserted_id)}
