from fastapi import APIRouter, HTTPException, Depends
from bson import ObjectId
import logging
from database import get_db
from models import Letter
from datetime import datetime
import os

router = APIRouter(prefix="/letters", tags=["letters"])
logger = logging.getLogger("uvicorn.error")

ADMIN_TOKEN = os.getenv("ADMIN_PASSWORD")  # Updated!

def admin_only(token: str):
    print(f"Received token: '{token}', Expected: '{ADMIN_TOKEN}'")
    if token != ADMIN_TOKEN:
        raise HTTPException(401, "Admin access required")

@router.post("/")
def create_letter(letter: Letter, admin_token: str):
    admin_only(admin_token)
    db = get_db()
    letter.updatedAt = datetime.utcnow()
    result = db.letters.insert_one(letter.dict(by_alias=True))
    return {"id": str(result.inserted_id), "message": "Letter created!"}

@router.get("/{letter_id}")
def get_letter(letter_id: str):
    try:
        oid = ObjectId(letter_id)
    except:
        raise HTTPException(400, "Invalid letter id")

    db = get_db()
    doc = db.letters.find_one({"_id": oid})
    if not doc:
        raise HTTPException(404, "Letter not found")

    doc["id"] = str(doc["_id"])
    doc.pop("_id", None)
    return doc

@router.put("/{letter_id}")
def update_letter(letter_id: str, updates: dict, admin_token: str):
    admin_only(admin_token)
    try:
        oid = ObjectId(letter_id)
    except:
        raise HTTPException(400, "Invalid letter id")

    db = get_db()
    updates["updatedAt"] = datetime.utcnow()
    result = db.letters.update_one({"_id": oid}, {"$set": updates})
    if result.modified_count == 0:
        raise HTTPException(404, "Letter not found")
    return {"message": "Letter updated"}

@router.delete("/{letter_id}")
def delete_letter(letter_id: str, admin_token: str):
    admin_only(admin_token)
    try:
        oid = ObjectId(letter_id)
    except:
        raise HTTPException(400, "Invalid letter id")

    db = get_db()
    result = db.letters.delete_one({"_id": oid})
    if result.deleted_count == 0:
        raise HTTPException(404, "Letter not found")
    return {"message": "Letter deleted"}

@router.get("/admin/all")
def admin_get_all(admin_token: str):
    admin_only(admin_token)
    db = get_db()
    letters = list(db.letters.find())
    for letter in letters:
        letter["id"] = str(letter["_id"])
        letter.pop("_id", None)
    return letters