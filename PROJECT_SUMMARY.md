# Campus Pulse - Project Summary

## What This Project Includes

- Synthetic student satisfaction data generator
- CSV dataset and JSON metrics file
- FastAPI backend with dashboard API endpoints
- React frontend dashboard
- Standalone HTML dashboard
- Jupyter notebook for exploratory analysis
- Windows and macOS/Linux setup scripts

## Current Working URLs

- Frontend: http://localhost:3000
- Backend: http://localhost:8000
- API Docs: http://localhost:8000/docs
- Health Check: http://localhost:8000/health

## Key Backend Endpoints

```text
GET /health
GET /api/overview
GET /api/metrics
GET /api/data
GET /api/filtered
GET /api/facilities
GET /api/trends
GET /api/satisfaction-distribution
GET /api/facilities-list
GET /api/academic-years
GET /api/majors
```

## Setup Order

1. Install backend dependencies.
2. Generate the CSV and metrics JSON using the backend venv.
3. Start the backend.
4. Install frontend dependencies.
5. Start the frontend.

See `QUICKSTART.md` or `RUNNING.md` for exact commands.

## Verification Status

- Backend dependency check passes.
- Backend loads 500 records.
- React production build compiles successfully.
- Frontend package versions are valid.
