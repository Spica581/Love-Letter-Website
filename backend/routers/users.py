from fastapi import APIRouter, HTTPException, Depends
from fastapi.security import OAuth2PasswordRequestForm
from models import User
from database import db
from auth import hash_password, verify_password, create_access_token

router = APIRouter(prefix="/users", tags=["users"])

@router.post("/signup")
async def signup(username: str, password: str):
    if db.users.find_one({"username": username}):
        raise HTTPException(400, "Username already exists")
    
    hashed = hash_password(password)
    user = {"username": username, "password": hashed, "tier": 1}
    db.users.insert_one(user)
    
    # Auto login after signup
    token = create_access_token({"sub": username})
    
    return {
        "message": "Account created successfully!",
        "access_token": token,
        "token_type": "bearer",
        "tier": 1
    }

@router.post("/login")
async def login(form_data: OAuth2PasswordRequestForm = Depends()):
    user = db.users.find_one({"username": form_data.username})
    if not user or not verify_password(form_data.password, user["password"]):
        raise HTTPException(401, "Invalid username or password")
    
    token = create_access_token({"sub": form_data.username})
    return {
        "access_token": token,
        "token_type": "bearer",
        "tier": user.get("tier", 1)
    }