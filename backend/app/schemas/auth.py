from pydantic import BaseModel, EmailStr


class UserRegister(BaseModel):

    email: EmailStr

    password: str

    full_name: str | None = None


class UserLogin(BaseModel):

    email: EmailStr

    password: str


class Token(BaseModel):

    access_token: str

    token_type: str


class UserResponse(BaseModel):

    id: int

    email: EmailStr

    full_name: str | None = None

    is_active: bool

    is_admin: bool

    class Config:
        from_attributes = True