import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from "react-router-dom";

import Header from "./components/Header";
import Footer from "./components/Footer";

// Public pages
import Home from "./components/Home";
import About from "./components/About";
import Contact from "./components/Contact";
import Services from "./components/Services";
import Login from "./components/Login";

// Admin
import AdminDashboard from "./components/Admin/AdminDashboard";
import ViewUser from "./components/Admin/ViewUser";
import ViewUserById from "./components/Admin/ViewUserById";
import EditUser from "./components/Admin/EditUser";
import DeleteUser from "./components/Admin/DeleteUser";
import Signup from "./components/Admin/Signup";

// Student
import StudentDashboard from "./components/Student/StudentDashboard";
import StudentCourseList from "./components/Student/StudentCourseList";
import StudentCourses from "./components/Student/StudentCourses";
import MyCourses from "./components/Student/MyCourses";
import StudentLesson from "./components/Student/StudentLesson";
import StudentCoursePage from "./components/Student/StudentCoursePage";

// Teacher
import TeacherDashboard from "./components/Teacher/TeacherDashboard";
import CreateCourse from "./components/Teacher/CreateCourse";
import ViewCourse from "./components/Teacher/ViewCourse";
import ViewCourseById from "./components/Teacher/ViewCourseById";
import EditCourse from "./components/Teacher/EditCourse";
import CreateLesson from "./components/Teacher/CreateLesson";
import ViewLesson from "./components/Teacher/ViewLesson";

// Common
import Logout from "./components/Logout";
import ChangeProfile from "./components/ChangeProfile";


// 🌟 PUBLIC layout → footer only
const PublicLayout = ({ children }) => (
  <>
    {children}
    <Footer />
  </>
);

// 🌟 PRIVATE layout → header + footer
const PrivateLayout = ({ children }) => (
  <>
    <Header />
    <div className="main-content">
      <div className="content">{children}</div>
    </div>
    <Footer />
  </>
);

// 🔥 Layout decision logic
const LayoutHandler = ({ children }) => {
  const { pathname } = useLocation();

  const publicPages = ["/", "/about", "/contact", "/login", "/services"];

  if (publicPages.includes(pathname)) {
    return <PublicLayout>{children}</PublicLayout>;
  }

  return <PrivateLayout>{children}</PrivateLayout>;
};


function App() {
  return (
    <Router>
      <LayoutHandler>
        <Routes>

          {/* 🌐 PUBLIC */}
          <Route path="/" element={<Home />} />
          <Route path="/home" element={<Navigate to="/" replace />} />
          <Route path="/about" element={<About />} />
          <Route path="/services" element={<Services />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/login" element={<Login />} />

          {/* 🛡 ADMIN */}
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/viewUser" element={<ViewUser />} />
          <Route path="/user/:id" element={<ViewUserById />} />
          <Route path="/editUser/:id" element={<EditUser />} />
          <Route path="/deleteUser/:id" element={<DeleteUser />} />
          <Route path="/signup" element={<Signup />} />

          {/* 🎓 STUDENT */}
          <Route path="/student" element={<StudentDashboard />} />
          <Route path="/student/course-list" element={<StudentCourseList />} />
          <Route path="/student/courses" element={<StudentCourses />} />
          <Route path="/student/my-courses" element={<MyCourses />} />
          <Route path="/student/lessons/:courseId" element={<StudentLesson />} />
          <Route path="/student/course/:courseId" element={<StudentCoursePage />} />

          {/* 👨‍🏫 TEACHER */}
          <Route path="/teacher" element={<TeacherDashboard />} />
          <Route path="/create-course" element={<CreateCourse />} />
          <Route path="/view-course" element={<ViewCourse />} />
          <Route path="/course/:id" element={<ViewCourseById />} />
          <Route path="/editCourse/:id" element={<EditCourse />} />
          <Route path="/create-lesson/:id" element={<CreateLesson />} />
          <Route path="/course/:courseId/lessons" element={<ViewLesson />} />
          <Route path="/view-lesson/:id" element={<ViewLesson />} />

          {/* 🔁 COMMON */}
          <Route path="/logout" element={<Logout />} />
          <Route path="/change-profile" element={<ChangeProfile />} />

          {/* 🚫 FALLBACK */}
          <Route path="*" element={<Navigate to="/" />} />

        </Routes>
      </LayoutHandler>
    </Router>
  );
}

export default App;
