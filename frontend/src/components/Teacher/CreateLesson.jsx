import Header from "../Header";
import Footer from "../Footer";
import Sidebar from "./Sidebar";
import Swal from "sweetalert2";
import React, { useState, useRef, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

function CreateLesson() {
    // IMPORTANT: The route parameter is named "id", not "courseId"
    const { id } = useParams(); // Changed from courseId to id
    const navigate = useNavigate();
    
    const [formData, setFormData] = useState({
        lessonName: "",
        lessonContent: "",
    });
    
    const [files, setFiles] = useState({
        pdf: null,
        video: null
    });
    
    const [uploadProgress, setUploadProgress] = useState({
        overall: 0
    });
    
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const [courseName, setCourseName] = useState("");
    const [isValidCourseId, setIsValidCourseId] = useState(false);
    const fileInputRef = useRef({ pdf: null, video: null });

    // Validate courseId (id) on mount and when it changes
    useEffect(() => {
        validateCourseId();
    }, [id]); // Changed from courseId to id

    const validateCourseId = () => {
        // Now using id instead of courseId
        if (!id) {
            console.error("Course ID is undefined from useParams()");
            Swal.fire({
                title: "Error!",
                text: "Course ID is missing. Please select a course first.",
                icon: "error",
            }).then(() => {
                navigate("/teacher");
            });
            setIsValidCourseId(false);
            return;
        }

        const numericId = parseInt(id);
        if (isNaN(numericId) || numericId <= 0) {
            console.error(`Invalid Course ID: ${id}`);
            Swal.fire({
                title: "Invalid Course ID!",
                text: "The course ID is invalid. Please select a valid course.",
                icon: "error",
            }).then(() => {
                navigate("/teacher");
            });
            setIsValidCourseId(false);
            return;
        }

        setIsValidCourseId(true);
        fetchCourseDetails(numericId);
    };

    const fetchCourseDetails = async (courseId) => {
        try {
            const response = await axios.get(`http://localhost:8080/courses/${courseId}`);
            setCourseName(response.data.courseName || `Course #${courseId}`);
        } catch (error) {
            console.error("Failed to fetch course details:", error);
            
            if (error.response?.status === 404) {
                Swal.fire({
                    title: "Course Not Found!",
                    text: "The course does not exist or you don't have access.",
                    icon: "error",
                }).then(() => {
                    navigate("/teacher");
                });
            } else {
                setCourseName(`Course #${courseId}`);
            }
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        
        // Clear error for this field
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: "" }));
        }
    };

    const handleFileChange = (e, fileType) => {
        const file = e.target.files[0];
        if (!file) return;

        // Validate file size (10MB for PDF, 100MB for video)
        const maxSize = fileType === 'pdf' ? 10 * 1024 * 1024 : 100 * 1024 * 1024;
        if (file.size > maxSize) {
            Swal.fire({
                title: "File Too Large!",
                text: `Maximum size for ${fileType.toUpperCase()} is ${fileType === 'pdf' ? '10MB' : '100MB'}`,
                icon: "warning",
            });
            e.target.value = "";
            return;
        }

        // Validate file types
        if (fileType === 'pdf' && !file.type.includes('pdf')) {
            Swal.fire({
                title: "Invalid File Type!",
                text: "Please upload a PDF file",
                icon: "warning",
            });
            e.target.value = "";
            return;
        }

        if (fileType === 'video' && !file.type.includes('video')) {
            Swal.fire({
                title: "Invalid File Type!",
                text: "Please upload a video file",
                icon: "warning",
            });
            e.target.value = "";
            return;
        }

        setFiles(prev => ({
            ...prev,
            [fileType]: file
        }));

        // Clear file error
        if (errors[fileType]) {
            setErrors(prev => ({ ...prev, [fileType]: "" }));
        }
    };

    const validateForm = () => {
        const newErrors = {};
        
        if (!formData.lessonName.trim()) {
            newErrors.lessonName = "Lesson name is required";
        } else if (formData.lessonName.length > 200) {
            newErrors.lessonName = "Lesson name must be less than 200 characters";
        }
        
        if (!formData.lessonContent.trim()) {
            newErrors.lessonContent = "Lesson content is required";
        }
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        
        if (!isValidCourseId) {
            Swal.fire({
                title: "Invalid Course!",
                text: "Please select a valid course first.",
                icon: "error",
            });
            return;
        }
        
        if (!validateForm()) {
            Swal.fire({
                title: "Validation Error!",
                text: "Please fix the errors in the form",
                icon: "error",
            });
            return;
        }

        setLoading(true);
        
        const formDataToSend = new FormData();
        formDataToSend.append("lessonName", formData.lessonName.trim());
        formDataToSend.append("lessonContent", formData.lessonContent.trim());
        
        if (files.pdf) {
            formDataToSend.append("pdf", files.pdf);
        }
        
        if (files.video) {
            formDataToSend.append("video", files.video);
        }

        try {
            const numericCourseId = parseInt(id); // Changed from courseId to id
            
            const response = await axios.post(
                `http://localhost:8080/lessons/create/${numericCourseId}`,
                formDataToSend,
                {
                    headers: { 
                        "Content-Type": "multipart/form-data" 
                    },
                    onUploadProgress: (progressEvent) => {
                        const progress = Math.round(
                            (progressEvent.loaded * 100) / progressEvent.total
                        );
                        setUploadProgress(prev => ({
                            ...prev,
                            overall: progress
                        }));
                    }
                }
            );

            Swal.fire({
                title: "Success!",
                text: response.data.message || "Lesson created successfully!",
                icon: "success",
                showCancelButton: true,
                confirmButtonText: "Create Another Lesson",
                cancelButtonText: "View Course",
                showDenyButton: true,
                denyButtonText: "Go to Dashboard",
            }).then((result) => {
                if (result.isConfirmed) {
                    // Reset form for another lesson
                    resetForm();
                } else if (result.isDenied) {
                    navigate("/teacher");
                } else if (result.dismiss === Swal.DismissReason.cancel) {
                    navigate(`/course/${numericCourseId}`);
                }
            });

        } catch (error) {
            console.error("Error creating lesson:", error);
            
            let errorMessage = "Failed to create lesson";
            if (error.response) {
                if (error.response.status === 400 && error.response.data?.includes("Method parameter 'courseId'")) {
                    errorMessage = "Invalid course ID format. Please try again or contact support.";
                } else {
                    errorMessage = error.response.data.error || error.response.data.message || errorMessage;
                }
            } else if (error.request) {
                errorMessage = "No response from server. Please check your connection.";
            }

            Swal.fire({
                title: "Error!",
                text: errorMessage,
                icon: "error",
                confirmButtonText: "OK",
            });
        } finally {
            setLoading(false);
            setUploadProgress({ overall: 0 });
        }
    };

    const resetForm = () => {
        setFormData({
            lessonName: "",
            lessonContent: "",
        });
        setFiles({
            pdf: null,
            video: null
        });
        setErrors({});
        
        // Reset file inputs
        if (fileInputRef.current.pdf) fileInputRef.current.pdf.value = "";
        if (fileInputRef.current.video) fileInputRef.current.video.value = "";
    };

    const removeFile = (fileType) => {
        setFiles(prev => ({
            ...prev,
            [fileType]: null
        }));
        
        if (fileInputRef.current[fileType]) {
            fileInputRef.current[fileType].value = "";
        }
    };

    // Show loading state while validating courseId
    if (!isValidCourseId && id) { // Changed from courseId to id
        return (
            <>
                <Header />
                <div className="main-content">
                    <Sidebar />
                    <div className="content container mt-4 d-flex justify-content-center align-items-center" style={{ minHeight: "60vh" }}>
                        <div className="text-center">
                            <div className="spinner-border text-primary" role="status">
                                <span className="visually-hidden">Loading...</span>
                            </div>
                            <p className="mt-3">Validating course information...</p>
                        </div>
                    </div>
                </div>
                <Footer />
            </>
        );
    }

    // If no valid courseId, show error
    if (!id || !isValidCourseId) { // Changed from courseId to id
        return (
            <>
                <Header />
                <div className="main-content">
                    <Sidebar />
                    <div className="content container mt-4">
                        <div className="alert alert-danger">
                            <h5 className="alert-heading">
                                <i className="fas fa-exclamation-triangle me-2"></i>
                                Invalid Course Selection
                            </h5>
                            <p>Please select a valid course to create a lesson.</p>
                            <button 
                                className="btn btn-outline-primary"
                                onClick={() => navigate("/teacher")}
                            >
                                <i className="fas fa-arrow-left me-2"></i>
                                Back to Dashboard
                            </button>
                        </div>
                    </div>
                </div>
                <Footer />
            </>
        );
    }

    return (
        <>

            <div className="main-content">
                <Sidebar />

                <div className="content container mt-4">
                    <div className="card shadow-sm">
                        <div className="card-header bg-primary text-white">
                            <h5 className="mb-0">
                                <i className="fas fa-book me-2"></i>
                                Create New Lesson for: {courseName}
                            </h5>
                            <small className="opacity-75">Course ID: {id}</small> {/* Changed from courseId to id */}
                        </div>
                        
                        <div className="card-body">
                            {uploadProgress.overall > 0 && uploadProgress.overall < 100 && (
                                <div className="alert alert-info">
                                    <div className="d-flex justify-content-between align-items-center">
                                        <span>Uploading... {uploadProgress.overall}%</span>
                                        <div className="spinner-border spinner-border-sm" role="status">
                                            <span className="visually-hidden">Loading...</span>
                                        </div>
                                    </div>
                                    <div className="progress mt-2">
                                        <div 
                                            className="progress-bar progress-bar-striped progress-bar-animated" 
                                            role="progressbar" 
                                            style={{ width: `${uploadProgress.overall}%` }}
                                        >
                                            {uploadProgress.overall}%
                                        </div>
                                    </div>
                                </div>
                            )}

                            <form onSubmit={handleSubmit}>
                                {/* Lesson Name */}
                                <div className="mb-4">
                                    <label className="form-label fw-bold">
                                        Lesson Name <span className="text-danger">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        name="lessonName"
                                        className={`form-control ${errors.lessonName ? 'is-invalid' : ''}`}
                                        value={formData.lessonName}
                                        onChange={handleInputChange}
                                        placeholder="Enter lesson name"
                                        maxLength="200"
                                        disabled={loading}
                                    />
                                    {errors.lessonName && (
                                        <div className="invalid-feedback">{errors.lessonName}</div>
                                    )}
                                    <div className="form-text">
                                        Maximum 200 characters
                                    </div>
                                </div>

                                {/* Lesson Content */}
                                <div className="mb-4">
                                    <label className="form-label fw-bold">
                                        Lesson Content <span className="text-danger">*</span>
                                    </label>
                                    <textarea
                                        name="lessonContent"
                                        rows="6"
                                        className={`form-control ${errors.lessonContent ? 'is-invalid' : ''}`}
                                        value={formData.lessonContent}
                                        onChange={handleInputChange}
                                        placeholder="Write detailed lesson content here..."
                                        disabled={loading}
                                    />
                                    {errors.lessonContent && (
                                        <div className="invalid-feedback">{errors.lessonContent}</div>
                                    )}
                                    <div className="form-text">
                                        You can use Markdown formatting
                                    </div>
                                </div>

                                {/* PDF Upload */}
                                <div className="mb-4">
                                    <label className="form-label fw-bold">
                                        <i className="fas fa-file-pdf me-2 text-danger"></i>
                                        PDF Document (Optional)
                                    </label>
                                    <input
                                        ref={el => fileInputRef.current.pdf = el}
                                        type="file"
                                        accept=".pdf,application/pdf"
                                        className={`form-control ${errors.pdf ? 'is-invalid' : ''}`}
                                        onChange={(e) => handleFileChange(e, 'pdf')}
                                        disabled={loading}
                                    />
                                    {files.pdf && (
                                        <div className="alert alert-success mt-2 p-2">
                                            <div className="d-flex justify-content-between align-items-center">
                                                <span>
                                                    <i className="fas fa-check-circle text-success me-2"></i>
                                                    {files.pdf.name} ({(files.pdf.size / 1024 / 1024).toFixed(2)} MB)
                                                </span>
                                                <button
                                                    type="button"
                                                    className="btn btn-sm btn-outline-danger"
                                                    onClick={() => removeFile('pdf')}
                                                    disabled={loading}
                                                >
                                                    <i className="fas fa-times"></i>
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                    <div className="form-text">
                                        Maximum file size: 10MB. Supported format: PDF
                                    </div>
                                </div>

                                {/* Video Upload */}
                                <div className="mb-4">
                                    <label className="form-label fw-bold">
                                        <i className="fas fa-video me-2 text-primary"></i>
                                        Video Lesson (Optional)
                                    </label>
                                    <input
                                        ref={el => fileInputRef.current.video = el}
                                        type="file"
                                        accept="video/*"
                                        className={`form-control ${errors.video ? 'is-invalid' : ''}`}
                                        onChange={(e) => handleFileChange(e, 'video')}
                                        disabled={loading}
                                    />
                                    {files.video && (
                                        <div className="alert alert-success mt-2 p-2">
                                            <div className="d-flex justify-content-between align-items-center">
                                                <span>
                                                    <i className="fas fa-check-circle text-success me-2"></i>
                                                    {files.video.name} ({(files.video.size / 1024 / 1024).toFixed(2)} MB)
                                                </span>
                                                <button
                                                    type="button"
                                                    className="btn btn-sm btn-outline-danger"
                                                    onClick={() => removeFile('video')}
                                                    disabled={loading}
                                                >
                                                    <i className="fas fa-times"></i>
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                    <div className="form-text">
                                        Maximum file size: 100MB. Supported formats: MP4, AVI, MOV, etc.
                                    </div>
                                </div>

                                {/* Action Buttons */}
                                <div className="d-flex gap-2 mt-4">
                                    <button 
                                        type="submit" 
                                        className="btn btn-primary px-4"
                                        disabled={loading}
                                    >
                                        {loading ? (
                                            <>
                                                <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                                                Creating...
                                            </>
                                        ) : (
                                            <>
                                                <i className="fas fa-plus me-2"></i>
                                                Create Lesson
                                            </>
                                        )}
                                    </button>

                                    <button
                                        type="button"
                                        className="btn btn-outline-secondary px-4"
                                        onClick={resetForm}
                                        disabled={loading}
                                    >
                                        <i className="fas fa-redo me-2"></i>
                                        Reset Form
                                    </button>

                                    <button
                                        type="button"
                                        className="btn btn-outline-danger px-4 ms-auto"
                                        onClick={() => navigate(-1)}
                                        disabled={loading}
                                    >
                                        <i className="fas fa-times me-2"></i>
                                        Cancel
                                    </button>
                                </div>
                            </form>
                        </div>
                        
                        <div className="card-footer text-muted">
                            <small>
                                <i className="fas fa-info-circle me-1"></i>
                                Fields marked with <span className="text-danger">*</span> are required.
                                All uploaded content will be available to enrolled students.
                            </small>
                        </div>
                    </div>
                </div>
            </div>

        </>
    );
}

export default CreateLesson;