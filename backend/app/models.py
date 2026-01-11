from sqlalchemy import Column, Integer, String
from .database import Base
from sqlalchemy.dialects.postgresql import JSONB

class Chart(Base):
    __tablename__ = "dashboard_data"
    id = Column(Integer, primary_key=True, index=True)
    chart_name = Column(String, unique=True, index=True)
    data = Column(JSONB)