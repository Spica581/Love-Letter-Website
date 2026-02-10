from pymongo import MongoClient
from pymongo.server_api import ServerApi
import os
from dotenv import load_dotenv

load_dotenv()

uri = os.getenv("MONGODB_URI")
if not uri:
    raise ValueError("MONGODB_URI is not set in .env file")

client = MongoClient(uri, server_api=ServerApi('1'))
db = client["love_letters"]

print("✅ Connected to MongoDB")
