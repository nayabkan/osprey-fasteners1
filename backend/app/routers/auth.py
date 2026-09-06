from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from ..database.connection import get_db
from ..models.user import User

from ..schemas.auth import (
    UserRegister,
    UserLogin,
    Token,
    UserResponse
)

from ..core.security import (
    hash_password,
    verify_password,
    create_access_token
)

from ..services.email_service import send_welcome_email


router = APIRouter(
    prefix="/api/auth",
    tags=["Authentication"]
)


# =========================================================
# REGISTER
# =========================================================

@router.post(
    "/register",
    response_model=UserResponse
)
def register(
    user_data: UserRegister,
    db: Session = Depends(get_db)
):

    # -----------------------------------------------------
    # CHECK EXISTING USER
    # -----------------------------------------------------

    existing_user = db.query(User).filter(
        User.email == user_data.email
    ).first()

    if existing_user:

        raise HTTPException(
            status_code=400,
            detail="Email already registered"
        )


    # -----------------------------------------------------
    # CREATE USER
    # -----------------------------------------------------

    user = User(
        email=user_data.email,
        full_name=user_data.full_name,
        hashed_password=hash_password(
            user_data.password
        ),
        is_active=True,
        is_admin=False
    )

    db.add(user)

    db.commit()

    db.refresh(user)


    # -----------------------------------------------------
    # SEND WELCOME EMAIL
    # -----------------------------------------------------

    try:

        send_welcome_email(
            customer_email=user.email,
            customer_name=user.full_name
        )

    except Exception as email_error:

        # Email fail hone par registration fail nahi hoga.
        # User successfully database me create ho chuka hai.

        print(
            "WELCOME EMAIL ERROR:",
            email_error
        )


    # -----------------------------------------------------
    # RETURN USER
    # -----------------------------------------------------

    return user


# =========================================================
# LOGIN
# =========================================================

@router.post(
    "/login",
    response_model=Token
)
def login(
    user_data: UserLogin,
    db: Session = Depends(get_db)
):

    # -----------------------------------------------------
    # FIND USER
    # -----------------------------------------------------

    user = db.query(User).filter(
        User.email == user_data.email
    ).first()

    if not user:

        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password"
        )


    # -----------------------------------------------------
    # VERIFY PASSWORD
    # -----------------------------------------------------

    password_valid = verify_password(
        user_data.password,
        user.hashed_password
    )

    if not password_valid:

        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password"
        )


    # -----------------------------------------------------
    # CHECK ACTIVE USER
    # -----------------------------------------------------

    if not user.is_active:

        raise HTTPException(
            status_code=400,
            detail="User account is inactive"
        )


    # -----------------------------------------------------
    # CREATE JWT TOKEN
    # -----------------------------------------------------

    access_token = create_access_token(
        data={
            "sub": str(user.id)
        }
    )


    return {
        "access_token": access_token,
        "token_type": "bearer"
    }