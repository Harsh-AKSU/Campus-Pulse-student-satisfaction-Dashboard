import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Dashboard from './components/Dashboard';
import FilterPanel from './components/FilterPanel';
import MetricsCards from './components/MetricsCards';
import Charts from './components/Charts';
import API_BASE_URL from './api';
import './App.css';

function App() {
  const [currentSection, setCurrentSection] = useState('overview');
  const [data, setData] = useState(null);
  const [facilities, setFacilities] = useState([]);
  const [academicYears, setAcademicYears] = useState([]);
  const [majors, setMajors] = useState([]);
  const [overview, setOverview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Load initial data
  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    setLoading(true);
    try {
      // Fetch overview, facilities, and filter options
      const [overviewRes, facilitiesRes, yearsRes, majorsRes] = await Promise.all([
        axios.get(`${API_BASE_URL}/overview`),
        axios.get(`${API_BASE_URL}/facilities-list`),
        axios.get(`${API_BASE_URL}/academic-years`),
        axios.get(`${API_BASE_URL}/majors`)
      ]);

      setOverview(overviewRes.data);
      setFacilities(facilitiesRes.data);
      setAcademicYears(yearsRes.data);
      setMajors(majorsRes.data);
      setError(null);
    } catch (err) {
      setError('Failed to load data. Make sure the backend is running on http://localhost:8000');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterData = async (filters) => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filters.facility) params.set('facility', filters.facility);
      if (filters.academic_year) params.set('academic_year', filters.academic_year);
      if (filters.major) params.set('major', filters.major);
      params.set('min_score', filters.min_score);
      params.set('max_score', filters.max_score);

      const res = await axios.get(`${API_BASE_URL}/filtered?${params.toString()}`);
      setData(res.data);
      setCurrentSection('filtered');
      setError(null);
    } catch (err) {
      setError('Failed to filter data');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <header>
        <h1>Campus Pulse</h1>
        <p>Student Satisfaction Dashboard</p>
      </header>

      <div className="navbar">
        <div
          className={`nav-item ${currentSection === 'overview' ? 'active' : ''}`}
          onClick={() => { setCurrentSection('overview'); setError(null); }}
        >
          <i className="fas fa-home"></i> Overview
        </div>
        <div
          className={`nav-item ${currentSection === 'facilities' ? 'active' : ''}`}
          onClick={() => setCurrentSection('facilities')}
        >
          <i className="fas fa-building"></i> Facilities
        </div>
        <div
          className={`nav-item ${currentSection === 'trends' ? 'active' : ''}`}
          onClick={() => setCurrentSection('trends')}
        >
          <i className="fas fa-chart-line"></i> Trends
        </div>
        <div
          className={`nav-item ${currentSection === 'insights' ? 'active' : ''}`}
          onClick={() => setCurrentSection('insights')}
        >
          <i className="fas fa-chart-pie"></i> Insights
        </div>
        <div
          className={`nav-item ${currentSection === 'filter' ? 'active' : ''}`}
          onClick={() => setCurrentSection('filter')}
        >
          <i className="fas fa-filter"></i> Filter Data
        </div>
      </div>

      <div className="content">
        {error && <div className="error">{error}</div>}
        {loading && <div className="loading">Loading...</div>}

        {currentSection === 'overview' && !loading && (
          <>
            {overview && <MetricsCards metrics={overview} />}
            <Charts type="overview" />
          </>
        )}

        {currentSection === 'facilities' && !loading && (
          <>
            <Charts type="facilities" />
          </>
        )}

        {currentSection === 'trends' && !loading && (
          <>
            <Charts type="trends" />
          </>
        )}

        {currentSection === 'insights' && !loading && (
          <>
            <Charts type="insights" />
          </>
        )}

        {currentSection === 'filter' && !loading && (
          <>
            <FilterPanel
              facilities={facilities}
              academicYears={academicYears}
              majors={majors}
              onFilter={handleFilterData}
            />
            {data && <Dashboard data={data} />}
          </>
        )}

        {currentSection === 'filtered' && !loading && data && (
          <Dashboard data={data} />
        )}
      </div>

      <footer>
        <p>&copy; 2024 Campus Pulse Dashboard - Student Satisfaction Analytics</p>
      </footer>
    </div>
  );
}

export default App;
