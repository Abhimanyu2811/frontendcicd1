import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import config from '../config';


const CourseDetails = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [course, setCourse] = useState(null);
  const [assessments, setAssessments] = useState([]);
  const [assessmentAttempts, setAssessmentAttempts] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("overview");

  const handleDeleteAssessment = async (assessmentId) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No authentication token found");
      }

      const response = await fetch(
        `${config.API_BASE_URL}/api/Assessments/${assessmentId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || "Failed to delete assessment");
      }

      setAssessments(
        assessments.filter(
          (assessment) => assessment.assessmentId !== assessmentId
        )
      );
    } catch (err) {
      console.error("Error deleting assessment:", err);
      setError(err.message);
    }
  };

  useEffect(() => {
    const fetchCourseDetails = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("No authentication token found");
        }

        // Fetch course details
        const courseResponse = await fetch(
          `${config.API_BASE_URL}/api/Courses/${courseId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (!courseResponse.ok) {
          throw new Error("Failed to fetch course details");
        }

        const courseData = await courseResponse.json();
        setCourse(courseData);

        // Fetch assessments for the course
        const assessmentsResponse = await fetch(
          `${config.API_BASE_URL}/api/Assessments/course/${courseId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (!assessmentsResponse.ok) {
          throw new Error("Failed to fetch assessments");
        }

        const assessmentsData = await assessmentsResponse.json();
        const processedAssessments = Array.isArray(assessmentsData)
          ? assessmentsData
          : assessmentsData.$values && Array.isArray(assessmentsData.$values)
          ? assessmentsData.$values
          : [];

        setAssessments(processedAssessments);

        // Fetch assessment attempts for each assessment
        const attempts = {};
        for (const assessment of processedAssessments) {
          try {
            console.log(
              `Fetching results for assessment ${assessment.assessmentId}`
            );
            const resultsResponse = await fetch(
              `https://webappnamenewproject-byb2fqbqhha5efab.centralindia-01.azurewebsites.net/api/Results/student/${user.userId}/assessment/${assessment.assessmentId}`,
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                  "Content-Type": "application/json",
                },
              }
            );

            if (resultsResponse.ok) {
              const results = await resultsResponse.json();
              console.log(
                `Results for assessment ${assessment.assessmentId}:`,
                results
              );

              // Check if results is an array or has $values property
              const processedResults = Array.isArray(results)
                ? results
                : results.$values && Array.isArray(results.$values)
                ? results.$values
                : results
                ? [results]
                : [];

              attempts[assessment.assessmentId] = processedResults.length;
              console.log(
                `Attempts for assessment ${assessment.assessmentId}:`,
                attempts[assessment.assessmentId]
              );
            } else {
              console.log(
                `No results found for assessment ${assessment.assessmentId}`
              );
              attempts[assessment.assessmentId] = 0;
            }
          } catch (err) {
            console.error(
              `Error fetching results for assessment ${assessment.assessmentId}:`,
              err
            );
            attempts[assessment.assessmentId] = 0;
          }
        }

        console.log("Final attempts object:", attempts);
        setAssessmentAttempts(attempts);
      } catch (err) {
        console.error("Error fetching course details:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (user && user.userId) {
      fetchCourseDetails();
    }
  }, [courseId, user]);

  const handleDownload = (fileKey) => {
    const fileData = localStorage.getItem(fileKey);
    if (fileData) {
      const link = document.createElement("a");
      link.href = fileData;
      link.download = course.localFile.name;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  if (loading) {
    return (
      <div className="container mt-5 bg-black text-light">
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mt-5 bg-black text-light">
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="container mt-5 bg-black text-light">
        <div className="alert alert-warning" role="alert">
          Course not found
        </div>
      </div>
    );
  }


  return (
    <div className="container-fluid mt-4 bg-black text-light px-3 px-md-5">
      <div className="row mb-4 align-items-center">
        <div className="col-md-4 mb-3 mb-md-0" style={{ maxHeight: '250px', overflow: 'hidden', borderRadius: '8px' }}>
          {course.mediaUrl ? (
            <img
              src={course.mediaUrl}
              alt={course.title}
              className="img-fluid rounded"
              style={{ height: '250px', width: '100%', objectFit: 'cover', boxShadow: '0 4px 10px rgba(0,0,0,0.6)' }}
            />
          ) : (
            <div
              className="bg-dark d-flex align-items-center justify-content-center rounded"
              style={{ height: '250px', boxShadow: '0 4px 10px rgba(0,0,0,0.6)' }}
            >
              <i className="bi bi-book text-muted" style={{ fontSize: '5rem' }}></i>
            </div>
          )}
        </div>
        <div className="col-md-8 ps-md-4">
          <h1 className="mb-3 fw-bold">{course.title}</h1>
          <p className="lead"style={{ color: '#e0e0e0' }}>{course.description}</p>

          {/* Buttons below description */}
          <div className="d-flex gap-3 flex-wrap mb-4">
            <button
              className={`btn btn-outline-light px-4 py-2 fw-semibold ${activeTab === 'content' ? 'active btn-primary' : ''}`}
              onClick={() => setActiveTab('content')}
              style={{ minWidth: '140px', borderRadius: '30px' }}
            >
              Course Content
            </button>
            <button
              className={`btn btn-outline-light px-4 py-2 fw-semibold ${activeTab === 'assessments' ? 'active btn-primary' : ''}`}
              onClick={() => setActiveTab('assessments')}
              style={{ minWidth: '140px', borderRadius: '30px' }}
            >
              Assessments
            </button>
          </div>
        </div>
      </div>

      {/* Tab content below buttons */}
      <div className="tab-content">
        {activeTab === 'content' && (
          <div className="card bg-dark text-light shadow-sm rounded-3 p-4 mb-5 border-0">
            <h3 className="mb-4 border-bottom pb-2">Course Content</h3>
            {course.courseUrl ? (
              <div className="ratio ratio-16x9 rounded">
                <iframe
                  src={course.courseUrl}
                  title="Course Video"
                  allowFullScreen
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  className="rounded"
                  style={{ border: 'none' }}
                ></iframe>
              </div>
            ) : (
              <p className="text-muted fst-italic">No course video available.</p>
            )}
          </div>
        )}

{activeTab === 'assessments' && (
  <div className="card bg-dark text-light shadow rounded-4 p-5 mb-5 border-0">
    <h3 className="mb-4 pb-3 border-bottom border-secondary" style={{ fontWeight: 700 }}>
      <i className="bi bi-clipboard-check me-2"></i> Assessments
    </h3>

    {assessments.length > 0 ? (
      <div className="row g-4">
        {assessments.map((assessment) => (
          <div key={assessment.assessmentId} className="col-md-6">
            <div
              className="card text-light h-100 border-0 shadow-lg bg-gradient"
              style={{
                background: 'linear-gradient(145deg, #1e1e1e, #2a2a2a)',
                borderRadius: '1rem',
              }}
            >
              <div className="card-body d-flex flex-column">
                <h5 className="card-title fw-bold text-white mb-3">
                  <i className="bi bi-journal-text me-2"></i> {assessment.title}
                </h5>

                <div className="mb-3 d-flex flex-wrap gap-2">
                  <span className="badge bg-primary bg-opacity-75 px-3 py-2 rounded-pill">
                    <i className="bi bi-question-circle me-1"></i> {assessment.questionCount} Questions
                  </span>
                  <span className="badge bg-success bg-opacity-75 px-3 py-2 rounded-pill">
                    <i className="bi bi-star me-1"></i> Max Score: {assessment.maxScore}
                  </span>
                </div>

                <p className="text-light-50 fst-italic flex-grow-1">
                  Test your knowledge and understanding of the course material.
                </p>
              </div>

              <div className="card-footer bg-transparent border-top-0 mt-auto pt-3">
                {user?.role === 'Instructor' ? (
                  <div className="d-flex gap-2 flex-wrap">
                    <Link
                      to={`/edit-assessment/${assessment.assessmentId}`}
                      className="btn btn-outline-primary flex-grow-1 rounded-pill"
                    >
                      <i className="bi bi-pencil me-2"></i> Edit
                    </Link>
                    <button
                      className="btn btn-outline-danger flex-grow-1 rounded-pill"
                      onClick={() => {
                        if (window.confirm('Are you sure you want to delete this assessment?')) {
                          handleDeleteAssessment(assessment.assessmentId);
                        }
                      }}
                    >
                      <i className="bi bi-trash me-2"></i> Delete
                    </button>
                  </div>
                ) : assessmentAttempts[assessment.assessmentId] > 0 ? (
                  <>
                    <button className="btn btn-success w-100 mb-2 rounded-pill" disabled>
                      <i className="bi bi-check-circle me-2"></i> Completed
                    </button>
                    {/* <Link
                      to={`/all-results`}
                      className="btn btn-outline-light w-100 rounded-pill"
                    >
                      <i className="bi bi-eye me-2"></i> View Results
                    </Link> */}
                  </>
                ) : (
                  <Link
                    to={`/assessment/${assessment.assessmentId}`}
                    className="btn btn-success w-100 rounded-pill"
                  >
                    <i className="bi bi-pencil-square me-2"></i> Take Assessment
                  </Link>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    ) : (
      <div className="alert alert-info bg-dark text-white border border-info mt-4">
        <i className="bi bi-info-circle me-2"></i> No assessments available for this course yet.
      </div>
    )}
  </div>
)}

      </div>
    </div>
  );
};

export default CourseDetails;
