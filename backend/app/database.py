from dotenv import load_dotenv
from sqlalchemy.orm import sessionmaker
import sqlalchemy as db
from sqlalchemy.ext.declarative import declarative_base
import os

load_dotenv()

database_url = os.getenv('DATABASE_URL', 'default_database_url')
Base = declarative_base()

engine = db.create_engine(database_url, pool_pre_ping=True)

sessionLocal = sessionmaker(bind=engine, autoflush= False)

def get_db():
    db =sessionLocal()
    try:
        yield db
    finally:
        db.close()


