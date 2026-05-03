import React, { useState } from 'react';

const FilterPanel = ({ facilities, academicYears, majors, onFilter }) => {
  const [filters, setFilters] = useState({
    facility: '',
    academic_year: '',
    major: '',
    min_score: 1,
    max_score: 5
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: name.includes('score') ? parseInt(value) : value
    }));
  };

  const handleFilter = () => {
    onFilter(filters);
  };

  const handleReset = () => {
    setFilters({
      facility: '',
      academic_year: '',
      major: '',
      min_score: 1,
      max_score: 5
    });
  };

  return (
    <div className="filters">
      <div className="filter-group">
        <label>Facility</label>
        <select name="facility" value={filters.facility} onChange={handleChange}>
          <option value="">All Facilities</option>
          {facilities.map(f => (
            <option key={f} value={f}>{f}</option>
          ))}
        </select>
      </div>

      <div className="filter-group">
        <label>Academic Year</label>
        <select name="academic_year" value={filters.academic_year} onChange={handleChange}>
          <option value="">All Years</option>
          {academicYears.map(y => (
            <option key={y} value={y}>{y}</option>
          ))}
        </select>
      </div>

      <div className="filter-group">
        <label>Major</label>
        <select name="major" value={filters.major} onChange={handleChange}>
          <option value="">All Majors</option>
          {majors.map(m => (
            <option key={m} value={m}>{m}</option>
          ))}
        </select>
      </div>

      <div className="filter-group">
        <label>Minimum Score</label>
        <select name="min_score" value={filters.min_score} onChange={handleChange}>
          {[1, 2, 3, 4, 5].map(score => (
            <option key={score} value={score}>{score}</option>
          ))}
        </select>
      </div>

      <div className="filter-group">
        <label>Maximum Score</label>
        <select name="max_score" value={filters.max_score} onChange={handleChange}>
          {[1, 2, 3, 4, 5].map(score => (
            <option key={score} value={score}>{score}</option>
          ))}
        </select>
      </div>

      <div className="btn-group" style={{ gridColumn: '1 / -1' }}>
        <button className="btn-primary" onClick={handleFilter}>
          <i className="fas fa-search"></i> Apply Filters
        </button>
        <button className="btn-secondary" onClick={handleReset}>
          <i className="fas fa-redo"></i> Reset
        </button>
      </div>
    </div>
  );
};

export default FilterPanel;
