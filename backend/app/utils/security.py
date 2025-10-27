from passlib.context import CryptContext

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
def hash_password(password):
    print("DEBUG password value:", password)
    print("DEBUG password type:", type(password))
    if isinstance(password, bytes):
        password = password.decode("utf-8")
        print("Converted bytes to string:", password)
    password = password[:72]
    return pwd_context.hash(password)


def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)
