import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import axios from "axios";

import "bootstrap/dist/css/bootstrap.min.css";

import Sidebar from "./Sidebar";

function EditCourse() {
    const { id } = useParams();        // Get courseId from URL
    const navigate = useNavigate();    // Redirect after update
    const [courseName, setCourseName] = useState("");

    // Fetch course by ID
    useEffect(() => {
        axios
            .get(`http://localhost:8080/courses/${id}`)
            .then((res) => {
                setCourseName(res.data.courseName);
            })
            .catch((err) => {
                console.error(err);
                Swal.fire("Error!", "Unable to fetch course details.", "error");
            });
    }, [id]);

    // Handle Update
    const handleUpdate = async (event) => {
        event.preventDefault();

        try {
            await axios.put(
                `http://localhost:8080/courses/${id}`,
                { courseName },
                { headers: { "Content-Type": "application/json" } }
            );

            Swal.fire({
                title: "Updated!",
                text: "Course updated successfully!",
                icon: "success",
                confirmButtonColor: "#3085d6",
            });

            navigate("/view-course"); // redirect to course list

        } catch (error) {
            Swal.fire("Error!", "Update failed.", "error");
        }
    };

    return (
        <>
        <div className="main-content">
            <Sidebar />
        <div className="container mt-4">
            <h2>Edit Course</h2>
            <form onSubmit={handleUpdate} className="p-3 border rounded">

                <div className="mb-3">
                    <label className="form-label">Course Name</label>
                    <input
                        type="text"
                        className="form-control"
                        value={courseName}
                        onChange={(e) => setCourseName(e.target.value)}
                        required
                    />
                </div>

                <button type="submit" className="btn btn-primary">
                    Update 
                </button>

            </form>
        </div>
        </div>
        </>
    );
}

export default EditCourse;
