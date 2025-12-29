import Footer from "../components/Footer";

const PublicLayout = ({ children }) => {
  return (
    <>
      {children}
      <Footer />
    </>
  );
};

export default PublicLayout;
