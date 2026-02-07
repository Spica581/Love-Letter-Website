from fastapi import APIRouter, UploadFile, File, Depends
from ..auth import get_current_user
import os
import uuid

router = APIRouter(prefix="/uploads", tags=["uploads"])

@router.post("/music")
async def upload_music(file: UploadFile = File(...), current_user: str = Depends(get_current_user)):
    if not file.filename.endswith(".mp3"):
        raise HTTPException(400, "MP3 only")
    file_id = str(uuid.uuid4())
    path = f"uploads/{file_id}.mp3"
    os.makedirs("uploads", exist_ok=True)
    with open(path, "wb") as f:
        f.write(await file.read())
    return {"music_url": f"/static/{file_id}.mp3"}  # Serve via FastAPI static
