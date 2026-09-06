from pydantic import BaseModel
from datetime import datetime
from typing import Optional


# =========================================================
# ADD TO QUOTE - SINGLE PRODUCT
# =========================================================

class QuoteCreate(BaseModel):
    product_id: int
    part_number: str
    product_name: Optional[str] = None
    quantity: int = 1


# =========================================================
# REQUEST QUOTE ITEM
# =========================================================

class QuoteRequestItem(BaseModel):
    product_id: int
    part_number: str
    product_name: Optional[str] = None
    quantity: int = 1


# =========================================================
# REQUEST QUOTE
# =========================================================

class QuoteRequestCreate(BaseModel):
    company_name: str
    contact_person: str
    email: str
    phone: str
    address: Optional[str] = None
    message: Optional[str] = None

    items: list[QuoteRequestItem]


# =========================================================
# RESPONSE
# =========================================================

class QuoteResponse(BaseModel):
    id: int

    product_id: int

    part_number: str

    product_name: Optional[str]

    quantity: int

    company_name: Optional[str] = None

    contact_person: Optional[str] = None

    email: Optional[str] = None

    phone: Optional[str] = None

    address: Optional[str] = None

    message: Optional[str] = None

    request_id: Optional[str] = None

    # Customer-facing quote number
    quote_number: Optional[str] = None

    created_at: datetime

    class Config:
        from_attributes = True