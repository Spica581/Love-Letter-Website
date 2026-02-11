# backend/routers/letters.py
from fastapi import APIRouter, HTTPException, Query
from bson import ObjectId
import logging
from database import get_db

router = APIRouter(prefix="/letters", tags=["letters"])
logger = logging.getLogger("uvicorn.error")

@router.get("/{letter_id}")
def get_letter(letter_id: str, password: str = Query(None)):
    try:
        oid = ObjectId(letter_id)
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid letter id")

    try:
        db = get_db()
        doc = db.letters.find_one({"_id": oid})
    except Exception as e:
        logger.exception("DB query failed for letter_id=%s", letter_id)
        raise HTTPException(status_code=503, detail="Database unavailable")

    if not doc:
        raise HTTPException(status_code=404, detail="Letter not found")

    stored_pw = (doc.get("password") or "").strip()
    if stored_pw and (not password or password.strip() != stored_pw):
        raise HTTPException(status_code=403, detail="Invalid password")

    doc["id"] = str(doc["_id"])
    doc.pop("_id", None)
    return doc
