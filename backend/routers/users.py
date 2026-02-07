from fastapi import APIRouter, Depends, HTTPException
from fastapi.security import OAuth2PasswordRequestForm
from ..models import User
from ..database import db
from ..auth import hash_password, verify_password, create_access_token

router = APIRouter(prefix="/users", tags=["users"])

@router.post("/signup")
async def signup(username: str, password: str):
    if db.users.find_one({"username": username}):
        raise HTTPException(400, "Username exists")
    hashed = hash_password(password)
    user = User(username=username, password=hashed)
    db.users.insert_one(user.dict(by_alias=True))
    return {"msg": "User created"}

@router.post("/login")
async def login(form_data: OAuth2PasswordRequestForm = Depends()):
    user = db.users.find_one({"username": form_data.username})
    if not user or not verify_password(form_data.password, user["password"]):
        raise HTTPException(400, "Invalid credentials")
    token = create_access_token({"sub": form_data.username})
    return {"access_token": token, "token_type": "bearer", "tier": user["tier"]}
