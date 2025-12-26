import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate, Link } from 'react-router-dom';

import Sidebar from "./Sidebar";

function ViewLessons() {
    const { courseId } = useParams();
    
    const navigate = useNavigate();
    const [lessons, setLessons] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [courseName, setCourseName] = useState('');
    const [validCourseId, setValidCourseId] = useState(false);

    useEffect(() => {
        console.log("ViewLessons mounted. Course ID:", courseId);
        console.log("Type of courseId:", typeof courseId);
        
        // Validate courseId
        if (!courseId || courseId === "undefined" || courseId === "null") {
            console.error("Invalid courseId detected:", courseId);
            setError("Invalid course ID. Please select a valid course.");
            setLoading(false);
            return;
        }
        
        // Parse to number and validate
        const parsedCourseId = parseInt(courseId);
        if (isNaN(parsedCourseId) || parsedCourseId <= 0) {
            console.error("Invalid courseId (not a number):", courseId);
            setError("Invalid course ID format. Must be a positive number.");
            setLoading(false);
            return;
        }
        
        console.log("Valid courseId:", parsedCourseId);
        setValidCourseId(true);
        fetchCourseDetails(parsedCourseId);
        fetchLessons(parsedCourseId);
        
    }, [courseId]);

    const fetchCourseDetails = async (id) => {
        try {
            console.log("Fetching course details for ID:", id);
            const response = await axios.get(`http://localhost:8080/courses/${id}`);
            console.log("Course details response:", response.data);
            setCourseName(response.data.courseName || `Course #${id}`);
        } catch (error) {
            console.error("Error fetching course details:", error);
            setCourseName(`Course #${id}`);
            
            if (error.response?.status === 404) {
                setError(`Course with ID ${id} not found.`);
            }
        }
    };

    const fetchLessons = async (id) => {
        setLoading(true);
        setError(null);
        
        try {
            console.log("Fetching lessons for course ID:", id);
            const response = await axios.get(`http://localhost:8080/lessons/course/${id}`);
            console.log("Lessons API response:", response.data);
            setLessons(response.data || []);
        } catch (error) {
            console.error("Error fetching lessons:", error);
            
            let errorMessage = "Failed to load lessons.";
            if (error.response) {
                if (error.response.status === 404) {
                    errorMessage = "No lessons found for this course.";
                } else {
                    errorMessage = error.response.data?.message || errorMessage;
                }
            } else if (error.request) {
                errorMessage = "No response from server. Please check your connection.";
            }
            
            setError(errorMessage);
            setLessons([]);
        } finally {
            setLoading(false);
        }
    };

    // Function to extract filename from path
    const getFileNameFromPath = (path) => {
        if (!path) return null;
        return path.split('\\').pop().split('/').pop();
    };

    // Function to view PDF
    const viewPDF = (path) => {
        const fileName = getFileNameFromPath(path);
        if (fileName) {
            window.open(`http://localhost:8080/files/pdf/${fileName}`, '_blank');
        }
    };

    // Function to view Video
    const viewVideo = (path) => {
        const fileName = getFileNameFromPath(path);
        if (fileName) {
            window.open(`http://localhost:8080/files/video/${fileName}`, '_blank');
        }
    };

    // If courseId is invalid, show error
    if (!validCourseId && !loading) {
        return (
            <>
                <div className="main-content">
                    <Sidebar />
                    <div className="content container mt-4">
                        <div className="alert alert-danger">
                            <h5 className="alert-heading">
                                <i className="fas fa-exclamation-triangle me-2"></i>
                                Invalid Course
                            </h5>
                            <p>Please select a valid course to view lessons.</p>
                            <div className="mt-3">
                                <button 
                                    className="btn btn-primary me-2"
                                    onClick={() => navigate("/teacher")}
                                >
                                    <i className="fas fa-arrow-left me-2"></i>
                                    Back to Dashboard
                                </button>
                                <button 
                                    className="btn btn-outline-primary"
                                    onClick={() => navigate("/view-course")}
                                >
                                    <i className="fas fa-book me-2"></i>
                                    View All Courses
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </>
        );
    }

    return (
        <>
            
            <div className="main-content">
                <Sidebar />
                
                <div className="content container mt-4">
                    <div className="card shadow-sm">
                        <div className="card-header bg-primary text-white d-flex justify-content-between align-items-center">
                            <div>
                                <h5 className="mb-0">
                                    <i className="fas fa-book me-2"></i>
                                    {courseName ? `Lessons for: ${courseName}` : 'Loading...'}
                                </h5>
                                {courseId && (
                                    <small>Course ID: {courseId}</small>
                                )}
                            </div>
                            {validCourseId && (
                                <Link 
                                    to={`/create-lesson/${courseId}`} 
                                    className="btn btn-light btn-sm"
                                >
                                    <i className="fas fa-plus me-1"></i> Add New Lesson
                                </Link>
                            )}
                        </div>
                        
                        <div className="card-body">
                            {loading ? (
                                <div className="text-center py-4">
                                    <div className="spinner-border text-primary" role="status">
                                        <span className="visually-hidden">Loading...</span>
                                    </div>
                                    <p className="mt-2">Loading lessons...</p>
                                </div>
                            ) : error ? (
                                <div className="alert alert-danger">
                                    <i className="fas fa-exclamation-triangle me-2"></i>
                                    {error}
                                    <div className="mt-2">
                                        <button 
                                            className="btn btn-sm btn-outline-primary me-2"
                                            onClick={() => fetchLessons(parseInt(courseId))}
                                        >
                                            <i className="fas fa-redo me-1"></i> Retry
                                        </button>
                                        <button 
                                            className="btn btn-sm btn-outline-secondary"
                                            onClick={() => navigate(-1)}
                                        >
                                            <i className="fas fa-arrow-left me-1"></i> Go Back
                                        </button>
                                    </div>
                                </div>
                            ) : lessons.length === 0 ? (
                                <div className="text-center py-5">
                                    <i className="fas fa-book-open fa-3x text-muted mb-3"></i>
                                    <h5>No Lessons Found</h5>
                                    <p className="text-muted">This course doesn't have any lessons yet.</p>
                                    {validCourseId && (
                                        <Link 
                                            to={`/create-lesson/${courseId}`} 
                                            className="btn btn-primary"
                                        >
                                            <i className="fas fa-plus me-2"></i> Create First Lesson
                                        </Link>
                                    )}
                                </div>
                            ) : (
                                <div className="table-responsive">
                                    <table className="table table-hover">
                                        <thead className="table-light">
                                            <tr>
                                                <th width="5%">#</th>
                                                <th width="25%">Lesson Name</th>
                                                <th width="40%">Content</th>
                                                <th width="15%">Resources</th>
                                                <th width="15%">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {lessons.map((lesson, index) => (
                                                <tr key={lesson.lessonId || index}>
                                                    <td>{index + 1}</td>
                                                    <td>
                                                        <strong>{lesson.lessonName}</strong>
                                                        <br />
                                                        <small className="text-muted">
                                                            ID: {lesson.lessonId}
                                                        </small>
                                                    </td>
                                                    <td>
                                                        <div className="lesson-content-preview">
                                                            {lesson.lessonContent && lesson.lessonContent.length > 100 
                                                                ? `${lesson.lessonContent.substring(0, 100)}...`
                                                                : lesson.lessonContent || "No content"}
                                                        </div>
                                                    </td>
                                                    <td>
                                                        <div className="d-flex flex-wrap gap-1">
                                                            {lesson.pdfPath && (
                                                                <span className="badge bg-danger">
                                                                    <i className="fas fa-file-pdf me-1"></i> PDF
                                                                </span>
                                                            )}
                                                            {lesson.videoPath && (
                                                                <span className="badge bg-primary">
                                                                    <i className="fas fa-video me-1"></i> Video
                                                                </span>
                                                            )}
                                                            {!lesson.pdfPath && !lesson.videoPath && (
                                                                <span className="badge bg-secondary">No files</span>
                                                            )}
                                                        </div>
                                                    </td>
                                                    <td>
                                                        <div className="btn-group btn-group-sm">
                                                            {lesson.pdfPath && (
                                                                <button 
                                                                    className="btn btn-outline-danger"
                                                                    onClick={() => viewPDF(lesson.pdfPath)}
                                                                    title="View PDF"
                                                                >
                                                                    <i className="fas fa-file-pdf"></i>
                                                                </button>
                                                            )}
                                                            {lesson.videoPath && (
                                                                <button 
                                                                    className="btn btn-outline-primary"
                                                                    onClick={() => viewVideo(lesson.videoPath)}
                                                                    title="View Video"
                                                                >
                                                                    <i className="fas fa-video"></i>
                                                                </button>
                                                            )}
                                                            <button 
                                                                className="btn btn-outline-info"
                                                                title="View Details"
                                                                onClick={() => alert(`Lesson ID: ${lesson.lessonId}\nName: ${lesson.lessonName}\nContent: ${lesson.lessonContent}`)}
                                                            >
                                                                <i className="fas fa-eye"></i>
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                        
                        <div className="card-footer">
                            <div className="d-flex justify-content-between align-items-center">
                                <div>
                                    <span className="text-muted">
                                        Total Lessons: <strong>{lessons.length}</strong>
                                    </span>
                                </div>
                                <div>
                                    <button 
                                        onClick={() => navigate("/teacher")} 
                                        className="btn btn-outline-secondary btn-sm me-2"
                                    >
                                        <i className="fas fa-arrow-left me-1"></i> Back to Dashboard
                                    </button>
                                    <button 
                                        onClick={() => navigate(`/course/${courseId}`)} 
                                        className="btn btn-outline-primary btn-sm"
                                    >
                                        <i className="fas fa-book me-1"></i> View Course
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    {/* Debug Section (remove in production) */}
                    <div className="mt-4">
                        <details>
                            <summary className="text-muted small">Debug Information</summary>
                            <div className="bg-light p-3 small mt-2" style={{ maxHeight: '200px', overflow: 'auto' }}>
                                <p><strong>Course ID from params:</strong> {courseId} (Type: {typeof courseId})</p>
                                <p><strong>Valid Course ID:</strong> {validCourseId.toString()}</p>
                                <p><strong>Loading:</strong> {loading.toString()}</p>
                                <p><strong>Error:</strong> {error || 'None'}</p>
                                <p><strong>Number of lessons:</strong> {lessons.length}</p>
                                <pre>{JSON.stringify(lessons.slice(0, 2), null, 2)}</pre>
                            </div>
                        </details>
                    </div>
                </div>
            </div>
            
        </>
    );
}

export default ViewLessons;