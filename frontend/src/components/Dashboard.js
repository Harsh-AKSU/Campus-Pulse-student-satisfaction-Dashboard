import React, { useEffect, useMemo, useState } from 'react';

const PAGE_SIZE = 10;

const Dashboard = ({ data }) => {
  const [page, setPage] = useState(1);

  useEffect(() => {
    setPage(1);
  }, [data]);

  const rows = useMemo(() => data?.data || [], [data]);
  const totalPages = Math.max(1, Math.ceil(rows.length / PAGE_SIZE));
  const displayData = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return rows.slice(start, start + PAGE_SIZE);
  }, [page, rows]);

  const scoreCounts = useMemo(() => {
    return rows.reduce((acc, row) => {
      acc[row.satisfaction_score] = (acc[row.satisfaction_score] || 0) + 1;
      return acc;
    }, {});
  }, [rows]);

  if (!data) return null;

  return (
    <div className="chart-panel chart-panel-wide">
      <div className="panel-heading">
        <h3>Filtered Results</h3>
        <span>{rows.length} matching responses</span>
      </div>

      <div className="result-summary">
        <div>
          <span>Total Records</span>
          <strong>{data.total_records}</strong>
        </div>
        <div>
          <span>Average Score</span>
          <strong>{data.average_score.toFixed(2)}/5</strong>
        </div>
        {[1, 2, 3, 4, 5].map(score => (
          <div key={score}>
            <span>Score {score}</span>
            <strong>{scoreCounts[score] || 0}</strong>
          </div>
        ))}
      </div>

      {data.filters && (
        <div className="filter-chips">
          {data.filters.facility && <span>Facility: {data.filters.facility}</span>}
          {data.filters.academic_year && <span>Year: {data.filters.academic_year}</span>}
          {data.filters.major && <span>Major: {data.filters.major}</span>}
          <span>Score: {data.filters.score_range[0]} - {data.filters.score_range[1]}</span>
        </div>
      )}

      {displayData.length > 0 ? (
        <>
          <div className="table-wrap">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Student ID</th>
                  <th>Facility</th>
                  <th>Score</th>
                  <th>Academic Year</th>
                  <th>Major</th>
                  <th>Feedback</th>
                </tr>
              </thead>
              <tbody>
                {displayData.map((row, idx) => (
                  <tr key={`${row.student_id}-${idx}`}>
                    <td>{row.student_id}</td>
                    <td>{row.facility_rated}</td>
                    <td>
                      <span className={`score-badge score-${row.satisfaction_score}`}>
                        {row.satisfaction_score}
                      </span>
                    </td>
                    <td>{row.academic_year}</td>
                    <td>{row.major}</td>
                    <td>{row.feedback}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="pagination">
            <button disabled={page === 1} onClick={() => setPage(prev => prev - 1)}>
              Previous
            </button>
            <span>Page {page} of {totalPages}</span>
            <button disabled={page === totalPages} onClick={() => setPage(prev => prev + 1)}>
              Next
            </button>
          </div>
        </>
      ) : (
        <p className="empty-state">No data found with the applied filters.</p>
      )}
    </div>
  );
};

export default Dashboard;
