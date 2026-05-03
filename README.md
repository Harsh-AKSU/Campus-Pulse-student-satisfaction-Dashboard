# Campus Pulse - Student Satisfaction Dashboard

Campus Pulse is a small analytics dashboard for student satisfaction survey data. It includes:

- A FastAPI backend
- A React frontend
- Synthetic survey data generation
- A standalone `dashboard.html` alternative
- A Jupyter notebook for exploratory analysis

## Project Structure

```text
Campus Pulse Student Satisfaction Dashboard/
|-- data/
|   |-- generate_data.py
|   |-- student_satisfaction_data.csv
|   `-- key_metrics.json
|-- notebooks/
|   `-- EDA_and_Analysis.ipynb
|-- backend/
|   |-- main.py
|   |-- config.py
|   `-- requirements.txt
|-- frontend/
|   |-- public/
|   |-- src/
|   |-- package.json
|   `-- .env.example
|-- dashboard.html
|-- QUICKSTART.md
|-- RUNNING.md
|-- setup.bat
|-- setup.sh
`-- requirements.txt
```

## Setup

### Backend

```powershell
cd backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
cd ..
```

### Data

```powershell
backend\venv\Scripts\python.exe data\generate_data.py
```

### Backend Server

```powershell
cd backend
venv\Scripts\activate
python main.py
```

Backend: http://localhost:8000

API docs: http://localhost:8000/docs

### Frontend

```powershell
cd frontend
npm install
npm start
```

Frontend: http://localhost:3000

## Automated Setup

Windows:

```powershell
setup.bat
```

macOS/Linux:

```bash
chmod +x setup.sh
./setup.sh
```

## API Endpoints

| Endpoint | Description |
| --- | --- |
| `/health` | Backend health check |
| `/api/overview` | Dashboard overview metrics |
| `/api/metrics` | Pre-calculated metrics |
| `/api/data` | Paginated raw data |
| `/api/filtered` | Filtered data |
| `/api/facilities` | Facility satisfaction summary |
| `/api/trends` | Monthly satisfaction trends |
| `/api/satisfaction-distribution` | Score category distribution |
| `/api/facilities-list` | Facility names |
| `/api/academic-years` | Academic year values |
| `/api/majors` | Major values |

## Dataset Schema

| Column | Type | Description |
| --- | --- | --- |
| `student_id` | string | Unique student identifier |
| `academic_year` | string | Academic year |
| `major` | string | Student major |
| `facility_rated` | string | Facility being rated |
| `satisfaction_score` | integer | Rating from 1 to 5 |
| `timestamp` | datetime | Survey submission time |
| `feedback` | string | Short feedback text |

## Troubleshooting

If the browser says the dashboard takes too long to respond, check both servers:

```powershell
curl http://localhost:8000/health
curl http://localhost:3000
```

If frontend dependencies fail, rerun:

```powershell
cd frontend
npm install
```

If Python dependencies fail, activate the backend venv and reinstall:

```powershell
cd backend
venv\Scripts\activate
pip install -r requirements.txt
```
