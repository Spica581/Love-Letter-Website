# backend/database.py
import os
from pymongo import MongoClient
import certifi

MONGODB_URI = os.getenv("MONGODB_URI", "")
MONGODB_NAME = os.getenv("MONGODB_NAME", "")

if not MONGODB_URI:
    raise RuntimeError("MONGODB_URI not set in environment")
if not MONGODB_NAME:
    raise RuntimeError("MONGODB_NAME not set in environment")

client = MongoClient(
    MONGODB_URI,
    tlsCAFile=certifi.where(),
    serverSelectionTimeoutMS=10000
)

# Explicit DB handle
db = client[MONGODB_NAME]

def get_db():
    return db
