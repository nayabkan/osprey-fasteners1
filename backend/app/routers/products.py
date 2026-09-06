from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy.exc import SQLAlchemyError

from ..database.connection import get_db
from ..models.product import Product
from ..schemas.product import ProductCreate, ProductResponse


router = APIRouter(
    prefix="/products",
    tags=["Products"]
)


# ==========================================
# GET ALL PRODUCTS
# ==========================================

@router.get(
    "/",
    response_model=list[ProductResponse]
)
def get_products(
    db: Session = Depends(get_db)
):

    return db.query(Product).all()


    # ==========================================
# GET PRODUCTS BY CATEGORY
# ==========================================

@router.get(
    "/category/{category}",
    response_model=list[ProductResponse]
)
def get_products_by_category(
    category: str,
    db: Session = Depends(get_db)
):
    products = (
        db.query(Product)
        .filter(Product.category.ilike(category))
        .all()
    )

    return products


# ==========================================
# GET SINGLE PRODUCT
# ==========================================

@router.get(
    "/{product_id}",
    response_model=ProductResponse
)
def get_product(
    product_id: int,
    db: Session = Depends(get_db)
):

    product = (
        db.query(Product)
        .filter(Product.id == product_id)
        .first()
    )

    if not product:
        raise HTTPException(
            status_code=404,
            detail="Product not found"
        )

    return product


# ==========================================
# CREATE SINGLE PRODUCT
# ==========================================

@router.post(
    "/",
    response_model=ProductResponse,
    status_code=201
)
def create_product(
    product_data: ProductCreate,
    db: Session = Depends(get_db)
):

    try:

        # Check duplicate part number
        existing_product = (
            db.query(Product)
            .filter(
                Product.part_number ==
                product_data.part_number
            )
            .first()
        )

        if existing_product:
            raise HTTPException(
                status_code=400,
                detail="Part number already exists"
            )

        new_product = Product(
            name=product_data.name,
            part_number=product_data.part_number,
            description=product_data.description,
            category=product_data.category,
            sub_category=product_data.sub_category,
            standard=product_data.standard,
            material=product_data.material,
            size=product_data.size,
            quantity_available=product_data.quantity_available,
            specifications=product_data.specifications,
            grade=product_data.grade,
            quantity=product_data.quantity
        )

        db.add(new_product)

        db.commit()

        db.refresh(new_product)

        return new_product

    except HTTPException:
        raise

    except SQLAlchemyError as e:

        db.rollback()

        print("DATABASE ERROR:", e)

        raise HTTPException(
            status_code=500,
            detail=f"Database error: {str(e)}"
        )


# ==========================================
# CREATE MULTIPLE PRODUCTS
# ==========================================

@router.post(
    "/bulk",
    response_model=list[ProductResponse],
    status_code=201
)
def create_products_bulk(
    products_data: list[ProductCreate],
    db: Session = Depends(get_db)
):

    try:

        created_products = []

        for product_data in products_data:

            # Check if part number already exists
            existing_product = (
                db.query(Product)
                .filter(
                    Product.part_number ==
                    product_data.part_number
                )
                .first()
            )

            # Already exists -> skip
            if existing_product:
                continue

            new_product = Product(
                name=product_data.name,
                part_number=product_data.part_number,
                description=product_data.description,
                category=product_data.category,
                sub_category=product_data.sub_category,
                standard=product_data.standard,
                material=product_data.material,
                size=product_data.size,
                quantity_available=product_data.quantity_available,
                specifications=product_data.specifications,
                grade=product_data.grade,
                quantity=product_data.quantity
            )

            db.add(new_product)

            created_products.append(new_product)

        db.commit()

        # Refresh newly created products
        for product in created_products:
            db.refresh(product)

        return created_products

    except SQLAlchemyError as e:

        db.rollback()

        print("DATABASE ERROR:", e)

        raise HTTPException(
            status_code=500,
            detail=f"Database error: {str(e)}"
        )