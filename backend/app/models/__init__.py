from app.core.database import Base
# Import all models here so Alembic can discover them
from app.models.user import User, Role
from app.models.profile import FinancialProfile
from app.models.transaction import Transaction, Bill
from app.models.assessment import Assessment, Recommendation
from app.models.audit import AuditLog
