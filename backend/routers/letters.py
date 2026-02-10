from fastapi import APIRouter, Depends, HTTPException
from bson import ObjectId
from ..models import Letter
from ..database import db
from ..auth import get_current_user

router = APIRouter(prefix="/letters", tags=["letters"])

@router.post("/")
async def create_letter(letter: Letter, current_user: str = Depends(get_current_user)):
    user = db.users.find_one({"username": current_user})
    if letter.tier > user.get("tier", 1):
        raise HTTPException(403, "You need to upgrade your tier")
    
    letter_dict = letter.dict(by_alias=True)
    letter_dict["user_id"] = str(user["_id"])
    result = db.letters.insert_one(letter_dict)
    return {"id": str(result.inserted_id), "message": "Love letter created!"}

@router.get("/{letter_id}")
async def get_letter(letter_id: str):
    letter = db.letters.find_one({"_id": ObjectId(letter_id)})
    if not letter:
        raise HTTPException(404, "Letter not found")
    return Letter(**letter).dict()
