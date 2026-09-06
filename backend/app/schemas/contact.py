from typing import Optional
from pydantic import BaseModel


class ContactCreate(BaseModel):
    customer_name: str
    email: str
    message: str


class ContactResponse(BaseModel):
    id: int
    customer_name: str
    email: str
    phone: Optional[str] = None
    company: Optional[str] = None
    message: Optional[str] = None
    items: str
    status: Optional[str] = "pending"

    class Config:
        from_attributes = True