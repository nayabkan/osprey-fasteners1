from pydantic import BaseModel, EmailStr


class UserMe(BaseModel):

    id: int

    email: EmailStr

    full_name: str | None = None

    is_active: bool

    is_admin: bool

    class Config:
        from_attributes = True