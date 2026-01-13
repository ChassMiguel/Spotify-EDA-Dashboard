from fastapi import Depends, APIRouter
from sqlalchemy.orm import Session
from typing import List

from ..database import get_db
from .. import models, schemas

router = APIRouter()
@router.get("/spotify-data", response_model=List[schemas.SpotifyData])
def get_spotify_data(db: Session = Depends(get_db)):
    return db.query(models.SpotifyData).limit(100).all()