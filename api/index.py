import sys
import os

# Add the parent directory to the path so we can import from backend
sys.path.append(os.path.dirname(os.path.dirname(__file__)))

from backend.main import app

# Vercel serverless handler
handler = app
