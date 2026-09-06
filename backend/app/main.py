from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .database.connection import Base, engine

from .core.config import FRONTEND_URL

from .models import (
    Product,
    Quote,
    ContactMessage,
    User
)

from .routers.products import (
    router as products_router
)

from .routers.quotes import (
    router as quotes_router
)

from .routers.contact import (
    router as contact_router
)

# JWT Authentication
from .routers.auth import (
    router as auth_router
)

from .routers.users import (
    router as users_router
)


# =========================================================
# FASTAPI APPLICATION
# =========================================================

app = FastAPI(
    title="Osprey Fasteners API",
    description="Backend API for Osprey Fasteners",
    version="1.0.0"
)


# =========================================================
# DATABASE TABLES
# =========================================================

Base.metadata.create_all(
    bind=engine
)


# =========================================================
# CORS
# =========================================================

app.add_middleware(
    CORSMiddleware,

    allow_origins=[
        FRONTEND_URL
    ],

    allow_credentials=True,

    allow_methods=[
        "*"
    ],

    allow_headers=[
        "*"
    ],
)


# =========================================================
# ROUTERS
# =========================================================

app.include_router(
    products_router
)

app.include_router(
    quotes_router
)

app.include_router(
    contact_router
)

# JWT routes
app.include_router(
    auth_router
)

app.include_router(
    users_router
)


# =========================================================
# ROOT
# =========================================================

@app.get("/")
def root():

    return {
        "message":
        "Osprey Fasteners API is running"
    }


# =========================================================
# HEALTH CHECK
# =========================================================

@app.get("/health")
def health():

    return {
        "status": "healthy"
    }