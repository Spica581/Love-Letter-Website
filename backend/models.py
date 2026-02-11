# backend/models.py
from typing import Optional, Dict
from pydantic import BaseModel, Field
from bson import ObjectId
from pydantic.json_schema import JsonSchemaValue
from pydantic_core import core_schema

class PyObjectId(ObjectId):
    @classmethod
    def __get_validators__(cls):
        yield cls.validate

    @classmethod
    def validate(cls, v):
        if isinstance(v, ObjectId):
            return v
        if isinstance(v, str) and ObjectId.is_valid(v):
            return ObjectId(v)
        raise ValueError("Invalid ObjectId")

    @classmethod
    def __get_pydantic_core_schema__(cls, source_type, handler):
        return core_schema.no_info_after_validator_function(
            cls.validate,
            core_schema.str_schema()
        )

    @classmethod
    def __get_pydantic_json_schema__(cls, core_schema, handler) -> JsonSchemaValue:
        return {"type": "string", "examples": ["507f1f77bcf86cd799439011"]}


class Letter(BaseModel):
    id: Optional[PyObjectId] = Field(default=None, alias="_id")
    from_name: str
    to_name: str
    date: str
    content: str
    colors: Dict[str, str]
    hidden_message: Optional[str] = None
    password: Optional[str] = None
    music_url: Optional[str] = None
    tier: int = 2

    model_config = {
        "populate_by_name": True,
        "arbitrary_types_allowed": True,
        "json_encoders": {ObjectId: str},
    }


class User(BaseModel):
    id: Optional[PyObjectId] = Field(default=None, alias="_id")
    username: str
    email: Optional[str] = None
    hashed_password: Optional[str] = None
    is_active: bool = True
    is_superuser: bool = False

    model_config = {
        "populate_by_name": True,
        "arbitrary_types_allowed": True,
        "json_encoders": {ObjectId: str},
    }
