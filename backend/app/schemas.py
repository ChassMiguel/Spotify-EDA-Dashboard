from pydantic import BaseModel, ConfigDict
from typing import Dict, Any

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