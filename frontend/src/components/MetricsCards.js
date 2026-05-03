import React from 'react';

const MetricsCards = ({ metrics }) => {
  return (
    <div className="metrics-grid">
      <div className="metric-card">
        <div className="metric-label">Total Responses</div>
        <div className="metric-value">{metrics.total_responses}</div>
      </div>
      <div className="metric-card">
        <div className="metric-label">Average Satisfaction</div>
        <div className="metric-value">{metrics.average_satisfaction.toFixed(2)}/5.0</div>
      </div>
      <div className="metric-card">
        <div className="metric-label">Standard Deviation</div>
        <div className="metric-value">{metrics.satisfaction_std.toFixed(2)}</div>
      </div>
      <div className="metric-card">
        <div className="metric-label">Score Range</div>
        <div className="metric-value">{metrics.min_score} - {metrics.max_score}</div>
      </div>
    </div>
  );
};

export default MetricsCards;
