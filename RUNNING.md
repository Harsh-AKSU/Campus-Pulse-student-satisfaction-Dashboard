# Campus Pulse - Running the Project

This project has a FastAPI backend and a React frontend. The backend must be running before the dashboard can load data.

## Prerequisites

- Python 3.9 or newer
- Node.js 16 or newer
- npm

## Option 1: React Dashboard

### 1. Install backend dependencies

```powershell
cd backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
cd ..
```

macOS/Linux activation:

```bash
source backend/venv/bin/activate
```

### 2. Generate data

```powershell
backend\venv\Scripts\python.exe data\generate_data.py
```

macOS/Linux:

```bash
backend/venv/bin/python data/generate_data.py
```

### 3. Start backend

```powershell
cd backend
venv\Scripts\activate
python main.py
```

Backend runs at: http://localhost:8000

API docs: http://localhost:8000/docs

### 4. Start frontend in a new terminal

```powershell
cd frontend
npm install
npm start
```

Frontend runs at: http://localhost:3000

## Option 2: Standalone HTML Dashboard

Start the backend first, then open `dashboard.html` in a browser. This does not require the React dev server.

## Option 3: Notebook Analysis

```powershell
pip install jupyter
jupyter notebook notebooks/EDA_and_Analysis.ipynb
```

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

## API Testing

```powershell
curl http://localhost:8000/health
curl http://localhost:8000/api/overview
curl http://localhost:8000/api/facilities
curl "http://localhost:8000/api/filtered?facility=Library&min_score=4"
curl http://localhost:8000/api/trends
```

## Troubleshooting

### Backend will not start

Check whether port `8000` is already in use:

```powershell
netstat -ano | findstr :8000
```

Reinstall backend dependencies:

```powershell
cd backend
venv\Scripts\activate
pip install -r requirements.txt --force-reinstall
```

### Frontend will not open

Check whether the React server is running:

```powershell
curl http://localhost:3000
```

Install dependencies and start it:

```powershell
cd frontend
npm install
npm start
```

### Frontend cannot connect to backend

1. Verify backend health at http://localhost:8000/health
2. Verify the frontend API setting in `frontend/.env.example`
3. Check the browser console with F12

## Expected Files After Setup

```text
Campus Pulse Student Satisfaction Dashboard/
|-- data/
|   |-- generate_data.py
|   |-- student_satisfaction_data.csv
|   `-- key_metrics.json
|-- backend/
|   |-- venv/
|   |-- main.py
|   |-- config.py
|   `-- requirements.txt
|-- frontend/
|   |-- node_modules/
|   |-- package.json
|   |-- public/
|   `-- src/
|-- dashboard.html
|-- README.md
|-- QUICKSTART.md
`-- requirements.txt
```
