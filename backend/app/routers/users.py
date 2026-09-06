from fastapi import APIRouter, Depends

from ..models.user import User
from ..schemas.auth import UserResponse
from ..core.dependencies import get_current_user


router = APIRouter(
    prefix="/api/users",
    tags=["Users"]
)


@router.get(
    "/me",
    response_model=UserResponse
)
def get_my_profile(
    current_user: User = Depends(get_current_user)
):

    return current_user