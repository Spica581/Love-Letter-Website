from fastapi import APIRouter, UploadFile, File, HTTPException, Depends
import os
import uuid
from auth import get_current_user

router = APIRouter(prefix="/uploads", tags=["uploads"])

UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

@router.post("/music")
async def upload_music(file: UploadFile = File(...), current_user: str = Depends(get_current_user)):
    if not file.filename.lower().endswith(".mp3"):
        raise HTTPException(400, "Only .mp3 files allowed")
    
    file_id = str(uuid.uuid4())
    file_path = f"{UPLOAD_DIR}/{file_id}.mp3"
    
    with open(file_path, "wb") as f:
        content = await file.read()
        f.write(content)
    
    return {"music_url": f"/static/{file_id}.mp3"}
