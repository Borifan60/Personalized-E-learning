function Footer() {
  return (
    <div style={{
      textAlign: 'center',
      padding: '28px',
      color: '#718096',
      fontSize: '15px',
      backgroundColor: '#f8f9fa',
      borderTop: '1px solid #e2e8f0',
      marginTop: 'auto',
      fontFamily: "'Segoe UI', 'Inter', -apple-system, sans-serif"
    }}>
      © {new Date().getFullYear()} AASTU. All rights reserved.
    </div>
  );
}

export default Footer;