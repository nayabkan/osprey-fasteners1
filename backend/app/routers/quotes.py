from fastapi import APIRouter, Depends, HTTPException, BackgroundTasks
from sqlalchemy.orm import Session
from sqlalchemy.exc import SQLAlchemyError

from ..database.connection import get_db
from ..models.quote import Quote
from ..schemas.quote import (
    QuoteCreate,
    QuoteResponse,
    QuoteRequestCreate
)

from ..services.email_service import (
    send_quote_confirmation,
    send_admin_notification
)

import uuid


router = APIRouter(
    prefix="/quotes",
    tags=["Quotes"]
)


# =========================================================
# GET ALL QUOTE ITEMS
# =========================================================

@router.get(
    "/",
    response_model=list[QuoteResponse]
)
def get_quotes(
    db: Session = Depends(get_db)
):

    try:

        return (
            db.query(Quote)
            .order_by(Quote.id.desc())
            .all()
        )

    except SQLAlchemyError as e:

        raise HTTPException(
            status_code=500,
            detail=f"Database error: {str(e)}"
        )


# =========================================================
# ADD PRODUCT TO QUOTE
# =========================================================

@router.post(
    "/",
    response_model=QuoteResponse,
    status_code=201
)
def add_to_quote(
    quote_data: QuoteCreate,
    db: Session = Depends(get_db)
):

    if quote_data.quantity < 1:

        raise HTTPException(
            status_code=400,
            detail="Quantity must be at least 1"
        )

    try:

        # Only normal cart/quote items
        # Submitted requests have request_id != NULL
        existing_quote = (
            db.query(Quote)
            .filter(
                Quote.product_id == quote_data.product_id,
                Quote.request_id.is_(None)
            )
            .first()
        )

        # Already added → increase quantity
        if existing_quote:

            existing_quote.quantity += quote_data.quantity

            db.commit()
            db.refresh(existing_quote)

            return existing_quote

        # New normal quote/cart item
        new_quote = Quote(
            product_id=quote_data.product_id,
            part_number=quote_data.part_number,
            product_name=quote_data.product_name,
            quantity=quote_data.quantity,

            # Customer fields remain empty
            company_name=None,
            contact_person=None,
            email=None,
            phone=None,
            address=None,
            message=None,

            # Normal cart item
            request_id=None,

            # Quote number is generated only after submission
            quote_number=None
        )

        db.add(new_quote)

        db.commit()
        db.refresh(new_quote)

        return new_quote

    except SQLAlchemyError as e:

        db.rollback()

        raise HTTPException(
            status_code=500,
            detail=f"Database error: {str(e)}"
        )


# =========================================================
# REQUEST QUOTE SUBMIT
# =========================================================

@router.post(
    "/request",
    status_code=201
)
def submit_quote_request(
    quote_data: QuoteRequestCreate,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db)
):

    # -----------------------------------------------------
    # Check items
    # -----------------------------------------------------

    if not quote_data.items:

        raise HTTPException(
            status_code=400,
            detail="Please add at least one part to the quote"
        )

    # -----------------------------------------------------
    # Generate internal request ID
    # -----------------------------------------------------

    request_id = str(uuid.uuid4())

    try:

        created_quotes = []

        # =================================================
        # CREATE QUOTE ITEMS
        # =================================================

        for item in quote_data.items:

            if item.quantity < 1:

                raise HTTPException(
                    status_code=400,
                    detail="Quantity must be at least 1"
                )

            new_quote = Quote(
                product_id=item.product_id,
                part_number=item.part_number,
                product_name=item.product_name,
                quantity=item.quantity,

                # Customer details
                company_name=quote_data.company_name,
                contact_person=quote_data.contact_person,
                email=quote_data.email,
                phone=quote_data.phone,
                address=quote_data.address,
                message=quote_data.message,

                # Internal request ID
                request_id=request_id,

                # Will be generated below
                quote_number=None
            )

            db.add(new_quote)

            created_quotes.append(new_quote)

        # =================================================
        # FLUSH
        # =================================================
        # Flush sends INSERT statements to PostgreSQL
        # and gives us the generated IDs before commit.

        db.flush()

        # =================================================
        # GENERATE CUSTOMER-FACING QUOTE NUMBER
        # =================================================

        first_quote_id = created_quotes[0].id

        quote_number = f"Q{100000 + first_quote_id}"

        # =================================================
        # ASSIGN SAME QUOTE NUMBER TO ALL ITEMS
        # =================================================

        for quote in created_quotes:

            quote.quote_number = quote_number

        # =================================================
        # SAVE TO DATABASE
        # =================================================

        db.commit()

        # =================================================
        # REFRESH DATABASE OBJECTS
        # =================================================

        for quote in created_quotes:

            db.refresh(quote)

        # =================================================
        # SEND CUSTOMER EMAIL IN BACKGROUND
        # =================================================

        background_tasks.add_task(
            send_quote_confirmation,
            quote_data.email,
            quote_data.contact_person,
            quote_number
        )

        # =================================================
        # SEND ADMIN EMAIL IN BACKGROUND
        # =================================================

        background_tasks.add_task(
            send_admin_notification,
            quote_data.contact_person,
            quote_data.email,
            quote_number,
            quote_data.company_name
        )

        # =================================================
        # RESPONSE TO FRONTEND
        # =================================================

        return {

            "success": True,

            "message": (
                f"Thank you for your enquiry. "
                f"Your Quote Number is {quote_number}. "
                f"We will get back to you within 48 hours."
            ),

            "quote_number": quote_number,

            "request_id": request_id,

            "items": [
                {
                    "id": quote.id,
                    "product_id": quote.product_id,
                    "part_number": quote.part_number,
                    "product_name": quote.product_name,
                    "quantity": quote.quantity
                }
                for quote in created_quotes
            ]
        }

    # =====================================================
    # VALIDATION ERROR
    # =====================================================

    except HTTPException:

        db.rollback()

        raise

    # =====================================================
    # DATABASE ERROR
    # =====================================================

    except SQLAlchemyError as e:

        db.rollback()

        raise HTTPException(
            status_code=500,
            detail=f"Database error: {str(e)}"
        )


# =========================================================
# UPDATE QUANTITY
# =========================================================

@router.put(
    "/{quote_id}",
    response_model=QuoteResponse
)
def update_quote_quantity(
    quote_id: int,
    quantity: int,
    db: Session = Depends(get_db)
):

    if quantity < 1:

        raise HTTPException(
            status_code=400,
            detail="Quantity must be at least 1"
        )

    try:

        quote = (
            db.query(Quote)
            .filter(
                Quote.id == quote_id
            )
            .first()
        )

        if not quote:

            raise HTTPException(
                status_code=404,
                detail="Quote item not found"
            )

        quote.quantity = quantity

        db.commit()
        db.refresh(quote)

        return quote

    except HTTPException:

        raise

    except SQLAlchemyError as e:

        db.rollback()

        raise HTTPException(
            status_code=500,
            detail=f"Database error: {str(e)}"
        )


# =========================================================
# DELETE QUOTE ITEM
# =========================================================

@router.delete("/{quote_id}")
def delete_quote(
    quote_id: int,
    db: Session = Depends(get_db)
):

    try:

        quote = (
            db.query(Quote)
            .filter(
                Quote.id == quote_id
            )
            .first()
        )

        if not quote:

            raise HTTPException(
                status_code=404,
                detail="Quote item not found"
            )

        db.delete(quote)

        db.commit()

        return {
            "message": "Quote item deleted successfully"
        }

    except HTTPException:

        raise

    except SQLAlchemyError as e:

        db.rollback()

        raise HTTPException(
            status_code=500,
            detail=f"Database error: {str(e)}"
        )