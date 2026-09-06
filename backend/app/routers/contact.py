from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy.exc import SQLAlchemyError

from ..database.connection import get_db
from ..models.contact import ContactMessage
from ..schemas.contact import ContactCreate, ContactResponse


router = APIRouter(
    prefix="/api/contact",
    tags=["Contact"]
)


# ==========================================
# CONTACT US SUBMIT
# ==========================================
@router.post(
    "/",
    response_model=ContactResponse,
    status_code=201
)
def create_contact_message(
    contact_data: ContactCreate,
    db: Session = Depends(get_db)
):
    try:
        contact = ContactMessage(
            customer_name=contact_data.customer_name,
            email=contact_data.email,
            phone=None,
            company=None,
            message=contact_data.message,
            items="[]",
            status="pending"
        )

        db.add(contact)
        db.commit()
        db.refresh(contact)

        return contact

    except SQLAlchemyError as e:
        db.rollback()

        raise HTTPException(
            status_code=500,
            detail=f"Database error: {str(e)}"
        )


# ==========================================
# GET CONTACT MESSAGES
# ==========================================
@router.get(
    "/",
    response_model=list[ContactResponse]
)
def get_contact_messages(
    db: Session = Depends(get_db)
):
    try:
        return (
            db.query(ContactMessage)
            .order_by(ContactMessage.id.desc())
            .all()
        )

    except SQLAlchemyError as e:
        raise HTTPException(
            status_code=500,
            detail=f"Database error: {str(e)}"
        )