import React, { useState } from "react";
import styled from "styled-components";
import TextInput from "./TextInput";
import Button from "./Button";

import LogoImg from "../utils/Images/MyoLogo.jpg";
import { UserSignUp,CheckPresentorNots } from "../api";
import { useDispatch } from "react-redux";
import { loginSuccess } from "../redux/reducers/userSlice";
import { store } from "../redux/store.js";
import { useNavigate } from "react-router-dom";
import { UserSignIn ,googleAuthSignUp} from "../api";
import {useGoogleLogin} from "@react-oauth/google";
import { useSelector } from "react-redux";


const Container = styled.div`
  width: 100%;
  max-width: 500px;
  display: flex;
  flex-direction: column;
  gap: 36px;
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
  

  const validateInputs = () => {
    if (!name || !email || !password) {
      // alert("Please fill in all fields");
      window.Toastify({ text: "⚠️ Please fill in all fields", duration: 4000, gravity: "top", position: "center", style: { background: "rgba(255, 193, 7, 0.2)", backdropFilter: "blur(8px)", WebkitBackdropFilter: "blur(8px)", color: "#fff", fontWeight: "500", fontSize: "16px", padding: "14px 28px", borderRadius: "12px", boxShadow: "0 8px 20px rgba(0,0,0,0.2)", border: "1px solid rgba(255,255,255,0.2)", textAlign: "center" }, close: true, stopOnFocus: true }).showToast();

      return false;
    }
    return true;
  };

  const handelSignUp = async () => {
    setLoading(true);
    setButtonDisabled(true);
    console.log("SignUp request started");
    if (validateInputs()) {
        try {
            const res = await UserSignUp({ name, email, password });
            localStorage.setItem("token", res.data.token);
            console.log("SignUp token set done after this dispatch");
            dispatch(loginSuccess(res.data));
            console.log("going to call checkpresentornot after dispatch done");
            
            const presentornot = await CheckPresentorNots({ userId: res.data.user._id });
            console.log("presentornot" , presentornot);
            setLoading(false);
            setButtonDisabled(false);
            window.Toastify({ text: "✅ SignUp Success", duration: 4000, gravity: "top", position: "center", style: { background: "rgba(40, 167, 69, 0.2)", backdropFilter: "blur(8px)", WebkitBackdropFilter: "blur(8px)", color: "#fff", fontWeight: "500", fontSize: "16px", padding: "14px 28px", borderRadius: "12px", boxShadow: "0 8px 20px rgba(0,0,0,0.2)", border: "1px solid rgba(255,255,255,0.2)", textAlign: "center" }, close: true, stopOnFocus: true }).showToast();
            
            if (presentornot.data.present) {
              navigate('/');
            } else {
              navigate('/Diagnosis');
            }

        } catch (err) {
            setLoading(false);
            setButtonDisabled(false);
            
            if (err.response) {
              if (err.response.status === 409) {
                window.Toastify({ text: "📧 Email is already in use. Please try another email.", duration: 4000, gravity: "top", position: "center", style: { background: "rgba(220, 53, 69, 0.2)", backdropFilter: "blur(8px)", WebkitBackdropFilter: "blur(8px)", color: "#fff", fontWeight: "500", fontSize: "16px", padding: "14px 28px", borderRadius: "12px", boxShadow: "0 8px 20px rgba(0,0,0,0.2)", border: "1px solid rgba(255,255,255,0.2)", textAlign: "center" }, close: true, stopOnFocus: true }).showToast();
                
                } else {
                  // Handle other error responses
                  alert(err.response.data.message || "An error occurred. Please try again later.");
                }
                
                
              } else {
                window.Toastify({ text: "❌ An error occurred. Please check your connection and try again.", duration: 4000, gravity: "top", position: "center", style: { background: "rgba(220, 53, 69, 0.2)", backdropFilter: "blur(8px)", WebkitBackdropFilter: "blur(8px)", color: "#fff", fontWeight: "500", fontSize: "16px", padding: "14px 28px", borderRadius: "12px", boxShadow: "0 8px 20px rgba(0,0,0,0.2)", border: "1px solid rgba(255,255,255,0.2)", textAlign: "center" }, close: true, stopOnFocus: true }).showToast();
                
              }
            }
            
            console.log("SignUp try catch  done");
     }
          setLoading(false);
          setButtonDisabled(false);
};


  const responseGoogle = async (authResult) => {
    try {
      if (authResult['code']) {
        setSumit(true);
        setButtonDisabled(true);
        try {
          // Send the code to the backend for authentication
          const res = await googleAuthSignUp(authResult['code']); // Pass the auth code to backend
          
          // alert("SignUp Success");
          window.Toastify({ text: "✅ SignUp Success", duration: 4000, gravity: "top", position: "center", style: { background: "rgba(40, 167, 69, 0.2)", backdropFilter: "blur(8px)", WebkitBackdropFilter: "blur(8px)", color: "#fff", fontWeight: "500", fontSize: "16px", padding: "14px 28px", borderRadius: "12px", boxShadow: "0 8px 20px rgba(0,0,0,0.2)", border: "1px solid rgba(255,255,255,0.2)", textAlign: "center" }, close: true, stopOnFocus: true }).showToast();

          localStorage.setItem("token", res.data.token);
          // const presentornot = await CheckPresentorNots({ userId: res.data.user._id });
          dispatch(loginSuccess(res.data));
          setSumit(false);
          setButtonDisabled(false);
          
          // Redirect to the home/dashboard page
          // if (presentornot.data.present) {
          //   navigate('/');
          // } else {
          //   navigate('/Diagnosis');
          // }
          navigate('/Diagnosis');  // Or your desired page
        } catch (error) {
          console.error('Error during Google Auth:', error);
          
          // Check if the error is an Axios error with a response
          if (error.response) {
            // Check for status code 409 (email already exists)
            if (error.response.status === 409) {
              // alert("Email is already in use.  Please SignIn...");
              window.Toastify({ text: "📧 Email is already in use. Please SignIn...", duration: 4000, gravity: "top", position: "center", style: { background: "rgba(220, 53, 69, 0.2)", backdropFilter: "blur(8px)", WebkitBackdropFilter: "blur(8px)", color: "#fff", fontWeight: "500", fontSize: "16px", padding: "14px 28px", borderRadius: "12px", boxShadow: "0 8px 20px rgba(0,0,0,0.2)", border: "1px solid rgba(255,255,255,0.2)", textAlign: "center" }, close: true, stopOnFocus: true }).showToast();

              
              // Redirect to login page
              navigate('/login');  // Adjust the path to your login page route
            } else {
              // Handle other known errors
              alert(`Error: ${error.response.data.message || "Something went wrong. Please try again later."}`);
            }
          } else {
            // Handle other errors like network errors or timeout errors
            // alert("Network error. Please check your internet connection and try again.");
            window.Toastify({ text: "🌐 Network error. Please check your internet connection and try again.", duration: 4000, gravity: "top", position: "center", style: { background: "rgba(220, 53, 69, 0.2)", backdropFilter: "blur(8px)", WebkitBackdropFilter: "blur(8px)", color: "#fff", fontWeight: "500", fontSize: "16px", padding: "14px 28px", borderRadius: "12px", boxShadow: "0 8px 20px rgba(0,0,0,0.2)", border: "1px solid rgba(255,255,255,0.2)", textAlign: "center" }, close: true, stopOnFocus: true }).showToast();

          }
          
          setSumit(false);
          setButtonDisabled(false);
        }
      }
    } catch (err) {
      console.error("Unexpected error while using Google login", err);
      // alert("An unexpected error occurred. Please try again later.");
      window.Toastify({ text: "❌ An unexpected error occurred. Please try again later.", duration: 4000, gravity: "top", position: "center", style: { background: "rgba(220, 53, 69, 0.2)", backdropFilter: "blur(8px)", WebkitBackdropFilter: "blur(8px)", color: "#fff", fontWeight: "500", fontSize: "16px", padding: "14px 28px", borderRadius: "12px", boxShadow: "0 8px 20px rgba(0,0,0,0.2)", border: "1px solid rgba(255,255,255,0.2)", textAlign: "center" }, close: true, stopOnFocus: true }).showToast();

    } finally {
      // Reset loading and disabled states
      setSumit(false);
      setButtonDisabled(false);
      
    }
  };
  
  


  const googleLogin = useGoogleLogin({
    onSuccess:responseGoogle,
    onError:responseGoogle,
    flow : 'auth-code'
  });


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
      {/* <Title>Create Your Account 🏥</Title>
<Span>MyDystro: Empowering Lives with AI-Driven Muscular Dystrophy Care</Span> */}
    <TitleContainer>
        <Title>Create Your Account </Title>
        <Logo src={LogoImg} alt="MyoDx Logo" />
      </TitleContainer>
      <SubTitle>
      MyDystro: Empowering Lives with AI-Driven Muscular Dystrophy Care
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
        <Button
          text="SignUp"
          onClick={handelSignUp}
          isLoading={loading}
          isDisabled={buttonDisabled}
        />
        <Button
          text="Continue With Google"
          onClick={googleLogin}
          isLoading={sumit}
          isDisabled={buttonDisabled}
        />
      </div>
    </Container>
  );  
};

export default SignUp;










