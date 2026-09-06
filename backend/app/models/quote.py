from sqlalchemy import Column, Integer, String, DateTime, Text
from datetime import datetime

from ..database.connection import Base


class Quote(Base):
    __tablename__ = "quotes"

    id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    product_id = Column(
        Integer,
        nullable=False
    )

    part_number = Column(
        String(100),
        nullable=False
    )

    product_name = Column(
        String(150),
        nullable=True
    )

    quantity = Column(
        Integer,
        nullable=False,
        default=1
    )

    # =========================
    # CUSTOMER / QUOTE DETAILS
    # =========================

    company_name = Column(
        String(150),
        nullable=True
    )

    contact_person = Column(
        String(150),
        nullable=True
    )

    email = Column(
        String(150),
        nullable=True
    )

    phone = Column(
        String(50),
        nullable=True
    )

    address = Column(
        Text,
        nullable=True
    )

    message = Column(
        Text,
        nullable=True
    )

    # =========================
    # QUOTE IDENTIFICATION
    # =========================

    request_id = Column(
        String(100),
        nullable=True,
        index=True
    )

    quote_number = Column(
        String(20),
        nullable=True,
        index=True
    )

    created_at = Column(
        DateTime,
        default=datetime.utcnow
    )