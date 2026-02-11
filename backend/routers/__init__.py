# Empty file - required for imports
# backend/routers/__init__.py
from .admin import router as admin
from .letters import router as letters
from .uploads import router as uploads
from .users import router as users

__all__ = ["admin", "letters", "uploads", "users"]
