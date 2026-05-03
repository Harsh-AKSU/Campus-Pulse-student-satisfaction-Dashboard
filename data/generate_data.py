"""
Script to generate synthetic student satisfaction survey data
for the Campus Pulse Dashboard project.
"""

import pandas as pd
import numpy as np
import json
from datetime import datetime, timedelta
import random
from pathlib import Path

# Set random seed for reproducibility
np.random.seed(42)
random.seed(42)

# Parameters
n_records = 500
start_date = datetime(2023, 1, 1)
end_date = datetime(2024, 12, 31)

# Define choices
academic_years = ['2023-2024', '2024-2025']
majors = ['Computer Science', 'Engineering', 'Business', 'Arts', 'Medicine', 
          'Law', 'Education', 'Sciences']
facilities = ['Library', 'Cafeteria', 'Sports Center', 'Dormitory', 
              'Student Center', 'Lab Facilities', 'Parking', 'Medical Center']
satisfaction_scores = [1, 2, 3, 4, 5]

# Generate data
data = {
    'student_id': [f'STU{str(i).zfill(5)}' for i in range(1, n_records + 1)],
    'academic_year': np.random.choice(academic_years, n_records),
    'major': np.random.choice(majors, n_records),
    'facility_rated': np.random.choice(facilities, n_records),
    'satisfaction_score': np.random.choice(satisfaction_scores, n_records, p=[0.05, 0.10, 0.20, 0.35, 0.30]),
    'timestamp': [start_date + timedelta(days=random.randint(0, (end_date - start_date).days)) 
                  for _ in range(n_records)],
    'feedback': [random.choice([
        'Excellent service',
        'Good experience',
        'Average facilities',
        'Needs improvement',
        'Poor quality',
        'Satisfactory',
        'Very satisfied',
        'Not satisfied'
    ]) for _ in range(n_records)]
}

# Create DataFrame
df = pd.DataFrame(data)

# Sort by timestamp
df = df.sort_values('timestamp').reset_index(drop=True)

# Save to CSV
output_path = Path(__file__).resolve().parent / 'student_satisfaction_data.csv'
df.to_csv(output_path, index=False)

metrics_path = Path(__file__).resolve().parent / 'key_metrics.json'
metrics = {
    "total_responses": int(len(df)),
    "average_satisfaction": round(float(df['satisfaction_score'].mean()), 2),
    "min_score": int(df['satisfaction_score'].min()),
    "max_score": int(df['satisfaction_score'].max()),
    "facility_count": int(df['facility_rated'].nunique()),
    "academic_years": sorted(df['academic_year'].unique().tolist()),
}
with metrics_path.open('w') as f:
    json.dump(metrics, f, indent=2)

print("Synthetic dataset generated successfully!")
print(f"Total records: {len(df)}")
print(f"File saved to: {output_path}")
print(f"Metrics saved to: {metrics_path}")
print("\nDataset Overview:")
print(df.head(10))
print("\nDataset Info:")
print(df.info())
print("\nDataset Statistics:")
print(df['satisfaction_score'].describe())
