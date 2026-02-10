from database import SessionLocal
import models, crud, schemas
from passlib.context import CryptContext

db = SessionLocal()

def seed_demo_user():
    demo_email = "demo@example.com"
    demo_password = "DemoUser123!"
    
    user = crud.get_user_by_email(db, email=demo_email)
    if not user:
        print(f"Creating demo user: {demo_email}")
        user_in = schemas.UserCreate(email=demo_email, password=demo_password)
        crud.create_user(db, user_in)
    else:
        print(f"Demo user {demo_email} already exists.")
    
    db.close()

if __name__ == "__main__":
    seed_demo_user()
