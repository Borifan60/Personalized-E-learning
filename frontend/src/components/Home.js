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
          backgroundColor: "#f8fafc",
          fontFamily: "'Segoe UI', 'Inter', -apple-system, sans-serif"
        }}
      >
        {/* MAIN CONTENT */}
        <div style={{ flex: 1 }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "80px 60px",
              gap: "60px",
              minHeight: "80vh",
              flexWrap: "wrap",
              maxWidth: "1400px",
              margin: "0 auto"
            }}
          >
            {/* LEFT SECTION */}
            <div style={{ flex: 1, minWidth: "350px" }}>
              <div style={{ marginBottom: "15px" }}>
                <span style={{
                  backgroundColor: "#dbeafe",
                  color: "#1d4ed8",
                  padding: "8px 20px",
                  borderRadius: "20px",
                  fontSize: "14px",
                  fontWeight: "600",
                  display: "inline-block",
                  marginBottom: "20px"
                }}>
                  🚀 Transform Your Learning
                </span>
              </div>

              <h1
                style={{
                  fontSize: "48px",
                  color: "#1e293b",
                  fontWeight: "800",
                  marginBottom: "25px",
                  lineHeight: "1.2",
                  background: "linear-gradient(90deg, #1e40af 0%, #3b82f6 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text"
                }}
              >
                Welcome to the E-Learning System
              </h1>

              <p
                style={{
                  fontSize: "19px",
                  lineHeight: "1.8",
                  marginBottom: "40px",
                  color: "#475569",
                  maxWidth: "600px",
                  fontWeight: "400"
                }}
              >
                Enhance your knowledge with our interactive and flexible online
                learning platform. Access well-structured courses, learn at your
                own pace, and gain the skills you need to succeed. Join thousands
                of learners and begin your educational journey today.
              </p>

              <div style={{ display: "flex", gap: "20px", flexWrap: "wrap" }}>
                <button
                  style={{
                    padding: "16px 36px",
                    background: "linear-gradient(90deg, #3b82f6 0%, #1d4ed8 100%)",
                    color: "#ffffff",
                    fontWeight: "600",
                    border: "none",
                    borderRadius: "10px",
                    cursor: "pointer",
                    fontSize: "17px",
                    transition: "all 0.3s ease",
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    boxShadow: "0 4px 15px rgba(59, 130, 246, 0.3)"
                  }}
                  onMouseOver={(e) => {
                    e.target.style.transform = "translateY(-3px)";
                    e.target.style.boxShadow = "0 6px 20px rgba(59, 130, 246, 0.4)";
                  }}
                  onMouseOut={(e) => {
                    e.target.style.transform = "translateY(0)";
                    e.target.style.boxShadow = "0 4px 15px rgba(59, 130, 246, 0.3)";
                  }}
                  onClick={() => (window.location.href = "/login")}
                >
                  Get Started →
                </button>

                <button
                  style={{
                    padding: "16px 36px",
                    backgroundColor: "transparent",
                    color: "#3b82f6",
                    fontWeight: "600",
                    border: "2px solid #3b82f6",
                    borderRadius: "10px",
                    cursor: "pointer",
                    fontSize: "17px",
                    transition: "all 0.3s ease",
                    display: "flex",
                    alignItems: "center",
                    gap: "10px"
                  }}
                  onMouseOver={(e) => {
                    e.target.style.backgroundColor = "#eff6ff";
                    e.target.style.transform = "translateY(-2px)";
                  }}
                  onMouseOut={(e) => {
                    e.target.style.backgroundColor = "transparent";
                    e.target.style.transform = "translateY(0)";
                  }}
                  onClick={() => (window.location.href = "/about")}
                >
                  <span>ℹ️</span> Learn More
                </button>
              </div>

              {/* Stats Section */}
              <div style={{
                display: "flex",
                gap: "40px",
                marginTop: "60px",
                flexWrap: "wrap"
              }}>
                <div>
                  <div style={{
                    fontSize: "32px",
                    fontWeight: "700",
                    color: "#1e40af",
                    marginBottom: "5px"
                  }}>5000+</div>
                  <div style={{
                    fontSize: "14px",
                    color: "#64748b",
                    fontWeight: "500"
                  }}>Active Learners</div>
                </div>
                <div>
                  <div style={{
                    fontSize: "32px",
                    fontWeight: "700",
                    color: "#1e40af",
                    marginBottom: "5px"
                  }}>200+</div>
                  <div style={{
                    fontSize: "14px",
                    color: "#64748b",
                    fontWeight: "500"
                  }}>Expert Instructors</div>
                </div>
                <div>
                  <div style={{
                    fontSize: "32px",
                    fontWeight: "700",
                    color: "#1e40af",
                    marginBottom: "5px"
                  }}>100+</div>
                  <div style={{
                    fontSize: "14px",
                    color: "#64748b",
                    fontWeight: "500"
                  }}>Courses Available</div>
                </div>
              </div>
            </div>

            {/* RIGHT SECTION */}
            <div style={{ 
              flex: 1, 
              textAlign: "center", 
              minWidth: "350px",
              position: "relative" 
            }}>
              <div style={{
                position: "absolute",
                top: "-20px",
                right: "-20px",
                width: "120px",
                height: "120px",
                backgroundColor: "#dbeafe",
                borderRadius: "50%",
                zIndex: "0",
                opacity: "0.7"
              }} />
              <div style={{
                position: "absolute",
                bottom: "40px",
                left: "-30px",
                width: "100px",
                height: "100px",
                backgroundColor: "#fef3c7",
                borderRadius: "50%",
                zIndex: "0",
                opacity: "0.7"
              }} />
              
              <img
                src={elearningImg}
                alt="E-Learning System"
                style={{
                  width: "100%",
                  maxWidth: "580px",
                  borderRadius: "16px",
                  boxShadow: "0 20px 40px rgba(0, 0, 0, 0.1)",
                  position: "relative",
                  zIndex: "1",
                  border: "8px solid white"
                }}
              />
              
              {/* Floating badge */}
              <div style={{
                position: "absolute",
                bottom: "30px",
                right: "30px",
                backgroundColor: "#10b981",
                color: "white",
                padding: "12px 20px",
                borderRadius: "12px",
                fontSize: "14px",
                fontWeight: "600",
                display: "flex",
                alignItems: "center",
                gap: "8px",
                boxShadow: "0 8px 20px rgba(16, 185, 129, 0.3)",
                zIndex: "2"
              }}>
                <span>⭐</span>
                <span>Rated 4.8/5 by Learners</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Home;