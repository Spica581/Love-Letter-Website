from pymongo import MongoClient
import os

client = MongoClient(os.getenv("MONGODB_URI", "mongodb://localhost:27017/"))
db = client["love_letters"]

from pymongo.mongo_client import MongoClient
from pymongo.server_api import ServerApi

uri = "mongodb+srv://EliTech:PHILSCASTUDENT1967@cluster0.054f9bi.mongodb.net/?appName=Cluster0"

# Create a new client and connect to the server
client = MongoClient(uri, server_api=ServerApi('1'))


try:
    client.admin.command('ping')
    print("Pinged your deployment. You successfully connected to MongoDB!")
except Exception as e:
    print(e)
