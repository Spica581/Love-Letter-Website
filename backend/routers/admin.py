# backend/routers/admin.py
from fastapi import APIRouter, Query, HTTPException
from typing import List, Dict, Any
from database import db
from models import Letter
from auth import check_admin_password
from bson import ObjectId
import os

router = APIRouter(prefix="/admin", tags=["admin"])

@router.get("/all")
async def get_all_letters(password: str = Query(...)):
    # Validate admin password
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
async def create_letter(payload: Dict[str, Any], password: str = Query(...)):
    check_admin_password(password)
    # Ensure payload contains the password field (if provided by frontend)
    # Insert the document exactly as received
    # Validate admin password

    check_admin_password(password)

    # Insert the document
    try:
        result = db.letters.insert_one(payload)
    except Exception as e:
        raise HTTPException(status_code=500, detail="Failed to create letter")
    return {"id": str(result.inserted_id)}