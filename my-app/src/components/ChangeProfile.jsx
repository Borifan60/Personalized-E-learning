import Header from "./Header";
import Sidebar from "./Admin/Sidebar";
import Footer from "./Footer";

import React, { useState } from "react";
export default function ChangeProfile() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Profile updated successfully!");
  };

  return (
    <>
    <Header />
                <div className="main-content">
    
                <Sidebar />
                <div className="content">
                    <div style={styles.container}>
      <h2 style={styles.title}>Change Profile</h2>

      <form onSubmit={handleSubmit} style={styles.form}>
        <label style={styles.label}>Username</label>
        <input
          type="text"
          style={styles.input}
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Enter new username"
        />

        <label style={styles.label}>Email</label>
        <input
          type="email"
          style={styles.input}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter new email"
        />

        <button type="submit" style={styles.button}>
          Save Changes
        </button>
      </form>
    </div>
                </div>
                </div>
<Footer />  
    
    </>
  );
}

const styles = {
  container: {
    padding: "30px",
    maxWidth: "400px",
    margin: "auto",
    background: "#ffffff",
    borderRadius: "10px",
    boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
  },
  title: {
    textAlign: "center",
    marginBottom: "20px",
    color: "#333",
  },
  form: {
    display: "flex",
    flexDirection: "column",
  },
  label: {
    marginBottom: "5px",
    marginTop: "15px",
    color: "#444",
  },
  input: {
    padding: "10px",
    borderRadius: "6px",
    border: "1px solid #ccc",
  },
  button: {
    marginTop: "20px",
    padding: "10px",
    background: "#007bff",
    color: "white",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
  },
};
