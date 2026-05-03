# Campus Pulse - Project Map

## Runtime Flow

```text
data/generate_data.py
        |
        v
data/student_satisfaction_data.csv
data/key_metrics.json
        |
        v
backend/main.py  --->  FastAPI endpoints on localhost:8000
        |
        v
frontend/src     --->  React dashboard on localhost:3000
```

## Main Files

```text
backend/main.py                  FastAPI app and endpoints
backend/config.py                Shared backend paths/config
backend/requirements.txt         Backend Python dependencies
data/generate_data.py            Synthetic data and metrics generator
frontend/src/App.js              Main React app
frontend/src/api.js              Frontend API base URL
frontend/src/components/         Dashboard UI components
frontend/package.json            Frontend dependencies/scripts
dashboard.html                   Standalone dashboard
setup.bat                        Windows setup
setup.sh                         macOS/Linux setup
QUICKSTART.md                    Short setup guide
RUNNING.md                       Detailed run guide
README.md                        Project overview
```

## Data Files

```text
data/student_satisfaction_data.csv
data/key_metrics.json
```

These files can be regenerated with:

```powershell
backend\venv\Scripts\python.exe data\generate_data.py
```
