import React, { useEffect, useState } from "react";

function ViewUserById({ id }) {
  const [user, setUser] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!id) return;
    fetch(`http://localhost:8080/users/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch user");
        return res.json();
      })
      .then((data) => setUser(data))
      .catch(() => setError("Could not load user"));
  }, [id]);

  if (error) return <p style={{ color: "red" }}>{error}</p>;
  if (!user) return <p>Loading user...</p>;

  return (
    <div>
      <p><strong>ID:</strong> {user.userId}</p>
      <p><strong>First Name:</strong> {user.firstname}</p>
      <p><strong>Last Name:</strong> {user.lastname}</p>
      <p><strong>Email:</strong> {user.email}</p>
    </div>
  );
}

export default ViewUserById;
