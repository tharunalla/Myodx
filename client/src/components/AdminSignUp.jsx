import React, { useState } from "react";
import styled from "styled-components";
import TextInput from "./TextInput";
import LogoImg from "../utils/Images/MyoLogo.jpg";
import Button from "./Button";
import { AdminUserSignUp } from "../api/AdminApi.js";
import { useDispatch } from "react-redux";
import { loginSuccess } from "../redux/reducers/userSlice";
import { store } from "../redux/store.js";
import { useNavigate } from "react-router-dom";
import { AdmingoogleAuthSignUp} from "../api/AdminApi.js";
import {useGoogleLogin} from "@react-oauth/google";


const Container = styled.div`
  width: 100%;
  max-width: 500px;
  display: flex;
  flex-direction: column;
  gap: 36px;
`;
const Title = styled.div`
  font-size: 30px;
  font-weight: 800;
  color: ${({ theme }) => theme.text_primary};
`;
const Span = styled.div`
  font-size: 16px;
  font-weight: 400;
  color: ${({ theme }) => theme.text_secondary + 90};
`;

const SignUp = () => {

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [sumit, setSumit] = useState(false);
  const [buttonDisabled, setButtonDisabled] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [authRes, setAuthRes] = useState("");
  const [secret, setSecret] = useState("");
  const [modalSecret, setModalSecret] = useState("");
  const [showSecretKeyInput, setShowSecretKeyInput] = useState(false);

  const validateInputs = () => {
    if (!name || !email || !password || !secret) {
      // alert("Please fill in all fields");
      window.Toastify({ text: "⚠️ Please fill in all fields", duration: 4000, gravity: "top", position: "center", style: { background: "rgba(255, 193, 7, 0.2)", backdropFilter: "blur(8px)", WebkitBackdropFilter: "blur(8px)", color: "#fff", fontWeight: "500", fontSize: "16px", padding: "14px 28px", borderRadius: "12px", boxShadow: "0 8px 20px rgba(0,0,0,0.2)", border: "1px solid rgba(255,255,255,0.2)", textAlign: "center" }, close: true, stopOnFocus: true }).showToast();

      return false;
    }
    return true;
  };

  const handelSignUp = async () => {
    setLoading(true);
    setButtonDisabled(true);
    if (validateInputs()) {
      await AdminUserSignUp({ name, email, password, secret })
        .then((res) => {
          localStorage.setItem("token", res.data.token);
          dispatch(loginSuccess(res.data)); // Assuming you have this action to handle login
          setLoading(false);
          setButtonDisabled(false);
          window.Toastify({ text: "✅ Admin SignUp Success", duration: 4000, gravity: "top", position: "center", style: { background: "rgba(40, 167, 69, 0.2)", backdropFilter: "blur(8px)", WebkitBackdropFilter: "blur(8px)", color: "#fff", fontWeight: "500", fontSize: "16px", padding: "14px 28px", borderRadius: "12px", boxShadow: "0 8px 20px rgba(0,0,0,0.2)", border: "1px solid rgba(255,255,255,0.2)", textAlign: "center" }, close: true, stopOnFocus: true }).showToast();
          navigate('/AdminPage');
        })
        .catch((err) => {
          if (err.response.status === 409) {
            // Email already in use, redirect to Authentication page with admin sign-in
            window.Toastify({ text: "📧 Email already in use. Redirecting to sign-in...", duration: 4000, gravity: "top", position: "center", style: { background: "rgba(255, 87, 34, 0.2)", backdropFilter: "blur(8px)", WebkitBackdropFilter: "blur(8px)", color: "#fff", fontWeight: "500", fontSize: "16px", padding: "14px 28px", borderRadius: "12px", boxShadow: "0 8px 20px rgba(0,0,0,0.2)", border: "1px solid rgba(255,255,255,0.2)", textAlign: "center" }, close: true, stopOnFocus: true }).showToast();

            navigate("/", { state: { showAdminSignIn: true, key: new Date().getTime() } });// Pass state to show admin sign-in inside Authentication page
          }else if(err.response.status === 403){
            window.Toastify({ text: "🔒 Invalid admin secret", duration: 4000, gravity: "top", position: "center", style: { background: "rgba(220, 53, 69, 0.2)", backdropFilter: "blur(8px)", WebkitBackdropFilter: "blur(8px)", color: "#fff", fontWeight: "500", fontSize: "16px", padding: "14px 28px", borderRadius: "12px", boxShadow: "0 8px 20px rgba(0,0,0,0.2)", border: "1px solid rgba(255,255,255,0.2)", textAlign: "center" }, close: true, stopOnFocus: true }).showToast();

            navigate("/", { state: { showAdminSignUp: true, key: new Date().getTime() } }); // Pass key to force re-render
          } else {
            alert(err.response.data.message);
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
        window.Toastify({ text: "❗ Missing code or secret", duration: 4000, gravity: "top", position: "center", style: { background: "rgba(220, 53, 69, 0.2)", backdropFilter: "blur(8px)", WebkitBackdropFilter: "blur(8px)", color: "#fff", fontWeight: "500", fontSize: "16px", padding: "14px 28px", borderRadius: "12px", boxShadow: "0 8px 20px rgba(0,0,0,0.2)", border: "1px solid rgba(255,255,255,0.2)", textAlign: "center" }, close: true, stopOnFocus: true }).showToast();

        return;
      }
  
      setSumit(true);
      setButtonDisabled(true);
  
      const res = await AdmingoogleAuthSignUp({ code, secret });
      window.Toastify({ text: "✅ Admin SignUp Success", duration: 4000, gravity: "top", position: "center", style: { background: "rgba(40, 167, 69, 0.2)", backdropFilter: "blur(8px)", WebkitBackdropFilter: "blur(8px)", color: "#fff", fontWeight: "500", fontSize: "16px", padding: "14px 28px", borderRadius: "12px", boxShadow: "0 8px 20px rgba(0,0,0,0.2)", border: "1px solid rgba(255,255,255,0.2)", textAlign: "center" }, close: true, stopOnFocus: true }).showToast();

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


  // Show the secret key input after Google login

  return (
    <Container>
      <div>
      {/* <Title>Create Your Account Mr.Admin</Title> */}
      <TitleContainer>
  <Title>Admin Signup</Title>
  <Logo src={LogoImg} alt="MyoDx Logo" />
</TitleContainer>
<SubTitle>
Create a secure admin account to manage users and oversee diagnostics. </SubTitle>


      </div>
      <div
        style={{
          display: "flex",
          gap: "20px",
          flexDirection: "column",
        }}
      >
        <TextInput
          label="Full name"
          placeholder="Enter your full name"
          value={name}
          handelChange={(e) => setName(e.target.value)}
        />
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
          placeholder="Secret Key"
          secret
          value={secret}
          handelChange={(e) => setSecret(e.target.value)}
        />
        <Button
          text="AdminSignUp"
          onClick={handelSignUp}
          isLoading={loading}
          isDisabled={buttonDisabled}
        />
        <Button
          text="Continue With Google As Admin"
          onClick={googleLogin}
          isLoading={sumit}
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

export default SignUp;










