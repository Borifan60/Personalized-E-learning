import Swal from "sweetalert2";
import React, { useState } from "react";
import axios from "axios";
import Sidebar from "./Sidebar";
function CreateCourse() {

    const [courseName, setCourseName] = useState("");

    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            const response = await axios.post(
                "http://localhost:8080/courses",   // ⭐ Your course API endpoint
                { courseName },                   // ⭐ Send courseName only
                { headers: { "Content-Type": "application/json" } }
            );

            Swal.fire({
                title: "Success!",
                text: "Course created successfully!",
                icon: "success",
                confirmButtonColor: "#3085d6",
            });

            setCourseName(""); // Clear input

        } catch (error) {
            Swal.fire({
                title: "Error!",
                text: "Failed to create course. Try again.",
                icon: "error",
                confirmButtonColor: "#d33",
            });
        }
    };

    return (
       <>
       <div className="main-content">
        <Sidebar />
        <div className="content">
       <form onSubmit={handleSubmit} className="p-3">

                        <h4>Create Course</h4>
                        <hr />

                        <div className="mb-3">
                            <label className="form-label">Course Name:</label>
                            <input
                                className="form-control"
                                type="text"
                                value={courseName}
                                onChange={(e) => setCourseName(e.target.value)}
                                required
                            />
                        </div>

                        <button type="submit" className="btn btn-primary">
                            Add Course
                        </button>

                        &nbsp;&nbsp;

                        <button
                            type="button"
                            className="btn btn-danger"
                            onClick={() => setCourseName("")}
                        >
                            Reset
                        </button>
                    </form>
                    </div>
                    </div>
       </>

                    

        
    );
}

export default CreateCourse;
