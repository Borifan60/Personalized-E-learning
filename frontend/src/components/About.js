import Index from "./Index";

function About() {
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
        <div
          style={{
            flex: 1,
            padding: "60px 40px",
          }}
        >
          <h1
            style={{
              fontSize: "32px",
              color: "#1e3a8a",
              fontWeight: "700",
              marginBottom: "20px",
            }}
          >
            About Us
          </h1>

          <p
            style={{
              fontSize: "18px",
              color: "#444",
              maxWidth: "700px",
              lineHeight: "1.7",
            }}
          >
            Dalell E-Learning Platform is designed to provide accessible, flexible,
            and high-quality online education. Our mission is to empower learners
            with practical skills through well-structured courses created by
            experienced instructors.
          </p>

          <p
            style={{
              fontSize: "18px",
              color: "#444",
              maxWidth: "700px",
              lineHeight: "1.7",
              marginTop: "15px",
            }}
          >
            Whether you are a student, teacher, or professional, our platform
            supports your learning journey anytime and anywhere.
          </p>
        </div>
      </div>
    </>
  );
}

export default About;
