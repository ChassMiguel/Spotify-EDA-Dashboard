from pydantic import BaseModel, ConfigDict
from typing import Dict, Any
from datetime import date

# 1. Base Schema
class ChartBase(BaseModel):
    chart_name: str
    chart_data: Dict[str, Any]

# 2. Create Schema
#Future feature
class ChartCreate(ChartBase):
    pass

# 3. Respone(Read) Schema:
class ChartResponse(ChartBase):
    id: int
    model_config = ConfigDict(from_attributes=True)

class SpotifyData(BaseModel):
    id: int
    spotify_id: str
    name: str
    artists: str
    country: str
    snapshot_date: date
    daily_rank: int
    daily_movement: int
    duration_ms: int
    explicit: bool
    danceability: float
    energy: float
    valence: float
    tempo: float
    
    model_config = ConfigDict(from_attributes=True)