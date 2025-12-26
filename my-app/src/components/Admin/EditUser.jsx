import Swal from "sweetalert2";
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Header from "../Header";
import Sidebar from "./Sidebar";
import Footer from "../Footer";

function EditUser() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [user, setUser] = useState({
    firstname: "",
    lastname: "",
    email: ""
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch(`http://localhost:8080/users/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch user");
        return res.json();
      })
      .then((data) => {
        setUser(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching user:", err);
        setError("Could not load user. Please try again.");
        setLoading(false);
      });
  }, [id]);

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    fetch(`http://localhost:8080/users/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(user),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to update user");

        // 🎉 SweetAlert Success Popup
        Swal.fire({
          title: "Success!",
          text: "User updated successfully!",
          icon: "success",
          confirmButtonColor: "#3085d6",
        }).then(() => {
          navigate("/viewUser"); // redirect after confirmation
        });
      })
      .catch((err) => {
        console.error("Error updating user:", err);

        // ❌ SweetAlert Error Popup
        Swal.fire({
          title: "Error!",
          text: "Failed to update user.",
          icon: "error",
          confirmButtonColor: "#d33",
        });
      });
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <>
      <Header />
      <div className="main-content">
        <Sidebar />

        <div className="content">
          <h3>Edit User</h3>
          <hr />

          <form onSubmit={handleSubmit}>
            <table className="table table-bordered">
              <tbody>
                <tr>
                  <td>Firstname:</td>
                  <td>
                    <input
                      type="text"
                      name="firstname"
                      value={user.firstname}
                      onChange={handleChange}
                      required
                    />
                  </td>
                </tr>

                <tr>
                  <td>Lastname:</td>
                  <td>
                    <input
                      type="text"
                      name="lastname"
                      value={user.lastname}
                      onChange={handleChange}
                      required
                    />
                  </td>
                </tr>

                <tr>
                  <td>Email:</td>
                  <td>
                    <input
                      type="email"
                      name="email"
                      value={user.email}
                      onChange={handleChange}
                      required
                    />
                  </td>
                </tr>
              </tbody>
            </table>

            <button type="submit" className="btn btn-primary">
              Update
            </button>
          </form>
        </div>
      </div>

      <Footer />
    </>
  );
}

export default EditUser;
 