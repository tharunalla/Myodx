import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import LogoImg from "../utils/Images/MyoLogo.jpg";
import styled from "styled-components";
import TextInput from "./TextInput";
import Button from "./Button";
import { UserSignIn ,googleAuthSignIn,CheckPresentorNots} from "../api";
import { useDispatch } from "react-redux";
import { loginSuccess } from "../redux/reducers/userSlice";
import { Link } from "react-router-dom";
import {useGoogleLogin} from "@react-oauth/google";
import { store } from "../redux/store.js";
import { toast } from 'react-toastify';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; 




const Toast = styled.div`
  visibility: hidden;
  max-width: 50%;
  margin: auto;
  background-color: #4CAF50; /* default green color */
  color: white;
  text-align: center;
  border-radius: 8px;
  padding: 16px;
  position: fixed;
  z-index: 1000;
  left: 0;
  right: 0;
  bottom: 30px;
  font-size: 17px;
  opacity: 0;
  transition: visibility 0s, opacity 0.5s linear;

  &.show {
    visibility: visible;
    opacity: 1;
  }
`;




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

const TitleContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 20px;
  margin-bottom: 20px;
`;

const SignIn = () => {
  const navigate = useNavigate();

  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [sumit, setSumit] = useState(false);
  const [buttonDisabled, setButtonDisabled] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const validateInputs = () => {
    if (!email || !password) {
      showToast("Please fill in all fields", "error");
      return false;
    }
    return true;
  };

 


  const showToast = (message, type = "success") => {
    toast(message, {
      type: type,
      position: "top-center",
      autoClose: 2000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
  };

  const handelSignIn = async () => {
    setLoading(true);
    setButtonDisabled(true);
    console.log("Email in frontend:", email);  // Log email
    console.log("Password:", password);  // Log password

  if (validateInputs()) {
        try {
            const res = await UserSignIn({ email, password });

            // If response is successful, save token and dispatch user data
            console.log("Login response in frontend:", res.data);
            localStorage.setItem("token", res.data.token); // Save token to localStorage

            // Dispatch user data to Redux state (optional)
            dispatch(loginSuccess(res.data));

            // showToast("Login Successful!", "success");
            window.Toastify({ text: "Login success", duration: 3000, gravity: "top", position: "right", backgroundColor: "green", close: true }).showToast();

            

            setTimeout(async () => {
              try {
                const presentornot = await CheckPresentorNots({ userId: res.data.user._id });
                if (presentornot.data.present) {
                  navigate('/');
                } else {
                  navigate('/Diagnosis');
                }
              } catch (error) {
                console.error("Error checking diagnosis presence", error);
                // Handle error (e.g., navigate to an error page or show a toast)
              }
            }, 1500); // wait 1.5 seconds before navigating
            

            setLoading(false);
            setButtonDisabled(false);
        } catch (err) {
            setLoading(false);
            setButtonDisabled(false);

            if (err.response) {
                if (err.response.status === 404) {
                    
                      // showToast("User not found. Please check your email or sign up.", "error");
                      window.Toastify({
                        text: "❌ User not found. Please check your email or sign up.",
                        duration: 4000,
                        gravity: "top",
                        position: "center",
                        style: {
                          background: "rgba(220, 53, 69, 0.2)", // semi-transparent red
                          backdropFilter: "blur(8px)",
                          WebkitBackdropFilter: "blur(8px)",
                          color: "#fff",
                          fontWeight: "500",
                          fontSize: "16px",
                          padding: "14px 28px",
                          borderRadius: "12px",
                          boxShadow: "0 8px 20px rgba(0, 0, 0, 0.2)",
                          border: "1px solid rgba(255, 255, 255, 0.2)",
                          textAlign: "center"
                        },
                        close: true,
                        stopOnFocus: true,
                      }).showToast();
                      
                } else if (err.response.status === 403) {
                   
                    // showToast("Incorrect password. Please try again.", "error");
                    window.Toastify({
                      text: "🔐 Incorrect password. Please try again.",
                      duration: 4000,
                      gravity: "top",
                      position: "center",
                      style: {
                        background: "rgba(220, 53, 69, 0.2)", // soft translucent red
                        backdropFilter: "blur(8px)",
                        WebkitBackdropFilter: "blur(8px)",
                        color: "#fff",
                        fontWeight: "500",
                        fontSize: "16px",
                        padding: "14px 28px",
                        borderRadius: "12px",
                        boxShadow: "0 8px 20px rgba(0, 0, 0, 0.2)",
                        border: "1px solid rgba(255, 255, 255, 0.2)",
                        textAlign: "center"
                      },
                      close: true,
                      stopOnFocus: true,
                    }).showToast();
                    
                } else {
                   
                    // showToast("An error occurred. Please try again later.", "error");
                    window.Toastify({ text: "⚠️ An error occurred. Please try again later.", duration: 4000, gravity: "top", position: "center", style: { background: "rgba(220, 53, 69, 0.2)", backdropFilter: "blur(8px)", WebkitBackdropFilter: "blur(8px)", color: "#fff", fontWeight: "500", fontSize: "16px", padding: "14px 28px", borderRadius: "12px", boxShadow: "0 8px 20px rgba(0,0,0,0.2)", border: "1px solid rgba(255,255,255,0.2)", textAlign: "center" }, close: true, stopOnFocus: true }).showToast();

                }
                
            } else {
                
                // showToast("An error occurred. Please check your connection and try again.", "error");
                window.Toastify({ text: "⚠️ An error occurred. Please check your connection and try again.", duration: 4000, gravity: "top", position: "center", style: { background: "rgba(220, 53, 69, 0.2)", backdropFilter: "blur(8px)", WebkitBackdropFilter: "blur(8px)", color: "#fff", fontWeight: "500", fontSize: "16px", padding: "14px 28px", borderRadius: "12px", boxShadow: "0 8px 20px rgba(0,0,0,0.2)", border: "1px solid rgba(255,255,255,0.2)", textAlign: "center" }, close: true, stopOnFocus: true }).showToast();

              
            }
            // window.location.reload();
        }
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
          const res = await googleAuthSignIn(authResult['code']); // Pass the auth code to backend
          // console.log('Response from Google Auth:', res);
  
          // Check if the backend says to redirect to signup page
          console.log("redirecttosignup",res.data.redirectToSignup);
          if (res.data.redirectToSignup) {

            window.Toastify({
              text: `<span style="display: flex; align-items: center; justify-content: center; width: 100%;">
                       <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="#ffffff" viewBox="0 0 24 24" style="margin-right: 8px;">
                         <circle cx="12" cy="12" r="10" stroke="#ffffff" stroke-width="2" fill="none" />
                         <line x1="8" y1="8" x2="16" y2="16" stroke="#ffffff" stroke-width="2" />
                         <line x1="16" y1="8" x2="8" y2="16" stroke="#ffffff" stroke-width="2" />
                       </svg>
                       <span style="font-size: 18px; font-weight: 500;">Please sign up first!</span>
                     </span>`,
              duration: 3500,
              gravity: "top",
              position: "center",
              escapeMarkup: false,
              style: {
                background: "#dc3545", // Bootstrap's danger red
                color: "#ffffff",
                fontWeight: "500",
                fontSize: "16px",
                padding: "16px 32px",
                borderRadius: "12px",
                boxShadow: "0 8px 20px rgba(0, 0, 0, 0.2)",
                textAlign: "center",
                minWidth: "280px",
                maxWidth: "420px",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                gap: "10px"
              },
              close: false,
              stopOnFocus: true,
            }).showToast();
            
            setTimeout(async () => {
              try {
                const presentornot = await CheckPresentorNots({ userId: res.data.user._id });
                if (presentornot.data.present) {
                  navigate('/');
                } else {
                  navigate('/Diagnosis');
                }
              } catch (error) {
                console.error("Error checking diagnosis presence", error);
                // Handle error (e.g., navigate to an error page or show a toast)
              }
            }, 1500); // wait 1.5 seconds before navigating
            
          } else {
            // Save the JWT token
            localStorage.setItem('token', res.data.token);
            // console.log('User logged in successfully');
            // console.log("Google login response", res.data);
            dispatch(loginSuccess(res.data));
            console.log("Store user after dispatch:", store.getState().user.currentUser);
           
            window.Toastify({
              text: `<span style="display: flex; align-items: center; justify-content: center; width: 100%;">
                       <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="#ffffff" viewBox="0 0 24 24" style="margin-right: 8px;">
                         <circle cx="12" cy="12" r="10" stroke="#ffffff" stroke-width="2" fill="none" />
                         <path d="M9 12l2 2l4 -4" stroke="#ffffff" stroke-width="2" fill="none" />
                       </svg>
                       <span style="font-size: 18px; font-weight: 500;"> User Login Success</span>
                     </span>`,
              duration: 3500,
              gravity: "top",
              position: "center",
              escapeMarkup: false,
              style: {
                background: "#28a745",
                color: "#ffffff",
                fontWeight: "500",
                fontSize: "16px",
                padding: "16px 32px",
                borderRadius: "12px",
                boxShadow: "0 8px 20px rgba(0, 0, 0, 0.2)",
                textAlign: "center",
                minWidth: "280px",
                maxWidth: "420px",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                gap: "10px"
              },
              close: false,
              stopOnFocus: true,
            }).showToast();
            
            
            
            // Redirect to the home/dashboard page
            setTimeout(() => {
              navigate("/");
            }, 1500); // wait 1.5 seconds before navigating  // Or your desired page
            // window.location.href = "/";

          }
        } catch (error) {
          console.error('Error during Google Auth:', error);
          showToast("An error occurred during Google login. Please try again.", "error");
        }
      }
    } catch (err) {
      console.error("Error while using Google login", err);
      showToast("An unexpected error occurred. Please try again later.", "error");
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
      {/* <Title>Welcome to MyoDx</Title> */}
      
      {/* <Span>
        Log in to unlock AI-powered insights for early muscular dystrophy diagnosis, monitor your muscle health over time, and get personalized reports that help you take proactive control of your well-being. 
      </Span> */}
      <TitleContainer>
    <Title>Welcome to MyoDx</Title>
    <Logo src={LogoImg} alt="MyoDx Logo" />
  </TitleContainer>
  <SubTitle>
    Begin your journey towards a healthier tomorrow with MyoDx today.
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
  text="SignIn"
  onClick={handelSignIn}
  isLoading={loading}  // Properly passing to custom Button
  isDisabled={buttonDisabled}
/>
<Button
  text="Continue With Google"
  onClick={googleLogin}
  isLoading={sumit}  // Properly passing to custom Button
  isDisabled={buttonDisabled}
/>

        
       
      </div>
      <Toast id="toast" />
      <ToastContainer />
    </Container>
  );
};

export default SignIn;
