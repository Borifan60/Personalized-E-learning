import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

function DeleteUser() {
  const { id } = useParams();   // get userId from URL
  const navigate = useNavigate();
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (id) {
      fetch(`http://localhost:8080/users/${id}`, {
        method: "DELETE",
      })
        .then((res) => {
          if (res.ok) {
            setMessage("User deleted successfully!");
            setTimeout(() => navigate("/viewUser"), 1000); // redirect after delete
          } else {
            throw new Error("Failed to delete user");
          }
        })
        .catch((err) => {
          console.error("Error deleting user:", err);
        });
    }
  }, [id, navigate]);

  return (
    <div className="container mt-4">
      <h2>Delete User</h2>
      <p>{message || "Deleting user..."}</p>
    </div>
  );
}

export default DeleteUser;
