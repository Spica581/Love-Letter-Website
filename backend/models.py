from pydantic import BaseModel, Field
from typing import Optional, List
from bson import ObjectId

class PyObjectId(ObjectId):
    @classmethod
    def __get_validators__(cls):
        yield cls.validate

class User(BaseModel):
    id: PyObjectId = Field(default_factory=PyObjectId, alias="_id")
    username: str
    password: str
    tier: int = 1

    class Config:
        allow_population_by_field_name = True
        json_encoders = {ObjectId: str}

class Letter(BaseModel):
    id: PyObjectId = Field(default_factory=PyObjectId, alias="_id")
    user_id: str
    from_name: str
    to_name: str
    date: str
    content: str
    colors: dict
    hidden_message: Optional[str] = None
    password: Optional[str] = None
    music_url: Optional[str] = None
    tier: int

    class Config:
        allow_population_by_field_name = True
        json_encoders = {ObjectId: str}
