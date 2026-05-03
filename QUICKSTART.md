# Campus Pulse - Quick Start Guide

## Quick Start

### 1. Set up the backend

```powershell
cd backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
cd ..
```

On macOS/Linux, activate with:

```bash
source backend/venv/bin/activate
```

### 2. Generate data

```powershell
backend\venv\Scripts\python.exe data\generate_data.py
```

This creates:

- `data/student_satisfaction_data.csv`
- `data/key_metrics.json`

### 3. Start the backend

```powershell
cd backend
venv\Scripts\activate
python main.py
```

Backend URL: http://localhost:8000

Health check: http://localhost:8000/health

### 4. Start the frontend in a new terminal

```powershell
cd frontend
npm install
npm start
```

Frontend URL: http://localhost:3000

## Automated Setup

On Windows:

```powershell
setup.bat
```

On macOS/Linux:

```bash
chmod +x setup.sh
./setup.sh
```

## What You Should See

- Overview metrics for 500 survey responses
- Satisfaction distribution
- Facility comparison
- Monthly trends
- Filterable response table

## Troubleshooting

### Browser says the site takes too long to respond

Check that both servers are running:

```powershell
curl http://localhost:8000/health
curl http://localhost:3000
```

If `localhost:3000` fails, start the frontend:

```powershell
cd frontend
npm start
```

### Python module not found

Activate the backend environment and reinstall:

```powershell
cd backend
venv\Scripts\activate
pip install -r requirements.txt
```

### Frontend dependency error

```powershell
cd frontend
npm install
```

### Port already in use

Find the process:

```powershell
netstat -ano | findstr :8000
netstat -ano | findstr :3000
```

Then close the old server or use a different port.
