from fastapi import APIRouter, Depends, HTTPException
from ..models import Letter
from ..database import db
from ..auth import get_current_user

router = APIRouter(prefix="/letters", tags=["letters"])

@router.post("/")
async def create_letter(letter: Letter, current_user: str = Depends(get_current_user)):
    user = db.users.find_one({"username": current_user})
    if letter.tier > user["tier"]:
        raise HTTPException(403, "Upgrade tier")
    letter.user_id = user["_id"]
    result = db.letters.insert_one(letter.dict(by_alias=True))
    return {"id": str(result.inserted_id)}

@router.get("/{letter_id}")
async def get_letter(letter_id: str):
    letter = db.letters.find_one({"_id": ObjectId(letter_id)})
    if not letter:
        raise HTTPException(404, "Not found")
    return Letter(**letter).dict()

@router.put("/{letter_id}")
async def update_letter(letter_id: str, updates: dict, current_user: str = Depends(get_current_user)):
    letter = db.letters.find_one({"_id": ObjectId(letter_id), "user_id": ObjectId(current_user)})
    if not letter:
        raise HTTPException(404, "Not found")
    db.letters.update_one({"_id": ObjectId(letter_id)}, {"$set": updates})
    return {"msg": "Updated"}
