import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import config from '../config';

const AllResults = () => {
  const { user } = useAuth();
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    const fetchAllResults = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) throw new Error('No authentication token found');

        const enrolledResponse = await fetch(`${config.API_BASE_URL}${config.API_ENDPOINTS.COURSES.ENROLLED}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          }
        });

        if (!enrolledResponse.ok) throw new Error('Failed to fetch enrolled courses');

        const enrolledCourses = await enrolledResponse.json();
        const processedEnrolledCourses = Array.isArray(enrolledCourses)
          ? enrolledCourses
          : enrolledCourses.$values && Array.isArray(enrolledCourses.$values)
            ? enrolledCourses.$values
            : [];

        const allResults = [];
        for (const course of processedEnrolledCourses) {
          const assessments = await fetchAssessmentsForCourse(course.courseId);
          for (const assessment of assessments) {
            const resultIds = JSON.parse(localStorage.getItem(`results_${assessment.assessmentId}`) || '[]');
            if (resultIds.length > 0) {
              for (const resultId of resultIds) {
                try {
                  const resultResponse = await fetch(`${config.API_BASE_URL}${config.API_ENDPOINTS.RESULTS.GET_BY_ID(resultId)}`, {
                    headers: {
                      'Authorization': `Bearer ${token}`,
                      'Content-Type': 'application/json',
                      'Accept': 'application/json'
                    }
                  });

                  if (resultResponse.ok) {
                    const result = await resultResponse.json();
                    allResults.push({
                      ...result,
                      assessmentTitle: assessment.title,
                      maxScore: assessment.maxScore
                    });
                  }
                } catch (err) {
                  console.error(`Error fetching result ${resultId}:`, err);
                }
              }
            }

            try {
              const resultsResponse = await fetch(`${config.API_BASE_URL}${config.API_ENDPOINTS.RESULTS.GET_BY_ASSESSMENT(assessment.assessmentId)}`, {
                headers: {
                  'Authorization': `Bearer ${token}`,
                  'Content-Type': 'application/json',
                  'Accept': 'application/json'
                }
              });

              if (resultsResponse.ok) {
                const results = await resultsResponse.json();
                const processedResults = Array.isArray(results)
                  ? results
                  : results.$values && Array.isArray(results.$values)
                    ? results.$values
                    : [];

                const userResults = processedResults.filter(result =>
                  result.userId.toLowerCase() === user.userId.toLowerCase()
                );

                allResults.push(...userResults.map(result => ({
                  ...result,
                  assessmentTitle: assessment.title,
                  maxScore: assessment.maxScore
                })));
              }
            } catch (err) {
              console.error(`Error processing assessment ${assessment.assessmentId}:`, err);
            }
          }
        }

        allResults.sort((a, b) => new Date(b.attemptDate) - new Date(a.attemptDate));
        setResults(allResults);
      } catch (err) {
        console.error('Error fetching results:', err);
        setError(err.message || 'Failed to load results');
      } finally {
        setLoading(false);
      }
    };

    fetchAllResults();
  }, [user.userId]);

  const fetchAssessmentsForCourse = async (courseId) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('No authentication token found');

      const response = await fetch(`${config.API_BASE_URL}${config.API_ENDPOINTS.ASSESSMENTS.GET_BY_COURSE(courseId)}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });

      if (!response.ok) return response.status === 404 ? [] : [];

      const data = await response.json();
      return Array.isArray(data)
        ? data
        : data.$values && Array.isArray(data.$values)
          ? data.$values
          : [];
    } catch (err) {
      console.error(`Error fetching assessments for course ${courseId}:`, err);
      return [];
    }
  };

  const filteredResults = results.filter((result) => {
    if (filter === 'all') return true;
    const percentage = (result.score / result.maxScore) * 100;
    return filter === 'passed' ? percentage >= 50 : percentage < 50;
  });

  if (loading) {
    return (
      <div className="container mt-5 text-center">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mt-5">
        <div className="alert alert-danger" role="alert">{error}</div>
      </div>
    );
  }

  return (
    <div className="min-vh-100 py-5 px-3" style={{ backgroundColor: '#121212' }}>
      <div className="container">
        <div className="card bg-dark text-light shadow rounded-4 p-5 mb-5 border-0">
          <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center mb-4 gap-3">
            <h3 className="fw-bold mb-0">
              <i className="bi bi-bar-chart-line me-2"></i> All Assessment Results
            </h3>
            <div className="d-flex flex-wrap gap-2">
              <button
                className={`btn rounded-pill ${filter === 'all' ? 'btn-primary' : 'btn-outline-light'}`}
                onClick={() => setFilter('all')}
              >
                <i className="bi bi-list-ul me-1"></i> All
              </button>
              <button
                className={`btn rounded-pill ${filter === 'passed' ? 'btn-success' : 'btn-outline-light'}`}
                onClick={() => setFilter('passed')}
              >
                <i className="bi bi-check-circle me-1"></i> Passed
              </button>
              <button
                className={`btn rounded-pill ${filter === 'failed' ? 'btn-danger' : 'btn-outline-light'}`}
                onClick={() => setFilter('failed')}
              >
                <i className="bi bi-x-circle me-1"></i> Failed
              </button>
              <Link to="/student-dashboard" className="btn btn-outline-light rounded-pill ms-auto">
                <i className="bi bi-arrow-left me-2"></i> Back to Dashboard
              </Link>
            </div>
          </div>

          {filteredResults.length === 0 ? (
            <div className="alert alert-info bg-dark text-white border border-info mt-4">
              <i className="bi bi-info-circle me-2"></i> No assessment results match the selected filter.
            </div>
          ) : (
            <div className="row g-4">
              {filteredResults.map((result) => (
                <div key={result.resultId} className="col-md-6 col-lg-4">
                  <motion.div
                    whileHover={{ scale: 1.03 }}
                    className="card text-light h-100 border-0 shadow-lg bg-gradient"
                    style={{
                      background: 'linear-gradient(145deg, #1e1e1e, #2a2a2a)',
                      borderRadius: '1rem',
                    }}
                  >
                    <div className="card-body d-flex flex-column">
                      <h5 className="card-title fw-bold text-white mb-3">
                        <i className="bi bi-journal-text me-2"></i> {result.assessmentTitle}
                      </h5>
                      <div className="mb-3 d-flex flex-wrap gap-2">
                        <span className="badge bg-primary bg-opacity-75 px-3 py-2 rounded-pill">
                          <i className="bi bi-check2-circle me-1"></i>
                          Score: {result.score} / {result.maxScore}
                        </span>
                        <span
                          className={`badge px-3 py-2 rounded-pill ${
                            (result.score / result.maxScore) * 100 >= 50
                              ? 'bg-success'
                              : 'bg-danger'
                          } bg-opacity-75`}
                        >
                          {Math.round((result.score / result.maxScore) * 100)}%
                        </span>
                      </div>
                      <p className="text-light-50 fst-italic mt-auto">
                        Attempted on:{' '}
                        <span className="text-light fw-semibold">
                          {new Date(result.attemptDate).toLocaleDateString()}
                        </span>
                      </p>
                        <div className="d-flex gap-2">
                                        <Link 
                                            to={`/results/${result.resultId}`}
                                            className="btn btn-primary flex-grow-1"
                                        >
                                            <i className="bi bi-eye me-2"></i>
                                            View Details
                                        </Link>
                                        {/* <Link 
                                            to={`/student-results/${result.userId}`}
                                            className="btn btn-outline-primary"
                                        >
                                            <i className="bi bi-person me-2"></i>
                                            Student
                                        </Link> */}
                                    </div>
                    </div>
                  </motion.div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AllResults;
