import React, { useCallback, useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import Plot from 'react-plotly.js';
import API_BASE_URL from '../api';

const chartLayout = {
  autosize: true,
  margin: { t: 32, r: 24, b: 56, l: 64 },
  paper_bgcolor: 'rgba(0,0,0,0)',
  plot_bgcolor: 'rgba(0,0,0,0)',
  font: { family: 'Segoe UI, Arial, sans-serif', color: '#243042' },
  hoverlabel: { bgcolor: '#111827', bordercolor: '#111827', font: { color: '#ffffff' } }
};

const chartConfig = {
  responsive: true,
  displaylogo: false,
  modeBarButtonsToRemove: ['lasso2d', 'select2d']
};

const scoreColors = ['#d64545', '#f59e0b', '#facc15', '#22c55e', '#15803d'];

const Charts = ({ type }) => {
  const [facilitiesData, setFacilitiesData] = useState([]);
  const [distributionData, setDistributionData] = useState(null);
  const [trendsData, setTrendsData] = useState([]);
  const [majorData, setMajorData] = useState([]);
  const [heatmapData, setHeatmapData] = useState(null);
  const [yearScoreData, setYearScoreData] = useState([]);
  const [selectedFacility, setSelectedFacility] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchChartData = useCallback(async () => {
    setLoading(true);
    try {
      if (type === 'overview') {
        const [distributionRes, facilitiesRes] = await Promise.all([
          axios.get(`${API_BASE_URL}/satisfaction-distribution`),
          axios.get(`${API_BASE_URL}/facilities`)
        ]);
        setDistributionData(distributionRes.data);
        setFacilitiesData(facilitiesRes.data);
      }

      if (type === 'facilities') {
        const [facilitiesRes, majorRes] = await Promise.all([
          axios.get(`${API_BASE_URL}/facilities`),
          axios.get(`${API_BASE_URL}/major-summary`)
        ]);
        setFacilitiesData(facilitiesRes.data);
        setMajorData(majorRes.data);
      }

      if (type === 'trends') {
        const [trendsRes, yearScoreRes] = await Promise.all([
          axios.get(`${API_BASE_URL}/trends`),
          axios.get(`${API_BASE_URL}/year-score-distribution`)
        ]);
        setTrendsData(trendsRes.data.monthly_trends || []);
        setYearScoreData(yearScoreRes.data);
      }

      if (type === 'insights') {
        const [heatmapRes, majorRes, facilitiesRes] = await Promise.all([
          axios.get(`${API_BASE_URL}/facility-major-heatmap`),
          axios.get(`${API_BASE_URL}/major-summary`),
          axios.get(`${API_BASE_URL}/facilities`)
        ]);
        setHeatmapData(heatmapRes.data);
        setMajorData(majorRes.data);
        setFacilitiesData(facilitiesRes.data);
      }
    } catch (error) {
      console.error('Error fetching chart data:', error);
    } finally {
      setLoading(false);
    }
  }, [type]);

  useEffect(() => {
    fetchChartData();
  }, [fetchChartData]);

  const distributionSeries = useMemo(() => {
    if (!distributionData) return null;
    const labels = ['Very Unsatisfied', 'Unsatisfied', 'Neutral', 'Satisfied', 'Very Satisfied'];
    return {
      labels,
      values: labels.map(label => distributionData[label]?.count || 0),
      percentages: labels.map(label => distributionData[label]?.percentage || 0)
    };
  }, [distributionData]);

  const selectedFacilityDetails = selectedFacility
    ? facilitiesData.find(item => item.facility === selectedFacility)
    : facilitiesData[0];

  const renderOverview = () => {
    if (!distributionSeries || !facilitiesData.length) return <p>No data available</p>;
    const topFacilities = [...facilitiesData].sort((a, b) => b.average_score - a.average_score).slice(0, 5);

    return (
      <div className="analytics-grid">
        <section className="chart-panel">
          <div className="panel-heading">
            <h3>Satisfaction Mix</h3>
            <span>Hover slices for exact counts</span>
          </div>
          <Plot
            data={[{
              type: 'pie',
              labels: distributionSeries.labels,
              values: distributionSeries.values,
              hole: 0.55,
              marker: { colors: scoreColors },
              textinfo: 'label+percent',
              hovertemplate: '%{label}<br>%{value} responses<br>%{percent}<extra></extra>'
            }]}
            layout={{ ...chartLayout, showlegend: false, height: 360 }}
            config={chartConfig}
            className="plot"
            useResizeHandler
          />
        </section>

        <section className="chart-panel">
          <div className="panel-heading">
            <h3>Top Facilities</h3>
            <span>Ranked by average satisfaction</span>
          </div>
          <Plot
            data={[{
              type: 'bar',
              orientation: 'h',
              x: topFacilities.map(item => item.average_score),
              y: topFacilities.map(item => item.facility),
              marker: { color: topFacilities.map(item => item.average_score), colorscale: 'Viridis' },
              hovertemplate: '%{y}<br>Average: %{x:.2f}/5<extra></extra>'
            }]}
            layout={{
              ...chartLayout,
              height: 360,
              xaxis: { range: [0, 5], title: 'Average score' },
              yaxis: { automargin: true }
            }}
            config={chartConfig}
            className="plot"
            useResizeHandler
          />
        </section>
      </div>
    );
  };

  const renderFacilities = () => {
    if (!facilitiesData.length) return <p>No data available</p>;

    return (
      <div className="analytics-grid">
        <section className="chart-panel chart-panel-wide">
          <div className="panel-heading">
            <h3>Facility Performance</h3>
            <span>Click a bar to inspect the facility</span>
          </div>
          <Plot
            data={[{
              type: 'bar',
              x: facilitiesData.map(item => item.facility),
              y: facilitiesData.map(item => item.average_score),
              customdata: facilitiesData.map(item => item.response_count),
              marker: {
                color: facilitiesData.map(item => item.average_score),
                colorscale: 'RdYlGn',
                cmin: 1,
                cmax: 5
              },
              hovertemplate: '%{x}<br>Average: %{y:.2f}/5<br>Responses: %{customdata}<extra></extra>'
            }]}
            layout={{
              ...chartLayout,
              height: 420,
              yaxis: { range: [0, 5], title: 'Average score' },
              xaxis: { tickangle: -25 }
            }}
            config={chartConfig}
            className="plot"
            useResizeHandler
            onClick={(event) => setSelectedFacility(event.points[0].x)}
          />
        </section>

        <section className="insight-panel">
          <h3>{selectedFacilityDetails?.facility || 'Facility'} Snapshot</h3>
          <div className="insight-number">{selectedFacilityDetails?.average_score?.toFixed(2) || '--'}</div>
          <p>Average satisfaction score</p>
          <div className="insight-list">
            <span>Responses</span>
            <strong>{selectedFacilityDetails?.response_count || 0}</strong>
          </div>
          <div className="insight-list">
            <span>Std. deviation</span>
            <strong>{selectedFacilityDetails?.std_dev?.toFixed(2) || '--'}</strong>
          </div>
        </section>

        <section className="chart-panel">
          <div className="panel-heading">
            <h3>Response Volume</h3>
            <span>Survey count by facility</span>
          </div>
          <Plot
            data={[{
              type: 'bar',
              x: facilitiesData.map(item => item.facility),
              y: facilitiesData.map(item => item.response_count),
              marker: { color: '#2563eb' },
              hovertemplate: '%{x}<br>%{y} responses<extra></extra>'
            }]}
            layout={{ ...chartLayout, height: 360, xaxis: { tickangle: -30 }, yaxis: { title: 'Responses' } }}
            config={chartConfig}
            className="plot"
            useResizeHandler
          />
        </section>

        <section className="chart-panel">
          <div className="panel-heading">
            <h3>Majors Ranking</h3>
            <span>Average score by major</span>
          </div>
          <Plot
            data={[{
              type: 'bar',
              orientation: 'h',
              x: majorData.map(item => item.average_score),
              y: majorData.map(item => item.major),
              marker: { color: '#0f766e' },
              hovertemplate: '%{y}<br>Average: %{x:.2f}/5<extra></extra>'
            }]}
            layout={{ ...chartLayout, height: 360, xaxis: { range: [0, 5] }, yaxis: { automargin: true } }}
            config={chartConfig}
            className="plot"
            useResizeHandler
          />
        </section>
      </div>
    );
  };

  const renderTrends = () => {
    if (!trendsData.length) return <p>No trend data available</p>;
    const years = [...new Set(yearScoreData.map(item => item.academic_year))];

    return (
      <div className="analytics-grid">
        <section className="chart-panel chart-panel-wide">
          <div className="panel-heading">
            <h3>Monthly Satisfaction Trend</h3>
            <span>Line chart with response volume markers</span>
          </div>
          <Plot
            data={[{
              type: 'scatter',
              mode: 'lines+markers',
              x: trendsData.map(item => item.month),
              y: trendsData.map(item => item.average_score),
              marker: {
                size: trendsData.map(item => Math.max(8, item.response_count / 2)),
                color: '#2563eb'
              },
              line: { color: '#2563eb', width: 3 },
              customdata: trendsData.map(item => item.response_count),
              hovertemplate: '%{x}<br>Average: %{y:.2f}/5<br>Responses: %{customdata}<extra></extra>'
            }]}
            layout={{ ...chartLayout, height: 420, yaxis: { range: [0, 5], title: 'Average score' } }}
            config={chartConfig}
            className="plot"
            useResizeHandler
          />
        </section>

        <section className="chart-panel chart-panel-wide">
          <div className="panel-heading">
            <h3>Scores by Academic Year</h3>
            <span>Stacked score distribution</span>
          </div>
          <Plot
            data={[1, 2, 3, 4, 5].map(score => ({
              type: 'bar',
              name: `Score ${score}`,
              x: years,
              y: years.map(year => (
                yearScoreData.find(item => item.academic_year === year && item.score === score)?.count || 0
              )),
              marker: { color: scoreColors[score - 1] },
              hovertemplate: '%{x}<br>Score: ' + score + '<br>Count: %{y}<extra></extra>'
            }))}
            layout={{ ...chartLayout, height: 390, barmode: 'stack', yaxis: { title: 'Responses' } }}
            config={chartConfig}
            className="plot"
            useResizeHandler
          />
        </section>
      </div>
    );
  };

  const renderInsights = () => {
    if (!heatmapData || !majorData.length || !facilitiesData.length) return <p>No insight data available</p>;

    return (
      <div className="analytics-grid">
        <section className="chart-panel chart-panel-wide">
          <div className="panel-heading">
            <h3>Facility and Major Heatmap</h3>
            <span>Darker cells show stronger satisfaction</span>
          </div>
          <Plot
            data={[{
              type: 'heatmap',
              z: heatmapData.scores,
              x: heatmapData.majors,
              y: heatmapData.facilities,
              colorscale: 'YlGnBu',
              zmin: 1,
              zmax: 5,
              hovertemplate: 'Major: %{x}<br>Facility: %{y}<br>Average: %{z:.2f}/5<extra></extra>'
            }]}
            layout={{ ...chartLayout, height: 520, xaxis: { tickangle: -30 }, yaxis: { automargin: true } }}
            config={chartConfig}
            className="plot"
            useResizeHandler
          />
        </section>

        <section className="chart-panel">
          <div className="panel-heading">
            <h3>Score vs. Response Count</h3>
            <span>Facility balance view</span>
          </div>
          <Plot
            data={[{
              type: 'scatter',
              mode: 'markers',
              x: facilitiesData.map(item => item.response_count),
              y: facilitiesData.map(item => item.average_score),
              text: facilitiesData.map(item => item.facility),
              marker: {
                size: facilitiesData.map(item => Math.max(16, item.response_count / 2)),
                color: facilitiesData.map(item => item.std_dev),
                colorscale: 'Plasma',
                showscale: true,
                colorbar: { title: 'Std.' }
              },
              hovertemplate: '%{text}<br>Responses: %{x}<br>Average: %{y:.2f}/5<extra></extra>'
            }]}
            layout={{
              ...chartLayout,
              height: 390,
              xaxis: { title: 'Responses' },
              yaxis: { range: [0, 5], title: 'Average score' }
            }}
            config={chartConfig}
            className="plot"
            useResizeHandler
          />
        </section>

        <section className="chart-panel">
          <div className="panel-heading">
            <h3>Major Participation</h3>
            <span>Survey count by major</span>
          </div>
          <Plot
            data={[{
              type: 'bar',
              x: majorData.map(item => item.major),
              y: majorData.map(item => item.response_count),
              marker: { color: '#7c3aed' },
              hovertemplate: '%{x}<br>%{y} responses<extra></extra>'
            }]}
            layout={{ ...chartLayout, height: 390, xaxis: { tickangle: -30 }, yaxis: { title: 'Responses' } }}
            config={chartConfig}
            className="plot"
            useResizeHandler
          />
        </section>
      </div>
    );
  };

  if (loading) return <div className="loading">Loading chart data...</div>;

  return (
    <>
      {type === 'overview' && renderOverview()}
      {type === 'facilities' && renderFacilities()}
      {type === 'trends' && renderTrends()}
      {type === 'insights' && renderInsights()}
    </>
  );
};

export default Charts;
