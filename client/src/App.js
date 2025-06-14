import { ThemeProvider, styled } from "styled-components";
import { lightTheme } from "./utils/Themes";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Authentication from "./pages/Authentication";
import { useSelector } from "react-redux";
import Navbar from "./components/Navbar";
import AdminNavbar from "./components/AdminNavbar";
import Dashboard from "./pages/Dashboard";
import Reports from "./pages/Reports";
import Diagnosis from "./pages/Diagnosis";
import Educational from "./pages/Education";
import Portfolio from "./pages/Contact";
import FastQA from "./pages/FastQA";
import AdminPage from "./Adminpages/AdminPage";
import DiagnosisPage from "./Adminpages/DiagnosisPage";
import UserPage from "./Adminpages/UserPage";
import SearchPage from "./Adminpages/SearchPage";
import FeedbackPage from "./Adminpages/FeedbackPage";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import { GoogleOAuthProvider } from "@react-oauth/google";
import 'bootstrap/dist/css/bootstrap.min.css';


const Container = styled.div`
  width: 100%;
  height: 100vh;
  display: flex;
  flex-direction: column;
  background: ${({ theme }) => theme.bg};
  color: ${({ theme }) => theme.text_primary};
  overflow-x: hidden;
  overflow-y: hidden;
  transition: all 0.2s ease;
`;











function App() {
  const { currentUser } = useSelector((state) => state.user);
  console.log("current user", currentUser);
  console.log("client_id from react", process.env.REACT_APP_CLIENT_ID);

  return (
    <GoogleOAuthProvider clientId={"55073970723-fvigpirk1bge0ia6k7aagq1o03cht8o7.apps.googleusercontent.com"}>
      <ThemeProvider theme={lightTheme}>
        <BrowserRouter>
          <Routes>
            {/* Public Routes */}
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password/:token" element={<ResetPassword />} />
            {/* <Route
              path="*"
              element={
                <Container>
                  {!currentUser ? <Authentication /> : <ProtectedRoutes currentUser={currentUser} />}
                </Container>
              }
            /> */}
            
            {currentUser ? (
              <Route path="/*" element={<Container><ProtectedRoutes currentUser={currentUser} /> </Container>} />
            ) : (
              <Route path="/*" element={<Container><Authentication /></Container>} />
            )}
            
          </Routes>
        </BrowserRouter>
      </ThemeProvider>
    </GoogleOAuthProvider>
  );
}




const ProtectedRoutes = ({ currentUser }) => {
  const role = currentUser.user?.role;
  console.log("Role check:", role); 
  

  return (
    <>
      {/* Conditional Navbar Rendering based on User Role */}
      {role === "user" ? (
        <Navbar currentUser={currentUser} />
      ) : (
        <AdminNavbar currentUser={currentUser} />
      )}

      <Routes>
        {/* Conditional Routing based on User Role */}
        {role === "user" ? (
          <>
            <Route path="/" element={<Dashboard />} />
            <Route path="/Diagnosis" element={<Diagnosis />} />
            <Route path="/Reports" element={<Reports />} />
            <Route path="/Educational" element={<Educational />} />
            <Route path="/contact" element={<Portfolio />} />
            <Route path="/fastQA" element={<FastQA />} />
            
          </>
        ) : (
          <>
          
          <Route path="/AdminPage" element={<AdminPage />} />
          <Route path="/Adminusers" element={<UserPage />} />
          <Route path="/Adminfeedback" element={<FeedbackPage />} />
          <Route path="/Admindiagnosis" element={<DiagnosisPage />} />
          <Route path="/Adminsearch" element={<SearchPage />} />
          </>
        )}
      </Routes>
    </>
  );
};


export default App;
