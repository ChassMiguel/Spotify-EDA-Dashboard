from sqlalchemy import Column, Integer, Float, String, Date, Boolean
from .database import Base
from sqlalchemy.dialects.postgresql import JSONB

class Chart(Base):
    __tablename__ = "dashboard_data"
    id = Column(Integer, primary_key=True, index=True)
    chart_name = Column(String, unique=True, index=True)
    data = Column(JSONB)

class SpotifyData(Base):
    __tablename__ = "spotify_data"
    id = Column(Integer, primary_key=True, index=True)
    spotify_id = Column(String, index=True)
    name = Column(String, index=True)
    artists = Column(String, index=True)
    country = Column(String, index=True)
    snapshot_date = Column(Date, index = True)
    daily_rank = Column(Integer, index=True)
    daily_movement = Column(Integer, index=True)
    duration_ms = Column(Integer)
    is_explicit = Column(Boolean)
    danceability = Column(Float, index=True)
    energy = Column(Float, index=True)
    valence = Column(Float, index=True)
    tempo = Column(Float, index=True)