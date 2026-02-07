from pydantic import BaseModel, Field
from typing import Optional
from bson import ObjectId

class PyObjectId(ObjectId):
    @classmethod
    def __get_validators__(cls):
        yield cls.validate

    @classmethod
    def validate(cls, v):
        if not ObjectId.is_valid(v):
            raise ValueError("Invalid objectid")
        return ObjectId(v)

class User(BaseModel):
    id: PyObjectId = Field(default_factory=PyObjectId, alias="_id")
    username: str
    password: str  # Hashed
    tier: int = 1  # 1,2,3

    class Config:
        allow_population_by_field_name = True
        arbitrary_types_allowed = True
        json_encoders = {ObjectId: str}

class Letter(BaseModel):
    id: PyObjectId = Field(default_factory=PyObjectId, alias="_id")
    user_id: str
    content: str  # Main letter text
    names: dict  # {from: "", to: ""}
    date: str
    colors: dict  # {bg: "#fff", text: "#000", etc.}
    inside_jokes: Optional[list] = None
    hidden_message: Optional[str] = None
    password: Optional[str] = None  # For Tier 3
    photos: Optional[list] = None  # URLs or base64
    music_url: Optional[str] = None
    tier: int

    class Config:
        allow_population_by_field_name = True
        arbitrary_types_allowed = True
        json_encoders = {ObjectId: str}
