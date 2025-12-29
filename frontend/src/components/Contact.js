import Index from "./Index";

function Contact() {
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
            Contact Us
          </h1>

          <p
            style={{
              fontSize: "18px",
              color: "#444",
              maxWidth: "600px",
              lineHeight: "1.6",
            }}
          >
            Have questions or need support?  
            We’d love to hear from you.  
            Reach out to us anytime and our team will respond as soon as possible.
          </p>
        </div>
      </div>
    </>
  );
}

export default Contact;
