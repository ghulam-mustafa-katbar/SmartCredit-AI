from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class FinancialProfileBase(BaseModel):
    monthly_income: float = 0.0
    monthly_expenses: float = 0.0
    savings_balance: float = 0.0
    employment_type: str
    dependents: int = 0

class FinancialProfileCreate(FinancialProfileBase):
    pass

class FinancialProfileUpdate(FinancialProfileBase):
    pass

class FinancialProfileInDBBase(FinancialProfileBase):
    id: int
    user_id: int
    updated_at: datetime

    class Config:
        from_attributes = True

class FinancialProfile(FinancialProfileInDBBase):
    pass
