#!/bin/bash

# Campus Pulse - Setup Script for macOS/Linux
# This script sets up the entire project

echo "============================================"
echo "  Campus Pulse Dashboard - Setup Script"
echo "============================================"
echo ""

# Step 1: Setup Backend
echo "[STEP 1] Setting up Backend..."
cd backend
echo "Creating virtual environment..."
python3 -m venv venv
echo "Activating virtual environment..."
source venv/bin/activate
echo "Installing dependencies..."
pip install -r requirements.txt
if [ $? -ne 0 ]; then
    echo "Error: Backend setup failed!"
    exit 1
fi
cd ..
echo ""

# Step 2: Generate Data
echo "[STEP 2] Generating Synthetic Data..."
backend/venv/bin/python data/generate_data.py
if [ $? -ne 0 ]; then
    echo "Error: Data generation failed!"
    exit 1
fi
echo ""

# Step 3: Setup Frontend
echo "[STEP 3] Setting up Frontend..."
cd frontend
echo "Installing dependencies..."
npm install
if [ $? -ne 0 ]; then
    echo "Error: Frontend setup failed!"
    exit 1
fi
cd ..
echo ""

echo "============================================"
echo "  Setup Complete!"
echo "============================================"
echo ""
echo "Next Steps:"
echo "1. Terminal 1: cd backend && source venv/bin/activate && python main.py"
echo "2. Terminal 2: cd frontend && npm start"
echo "3. Open browser: http://localhost:3000"
echo ""
echo "OR use the standalone dashboard:"
echo "   Open: dashboard.html in your browser"
echo "   (Requires backend to be running)"
echo ""
