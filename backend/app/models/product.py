from sqlalchemy import Column, Integer, String, Text

from ..database.connection import Base


class Product(Base):

    __tablename__ = "products"

    id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    part_number = Column(
        String(100),
        unique=True,
        nullable=False,
        index=True
    )

    description = Column(
        String(255),
        nullable=False
    )

    category = Column(
        String(100),
        nullable=False
    )

    sub_category = Column(
        String(100),
        nullable=True
    )

    standard = Column(
        String(100),
        nullable=True
    )

    material = Column(
        String(100),
        nullable=True
    )

    size = Column(
        String(100),
        nullable=True
    )

    quantity_available = Column(
        Integer,
        default=0,
        nullable=True
    )

    specifications = Column(
        Text,
        nullable=True
    )

    name = Column(
        String(150),
        nullable=False
    )

    grade = Column(
        String(100),
        nullable=True
    )

    quantity = Column(
        Integer,
        default=0,
        nullable=True
    )