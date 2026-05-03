"""
Campus Pulse Dashboard - FastAPI Backend
Main application file with API endpoints for student satisfaction data
"""

from fastapi import FastAPI, Query
from fastapi.middleware.cors import CORSMiddleware
import pandas as pd
import json
from typing import Optional
from pathlib import Path

app = FastAPI(
    title="Campus Pulse API",
    description="API for Campus Pulse Student Satisfaction Dashboard",
    version="1.0.0"
)

# Configure CORS (Allow requests from React frontend)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:5173", "*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load data at startup. Resolve from the project root so the backend works
# whether it is launched from the repo root or from the backend folder.
BASE_DIR = Path(__file__).resolve().parent
PROJECT_ROOT = BASE_DIR.parent
DATA_PATH = PROJECT_ROOT / "data" / "student_satisfaction_data.csv"
METRICS_PATH = PROJECT_ROOT / "data" / "key_metrics.json"

# Global dataframe
df = None
metrics = None

@app.on_event("startup")
async def load_data():
    """Load data when server starts"""
    global df, metrics
    try:
        if DATA_PATH.exists():
            df = pd.read_csv(DATA_PATH)
            df['timestamp'] = pd.to_datetime(df['timestamp'])
            print(f"Data loaded: {len(df)} records")
        else:
            print("Data file not found. Please run data generation first.")
            df = pd.DataFrame()
        
        if METRICS_PATH.exists():
            with METRICS_PATH.open('r') as f:
                metrics = json.load(f)
            print("Metrics loaded")
        else:
            print("Metrics file not found.")
            metrics = {}
    except Exception as e:
        print(f"Error loading data: {e}")
        df = pd.DataFrame()
        metrics = {}

# ==================== ENDPOINTS ====================

@app.get("/")
async def root():
    """Root endpoint - API documentation"""
    return {
        "message": "Welcome to Campus Pulse API",
        "version": "1.0.0",
        "endpoints": {
            "health": "/health",
            "overview": "/api/overview",
            "metrics": "/api/metrics",
            "data": "/api/data",
            "facilities": "/api/facilities",
            "filtered_data": "/api/filtered",
            "trends": "/api/trends",
            "major_summary": "/api/major-summary",
            "facility_major_heatmap": "/api/facility-major-heatmap",
            "year_score_distribution": "/api/year-score-distribution"
        }
    }

@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "data_loaded": df is not None and len(df) > 0,
        "total_records": len(df) if df is not None else 0
    }

@app.get("/api/overview")
async def get_overview():
    """Get dashboard overview with key metrics"""
    if df is None or len(df) == 0:
        return {"error": "No data available"}
    
    return {
        "total_responses": len(df),
        "average_satisfaction": float(df['satisfaction_score'].mean()),
        "satisfaction_std": float(df['satisfaction_score'].std()),
        "min_score": int(df['satisfaction_score'].min()),
        "max_score": int(df['satisfaction_score'].max()),
        "date_range": {
            "start": df['timestamp'].min().strftime("%Y-%m-%d"),
            "end": df['timestamp'].max().strftime("%Y-%m-%d")
        }
    }

@app.get("/api/metrics")
async def get_metrics():
    """Get pre-calculated key metrics"""
    return metrics

@app.get("/api/data")
async def get_data(
    limit: int = Query(100, ge=1, le=500),
    offset: int = Query(0, ge=0)
):
    """Get raw data with pagination"""
    if df is None or len(df) == 0:
        return {"error": "No data available"}
    
    end_idx = offset + limit
    data = df.iloc[offset:end_idx]
    
    return {
        "total": len(df),
        "limit": limit,
        "offset": offset,
        "data": data.to_dict(orient='records')
    }

@app.get("/api/facilities")
async def get_facilities_summary():
    """Get average satisfaction by facility"""
    if df is None or len(df) == 0:
        return {"error": "No data available"}
    
    facility_summary = df.groupby('facility_rated')['satisfaction_score'].agg(
        mean_score='mean',
        response_count='count',
        std_dev='std'
    ).round(2)
    
    facility_list = []
    for facility, row in facility_summary.iterrows():
        facility_list.append({
            "facility": facility,
            "average_score": float(row['mean_score']),
            "response_count": int(row['response_count']),
            "std_dev": float(row['std_dev'])
        })
    
    return sorted(facility_list, key=lambda x: x['average_score'], reverse=True)

@app.get("/api/filtered")
async def get_filtered_data(
    facility: Optional[str] = None,
    academic_year: Optional[str] = None,
    major: Optional[str] = None,
    min_score: int = Query(1, ge=1, le=5),
    max_score: int = Query(5, ge=1, le=5)
):
    """Get filtered data based on criteria"""
    if df is None or len(df) == 0:
        return {"error": "No data available"}
    
    filtered_df = df.copy()
    
    # Apply filters
    if facility:
        filtered_df = filtered_df[filtered_df['facility_rated'].str.lower() == facility.lower()]
    
    if academic_year:
        filtered_df = filtered_df[filtered_df['academic_year'] == academic_year]
    
    if major:
        filtered_df = filtered_df[filtered_df['major'].str.lower() == major.lower()]
    
    filtered_df = filtered_df[
        (filtered_df['satisfaction_score'] >= min_score) &
        (filtered_df['satisfaction_score'] <= max_score)
    ]
    
    return {
        "filters": {
            "facility": facility,
            "academic_year": academic_year,
            "major": major,
            "score_range": [min_score, max_score]
        },
        "total_records": len(filtered_df),
        "average_score": float(filtered_df['satisfaction_score'].mean()) if len(filtered_df) > 0 else 0,
        "data": filtered_df.to_dict(orient='records')
    }

@app.get("/api/trends")
async def get_trends():
    """Get satisfaction trends over time"""
    if df is None or len(df) == 0:
        return {"error": "No data available"}
    
    # Monthly trend
    df['date'] = pd.to_datetime(df['timestamp']).dt.date
    monthly_trend = df.groupby(df['timestamp'].dt.to_period('M'))['satisfaction_score'].agg(
        mean='mean',
        count='count'
    ).round(2)
    
    trend_data = []
    for month, row in monthly_trend.iterrows():
        trend_data.append({
            "month": str(month),
            "average_score": float(row['mean']),
            "response_count": int(row['count'])
        })
    
    return {
        "monthly_trends": trend_data,
        "trend_direction": "improving" if trend_data[-1]['average_score'] > trend_data[0]['average_score'] else "declining"
    }

@app.get("/api/academic-years")
async def get_academic_years():
    """Get list of available academic years"""
    if df is None or len(df) == 0:
        return []
    return sorted(df['academic_year'].unique().tolist())

@app.get("/api/majors")
async def get_majors():
    """Get list of available majors"""
    if df is None or len(df) == 0:
        return []
    return sorted(df['major'].unique().tolist())

@app.get("/api/facilities-list")
async def get_facilities_list():
    """Get list of available facilities"""
    if df is None or len(df) == 0:
        return []
    return sorted(df['facility_rated'].unique().tolist())

@app.get("/api/satisfaction-distribution")
async def get_satisfaction_distribution():
    """Get distribution of satisfaction categories"""
    if df is None or len(df) == 0:
        return {"error": "No data available"}
    
    category_mapping = {
        1: 'Very Unsatisfied',
        2: 'Unsatisfied',
        3: 'Neutral',
        4: 'Satisfied',
        5: 'Very Satisfied'
    }
    
    distribution = df['satisfaction_score'].value_counts().sort_index()
    
    result = {}
    for score, count in distribution.items():
        result[category_mapping.get(score, f'Score {score}')] = {
            "count": int(count),
            "percentage": round(count / len(df) * 100, 2)
        }
    
    return result

@app.get("/api/major-summary")
async def get_major_summary():
    """Get satisfaction summary by student major"""
    if df is None or len(df) == 0:
        return {"error": "No data available"}

    major_summary = df.groupby('major')['satisfaction_score'].agg(
        average_score='mean',
        response_count='count',
        min_score='min',
        max_score='max'
    ).round(2)

    result = []
    for major, row in major_summary.iterrows():
        result.append({
            "major": major,
            "average_score": float(row['average_score']),
            "response_count": int(row['response_count']),
            "min_score": int(row['min_score']),
            "max_score": int(row['max_score'])
        })

    return sorted(result, key=lambda item: item["average_score"], reverse=True)

@app.get("/api/facility-major-heatmap")
async def get_facility_major_heatmap():
    """Get average satisfaction by facility and major for heatmap visualizations"""
    if df is None or len(df) == 0:
        return {"error": "No data available"}

    pivot = df.pivot_table(
        index='facility_rated',
        columns='major',
        values='satisfaction_score',
        aggfunc='mean'
    ).round(2)

    return {
        "facilities": pivot.index.tolist(),
        "majors": pivot.columns.tolist(),
        "scores": pivot.fillna(0).values.tolist()
    }

@app.get("/api/year-score-distribution")
async def get_year_score_distribution():
    """Get score counts by academic year"""
    if df is None or len(df) == 0:
        return {"error": "No data available"}

    grouped = df.groupby(['academic_year', 'satisfaction_score']).size().reset_index(name='count')
    result = []
    for _, row in grouped.iterrows():
        result.append({
            "academic_year": row['academic_year'],
            "score": int(row['satisfaction_score']),
            "count": int(row['count'])
        })

    return result

# Error handler
@app.exception_handler(Exception)
async def general_exception_handler(request, exc):
    return {
        "error": str(exc),
        "status": "error"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
