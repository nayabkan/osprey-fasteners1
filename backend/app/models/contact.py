from sqlalchemy import Column, Integer, String, Text

from ..database.connection import Base


class ContactMessage(Base):
    __tablename__ = "contact_messages"

    id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    customer_name = Column(
        String(150),
        nullable=False
    )

    email = Column(
        String(150),
        nullable=False
    )

    phone = Column(
        String(50),
        nullable=True
    )

    company = Column(
        String(150),
        nullable=True
    )

    message = Column(
        Text,
        nullable=True
    )

    items = Column(
        Text,
        nullable=False
    )

    status = Column(
        String(50),
        default="pending"
    )