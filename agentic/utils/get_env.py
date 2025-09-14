import os
from dotenv import load_dotenv

load_dotenv(dotenv_path='../../.env')

def get_env(env: str):
    return os.environ.get(env, "")
