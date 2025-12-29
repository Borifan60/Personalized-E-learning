import Swal from "sweetalert2";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import ViewUserById from "./ViewUserById";
import "bootstrap/dist/css/bootstrap.min.css";
import Sidebar from "./Sidebar";


function ViewUser() {
  const [users, setUsers] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState(null);

  // ✅ Fetch users
  useEffect(() => {
    fetch("http://localhost:8080/users")
      .then((res) => res.json())
      .then((data) => setUsers(data))
      .catch((err) => console.error(err));
  }, []);

  // ✅ SweetAlert Delete Function (MUST be outside useEffect)
  const handleDelete = (userId) => {
    Swal.fire({
      title: "Are you sure?",
      text: "This user will be permanently deleted!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Delete",
    }).then((result) => {
      if (result.isConfirmed) {
        fetch(`http://localhost:8080/users/${userId}`, {
          method: "DELETE",
        })
          .then((res) => {
            if (!res.ok) throw new Error("Error deleting user");

            // Remove deleted user from state
            setUsers(users.filter((u) => u.userId !== userId));

            Swal.fire("Deleted!", "User has been deleted.", "success");
          })
          .catch((err) => {
            Swal.fire("Error!", "Could not delete user.", "error");
            console.error(err);
          });
      }
    });
  };

  return (

    <>
    <div className="main-content">

            <Sidebar />
            <div className="content">
      <div className="container mt-4">
      <h2>Registered Users</h2>
      <table className="table table-bordered table-striped mt-3">
        <thead className="table-dark">
          <tr>
            <th>User ID</th>
            <th>First Name</th>
            <th>Last Name</th>
            <th>Email</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {users.length > 0 ? (
            users.map((user) => (
              <tr key={user.userId}>
                <td>{user.userId}</td>
                <td>{user.firstname}</td>
                <td>{user.lastname}</td>
                <td>{user.email}</td>

                <td>
                  {/* View in Modal */}
                  <button
                    className="btn btn-sm btn-info me-1"
                    data-bs-toggle="modal"
                    data-bs-target="#viewUserModal"
                    onClick={() => setSelectedUserId(user.userId)}
                  >
                    <i className="fas fa-eye"></i> View
                  </button>

                  {/* Edit */}
                  <Link
                    to={`/editUser/${user.userId}`}
                    className="btn btn-sm btn-warning me-1"
                  >
                    <i className="fas fa-edit"></i> Edit
                  </Link>

                  {/* Delete with SweetAlert */}
                  <button
                    className="btn btn-sm btn-danger"
                    onClick={() => handleDelete(user.userId)}
                  >
                    <i className="fas fa-trash"></i> Delete
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5" className="text-center">
                No users found.
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Modal */}
      <div
        className="modal fade"
        id="viewUserModal"
        tabIndex="-1"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">User Details</h5>
              <button
                className="btn-close"
                data-bs-dismiss="modal"
              ></button>
            </div>

            <div className="modal-body">
              {selectedUserId && <ViewUserById id={selectedUserId} />}
            </div>
          </div>
        </div>
      </div>
    </div>
    </div>
    </div>
    </>
       
  );
}

export default ViewUser;
