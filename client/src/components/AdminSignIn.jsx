import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import LogoImg from "../utils/Images/MyoLogo.jpg";

import styled from "styled-components";
import TextInput from "./TextInput";
import Button from "./Button";
import { AdminUserSignIn,AdmingoogleAuthSignUp} from "../api/AdminApi.js";
import { useDispatch } from "react-redux";
import { loginSuccess } from "../redux/reducers/userSlice";
import { Link } from "react-router-dom";
import {useGoogleLogin} from "@react-oauth/google";
import { store } from "../redux/store.js";




const Container = styled.div`
  width: 100%;
  max-width: 500px;
  display: flex;
  flex-direction: column;
  gap: 36px;
`;
const Title = styled.div`
  font-size: 20px;
  font-weight: 800;
  color: ${({ theme }) => theme.text_primary};
`;
const Span = styled.div`
  font-size: 16px;
  font-weight: 400;
  color: ${({ theme }) => theme.text_secondary + 90};
`;

const SignIn = () => {
  const navigate = useNavigate();

  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [sumit, setSumit] = useState(false);
  const [buttonDisabled, setButtonDisabled] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [secret, setSecret] = useState("");
  const [modalSecret, setModalSecret] = useState("");
  const [authRes, setAuthRes] = useState("");
  const [showSecretKeyInput, setShowSecretKeyInput] = useState(false);

  const validateInputs = () => {
    if (!email || !password || !secret) {
      // alert("Please fill in all fields");
      window.Toastify({ text: "⚠️ Please fill in all fields", duration: 4000, gravity: "top", position: "center", style: { background: "rgba(255, 193, 7, 0.2)", backdropFilter: "blur(8px)", WebkitBackdropFilter: "blur(8px)", color: "#fff", fontWeight: "500", fontSize: "16px", padding: "14px 28px", borderRadius: "12px", boxShadow: "0 8px 20px rgba(0,0,0,0.2)", border: "1px solid rgba(255,255,255,0.2)", textAlign: "center" }, close: true, stopOnFocus: true }).showToast();

      return false;
    }
    return true;
  };

  

  const handelSignIn = async () => {
    setLoading(true);
    setButtonDisabled(true);
    console.log("Admin Email in frontend:", email);  // Log email
    console.log("Admin Password:", password);  // Log password
    if (validateInputs()) {
      await AdminUserSignIn({ email, password, secret })
        .then((res) => {
          // **Step 1:** Save the token to localStorage
          console.log("Login response for admin in frontend:", res.data);
          localStorage.setItem("token", res.data.token); // Saves the token as 'token' in localStorage

          // **Step 2:** Dispatch user data (optional, to update redux state)
          dispatch(loginSuccess(res.data));

          // Optional success message
          // alert("Admin Login Success");
          window.Toastify({ text: "✅ Admin Login Success", duration: 4000, gravity: "top", position: "center", style: { background: "rgba(40, 167, 69, 0.2)", backdropFilter: "blur(8px)", WebkitBackdropFilter: "blur(8px)", color: "#fff", fontWeight: "500", fontSize: "16px", padding: "14px 28px", borderRadius: "12px", boxShadow: "0 8px 20px rgba(0,0,0,0.2)", border: "1px solid rgba(255,255,255,0.2)", textAlign: "center" }, close: true, stopOnFocus: true }).showToast();

          // Wrap navigate in setTimeout
          setTimeout(() => {
            navigate("/AdminPage");
          }, 1000); // Delay of 0ms (or adjust as needed)
        })
        .catch((err) => {
          if (err.response.status === 404) {
            // If user is not found, navigate to Admin SignUp page
            // alert("Admin user not found. Redirecting to sign-up...");
            window.Toastify({ text: "❌ Admin user not found. Redirecting to sign-up...", duration: 4000, gravity: "top", position: "center", style: { background: "rgba(220, 53, 69, 0.2)", backdropFilter: "blur(8px)", WebkitBackdropFilter: "blur(8px)", color: "#fff", fontWeight: "500", fontSize: "16px", padding: "14px 28px", borderRadius: "12px", boxShadow: "0 8px 20px rgba(0,0,0,0.2)", border: "1px solid rgba(255,255,255,0.2)", textAlign: "center" }, close: true, stopOnFocus: true }).showToast();

            navigate("/", { state: { showAdminSignUp: true, key: new Date().getTime() } }); // Pass key to force re-render // Pass state to indicate AdminSignUp
          } else if(err.response.status === 403){
            // alert("Invalid admin secret");
            window.Toastify({ text: "🔒 Invalid admin secret", duration: 4000, gravity: "top", position: "center", style: { background: "rgba(220, 53, 69, 0.2)", backdropFilter: "blur(8px)", WebkitBackdropFilter: "blur(8px)", color: "#fff", fontWeight: "500", fontSize: "16px", padding: "14px 28px", borderRadius: "12px", boxShadow: "0 8px 20px rgba(0,0,0,0.2)", border: "1px solid rgba(255,255,255,0.2)", textAlign: "center" }, close: true, stopOnFocus: true }).showToast();

            navigate("/", { state: { showAdminSignUp: true, key: new Date().getTime() } }); // Pass key to force re-render
          }else if(err.response.status === 422){
            // alert("You must be an admin to log in");
            window.Toastify({ text: "❌ You must be an admin to log in", duration: 4000, gravity: "top", position: "center", style: { background: "rgba(220, 53, 69, 0.2)", backdropFilter: "blur(8px)", WebkitBackdropFilter: "blur(8px)", color: "#fff", fontWeight: "500", fontSize: "16px", padding: "14px 28px", borderRadius: "12px", boxShadow: "0 8px 20px rgba(0,0,0,0.2)", border: "1px solid rgba(255,255,255,0.2)", textAlign: "center" }, close: true, stopOnFocus: true }).showToast();

            navigate("/", { state: { showUserSignUp: true, key: new Date().getTime() } }); // Pass key to force re-render
          }else if(err.response.status === 401){
            // alert("Invalid email or password of admin");
            window.Toastify({ text: "❌ Invalid email or password of admin", duration: 4000, gravity: "top", position: "center", style: { background: "rgba(220, 53, 69, 0.2)", backdropFilter: "blur(8px)", WebkitBackdropFilter: "blur(8px)", color: "#fff", fontWeight: "500", fontSize: "16px", padding: "14px 28px", borderRadius: "12px", boxShadow: "0 8px 20px rgba(0,0,0,0.2)", border: "1px solid rgba(255,255,255,0.2)", textAlign: "center" }, close: true, stopOnFocus: true }).showToast();

            navigate("/", { state: { showAdminSignUp: true, key: new Date().getTime() } }); // Pass key to force re-render
          }else{
            alert(err.response.data.message); // Error handling
          }
          setLoading(false);
          setButtonDisabled(false);
        });
      }
      setLoading(false);
      setButtonDisabled(false);
};


  const responseGoogle = async ({ code, secret }) => {
    console.log("code in responseGoogle ",code);
    console.log("secret in responseGoogle ",secret);
    try {
      if (!code || !secret) {
        // alert("Missing code or secret");
        window.Toastify({ text: "⚠️ Missing code or secret", duration: 4000, gravity: "top", position: "center", style: { background: "rgba(255, 193, 7, 0.2)", backdropFilter: "blur(8px)", WebkitBackdropFilter: "blur(8px)", color: "#fff", fontWeight: "500", fontSize: "16px", padding: "14px 28px", borderRadius: "12px", boxShadow: "0 8px 20px rgba(0,0,0,0.2)", border: "1px solid rgba(255,255,255,0.2)", textAlign: "center" }, close: true, stopOnFocus: true }).showToast();

        return;
      }
  
      setSumit(true);
      setButtonDisabled(true);
  
      const res = await AdmingoogleAuthSignUp({ code, secret });
  
     
      window.Toastify({ text: "✅ Admin SignIn Success", duration: 4000, gravity: "top", position: "center", style: { background: "rgba(40, 167, 69, 0.2)", backdropFilter: "blur(8px)", WebkitBackdropFilter: "blur(8px)", color: "#fff", fontWeight: "500", fontSize: "16px", padding: "14px 28px", borderRadius: "12px", boxShadow: "0 8px 20px rgba(0,0,0,0.2)", border: "1px solid rgba(255,255,255,0.2)", textAlign: "center" }, close: true, stopOnFocus: true }).showToast();

      localStorage.setItem("token", res.data.token);
      dispatch(loginSuccess(res.data));
      navigate('/AdminPage'); // Redirect only after success
  
    } catch (error) {
      console.error('Error during Google Auth:', error);
  
      if (error.response) {
        const status = error.response.status;
        const errorMessage = error.response.data?.message || "Unknown server error";
  
        alert(`${status === 400 ? "Bad Request" : status === 403 ? "Forbidden" : status === 500 ? "Server Error" : "Unexpected Error"}: ${errorMessage}`);
      } else {
        // alert("Network error. Please check your internet connection.");
        window.Toastify({ text: "🌐 Network error. Please check your internet connection.", duration: 4000, gravity: "top", position: "center", style: { background: "rgba(220, 53, 69, 0.2)", backdropFilter: "blur(8px)", WebkitBackdropFilter: "blur(8px)", color: "#fff", fontWeight: "500", fontSize: "16px", padding: "14px 28px", borderRadius: "12px", boxShadow: "0 8px 20px rgba(0,0,0,0.2)", border: "1px solid rgba(255,255,255,0.2)", textAlign: "center" }, close: true, stopOnFocus: true }).showToast();

      }
  
      navigate("/", { state: { showAdminSignUp: true, key: new Date().getTime() } });
  
    } finally {
      setSumit(false);
      setButtonDisabled(false);
    }
  };
  

const handleSecretKeySubmit = async () => {
  // if (!secret) {
  //   alert("Please enter the secret");
  //   return; // ⬅️ Prevent code execution instead of reload
  // }

  // setShowSecretKeyInput(false);
  // console.log("code in handlesecretkeysubmit ",authRes['code']);
  // await responseGoogle({ code: authRes['code'], secret });
  if (!modalSecret) {
    // alert("Please enter the secret");
    window.Toastify({ text: "⚠️ Please enter the secret", duration: 4000, gravity: "top", position: "center", style: { background: "rgba(255, 193, 7, 0.2)", backdropFilter: "blur(8px)", WebkitBackdropFilter: "blur(8px)", color: "#fff", fontWeight: "500", fontSize: "16px", padding: "14px 28px", borderRadius: "12px", boxShadow: "0 8px 20px rgba(0,0,0,0.2)", border: "1px solid rgba(255,255,255,0.2)", textAlign: "center" }, close: true, stopOnFocus: true }).showToast();

    return;
  }

  setShowSecretKeyInput(false);
  console.log("code in handlesecretkeysubmit ", authRes['code']);
  await responseGoogle({ code: authRes['code'], secret: modalSecret });
};
  
 const takesecretthenresponseGoogle = (authResult) => {
    setAuthRes(authResult);
    setShowSecretKeyInput(true);  // Show the input field
  };

  // Google login setup
  const googleLogin = useGoogleLogin({
    onSuccess: takesecretthenresponseGoogle,
    onError: takesecretthenresponseGoogle,
    flow: 'auth-code',
  });


  const modalOverlayStyle = {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100vw",
    height: "100vh",
    backgroundColor: "rgba(0,0,0,0.5)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1000,
  };
  
  const modalStyle = {
    backgroundColor: "white",
    padding: "2rem",
    borderRadius: "8px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "1rem",
  };
  
  const inputStyle = {
    padding: "0.5rem",
    width: "100%",
    fontSize: "1rem",
  };
  
  const buttonStyle = {
    padding: "0.5rem 1rem",
    fontSize: "1rem",
    cursor: "pointer",
  };




  
  const TitleContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 20px;
  margin-bottom: 20px;
`;

const Title = styled.h1`
  font-size: 36px;
  font-weight: 700;
  color: ${({ theme }) => theme.primary};
`;

const Logo = styled.img`
  height: 40px; /* Adjust logo size */
  margin-left: 10px;
`;

const Span = styled.p`
  font-size: 18px;
  font-weight: 400;
  color: ${({ theme }) => theme.text_primary};
  margin-bottom: 40px;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
`;

const SubTitle = styled.h2`
  font-size: 24px;
  font-weight: 600;
  color: ${({ theme }) => theme.secondary};
  margin-bottom: 30px;
`;


  return (
    <Container>
      <div>
      {/* <Title>Welcome Admin</Title> */}
      <TitleContainer>
  <Title>Welcome Admin</Title>
  <Logo src={LogoImg} alt="MyoDx Logo" />
</TitleContainer>
<SubTitle>
  MyoDx Admin Panel: Streamlining Oversight and Advancing Diagnostic Intelligence
</SubTitle>


      </div>
      <div
        style={{
          display: "flex",
          gap: "20px",
          flexDirection: "column",
        }}
      >
        <TextInput
          label="Email Address"
          placeholder="Enter your email address"
          value={email}
          handelChange={(e) => setEmail(e.target.value)}
        />

        <TextInput
          label="Password"
          placeholder="Enter your password"
          password
          value={password}
          handelChange={(e) => setPassword(e.target.value)}
        />

        <TextInput
          label="Enter the secret Key"
          placeholder="Enter the secret Key"
          secret
          value={secret}
          handelChange={(e) => setSecret(e.target.value)}
        />
        <Link
          to="/forgot-password"
          style={{
            fontSize: "14px",
            color: "#007bff",
            textDecoration: "none",
            transition: "color 0.2s",
            
          }}
          onMouseEnter={(e) => (e.target.style.color = "#0056b3")}
          onMouseLeave={(e) => (e.target.style.color = "#007bff")}
        >
          Forgot Password?
        </Link>


        <Button
  text="AdminSignIn"
  onClick={handelSignIn}
  isLoading={loading}  // Properly passing to custom Button
  isDisabled={buttonDisabled}
/>
<Button
  text="Continue With Google as Admin"
  isLoading={sumit}  // Properly passing to custom Button
  onClick={googleLogin}
  isDisabled={buttonDisabled}
/>
{showSecretKeyInput && (
          <div style={modalOverlayStyle}>
            <div style={modalStyle}>
              <input
                type="password"
                value={modalSecret}
                onChange={(e) => setModalSecret(e.target.value)}
                placeholder="Enter Secret Key"
                style={inputStyle}
              />
              <button onClick={handleSecretKeySubmit} style={buttonStyle}>
                Submit
              </button>
            </div>
          </div>
        )}
        
       
      </div>
    </Container>
  );
};

export default SignIn;
