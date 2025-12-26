import React from "react";
import elearningImg from "../images/e-learning.jpg";
import Index from "./Index";

function Home() {
  return (
    <>
      <Index />

      {/* PAGE WRAPPER */}
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* MAIN CONTENT */}
        <div style={{ flex: 1 }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "60px 50px",
              gap: "50px",
              minHeight: "80vh",
              flexWrap: "wrap",
            }}
          >
            {/* LEFT SECTION */}
            <div style={{ flex: 1, minWidth: "300px" }}>
              <h1
                style={{
                  fontSize: "42px",
                  color: "#1e3a8a",
                  fontWeight: "700",
                  marginBottom: "20px",
                }}
              >
                Welcome to the E-Learning System
              </h1>

              <p
                style={{
                  fontSize: "18px",
                  lineHeight: "1.7",
                  marginBottom: "35px",
                  color: "#444",
                  maxWidth: "550px",
                }}
              >
                Enhance your knowledge with our interactive and flexible online
                learning platform. Access well-structured courses, learn at your
                own pace, and gain the skills you need to succeed. Join thousands
                of learners and begin your educational journey today.
              </p>

              <button
                style={{
                  padding: "14px 30px",
                  backgroundColor: "#1e3a8a",
                  color: "#ffffff",
                  fontWeight: "600",
                  border: "none",
                  borderRadius: "8px",
                  cursor: "pointer",
                  fontSize: "17px",
                  transition: "0.3s",
                }}
                onMouseOver={(e) =>
                  (e.target.style.backgroundColor = "#163273")
                }
                onMouseOut={(e) =>
                  (e.target.style.backgroundColor = "#1e3a8a")
                }
                onClick={() => (window.location.href = "/login")}
              >
                Get Started →
              </button>
            </div>

            {/* RIGHT SECTION */}
            <div style={{ flex: 1, textAlign: "center", minWidth: "300px" }}>
              <img
                src={elearningImg}
                alt="E-Learning System"
                style={{
                  width: "100%",
                  maxWidth: "520px",
                  borderRadius: "12px",
                  boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Home;
