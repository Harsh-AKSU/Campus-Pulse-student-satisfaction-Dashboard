"""
Configuration and utility functions for Campus Pulse backend
"""

from pathlib import Path

# Paths
BASE_DIR = Path(__file__).parent.parent
DATA_DIR = BASE_DIR / "data"
NOTEBOOKS_DIR = BASE_DIR / "notebooks"

# Data files
DATA_FILE = DATA_DIR / "student_satisfaction_data.csv"
METRICS_FILE = DATA_DIR / "key_metrics.json"

# API Configuration
API_HOST = "0.0.0.0"
API_PORT = 8000
API_RELOAD = True

# CORS Origins
CORS_ORIGINS = [
    "http://localhost:3000",
    "http://localhost:5173",
    "http://127.0.0.1:3000",
    "http://127.0.0.1:5173"
]

def ensure_data_exists():
    """Check if data files exist"""
    return DATA_FILE.exists() and METRICS_FILE.exists()
