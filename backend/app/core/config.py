import os
from dotenv import load_dotenv


# =========================================================
# LOAD BACKEND/.env
# =========================================================

load_dotenv()


# =========================================================
# DATABASE
# =========================================================

DATABASE_URL = os.getenv("DATABASE_URL")


# =========================================================
# JWT
# =========================================================

SECRET_KEY = os.getenv("SECRET_KEY")

ALGORITHM = os.getenv(
    "ALGORITHM",
    "HS256"
)

ACCESS_TOKEN_EXPIRE_MINUTES = int(
    os.getenv(
        "ACCESS_TOKEN_EXPIRE_MINUTES",
        "10"
    )
)


# =========================================================
# APPLICATION URLS
# =========================================================

BACKEND_URL = os.getenv(
    "BACKEND_URL",
    "http://127.0.0.1:8000"
)

FRONTEND_URL = os.getenv(
    "FRONTEND_URL",
    "http://localhost:5173"
)


# =========================================================
# EMAIL / RESEND
# =========================================================

RESEND_API_KEY = os.getenv(
    "RESEND_API_KEY"
)

MAIL_FROM = os.getenv(
    "MAIL_FROM",
    "Osprey Fasteners <onboarding@resend.dev>"
)

ADMIN_EMAIL = os.getenv(
    "ADMIN_EMAIL"
)


# =========================================================
# VALIDATION
# =========================================================

if not SECRET_KEY:
    raise RuntimeError(
        "SECRET_KEY is not set in .env"
    )


if not DATABASE_URL:
    raise RuntimeError(
        "DATABASE_URL is not set in .env"
    )