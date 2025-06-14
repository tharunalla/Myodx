import React, { useState,useEffect } from "react";
import { useLocation } from 'react-router-dom';
import { Fragment } from 'react';

import styled from "styled-components";
import LogoImage from "../utils/Images/Logo.png";
import AuthImage from "../utils/Images/AuthImage.png";
import SignIn from "../components/SignIn";
import SignUp from "../components/SignUp";

import AdminSignIn from '../components/AdminSignIn';
import AdminSignUp from '../components/AdminSignUp';

const Container = styled.div`
  flex: 1;
  height: 100%;
  display: flex;
  background: ${({ theme }) => theme.bg};
  @media (max-width: 700px) {
    flex-direction: column;
  }
`;
const Left = styled.div`
  flex: 1;
  position: relative;
  @media (max-width: 700px) {
    display: none;
  }
`;
const Logo = styled.img`
  position: absolute;
  width: 70px;
  top: 40px;
  left: 60px;
  z-index: 10;
`;
const Image = styled.img`
  position: relative;
  height: 100%;
  width: 100%;
  object-fit: cover;
`;

const Right = styled.div`
  flex: 1;
  position: relative;
  display: flex;
  flex-direction: column;
  padding: 40px;
  gap: 16px;
  align-items: center;
  justify-content: center;
`;

const Text = styled.div`
  font-size: 16px;
  text-align: center;
  color: ${({ theme }) => theme.text_secondary};
  margin-top: 16px;
  @media (max-width: 400px) {
    font-size: 14px;
  }
`;
const TextButton = styled.span`
  color: ${({ theme }) => theme.primary};
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: 600;
`;





const Authentication = () => {
  const location = useLocation();
  const [login, setLogin] = useState(false);
  const [isAdminMode, setIsAdminMode] = useState(false);

  // Ensure the component re-renders by using a key based on location state
  const key = location.state?.key || null; // Use key to force re-render

  // Check if we need to show the AdminSignUp component
  useEffect(() => {
    if (location.state?.showAdminSignUp) {
      setIsAdminMode(true);
      setLogin(true);
    } else if (location.state?.showAdminSignIn) {
      setIsAdminMode(true);
      setLogin(false);
    }else if(location.state?.showUserSignUp){
      setIsAdminMode(false);
      setLogin(true);
    }else if(location.state?.showUserSignIn){
      setIsAdminMode(false);
      setLogin(false);

    }
  }, [location.state]);

  // Function to toggle between regular and admin modes
  const toggleAdminMode = () => {
    setIsAdminMode(!isAdminMode);
    setLogin(false); // Reset regular user mode
  };

  return (
    
    <Container>
      <Left>
        <Logo src={LogoImage} />
        <Image src={AuthImage} />
      </Left>
      <Right>
      <Fragment key={key}>
        {isAdminMode ? (
          // Admin Authentication Components
          !login ? (
            <>
              <AdminSignIn />
              <Text>
                New Admin GoAhead?{" "}
                <TextButton onClick={() => setLogin(true)}>SignUpAsAdmin</TextButton>
              </Text>
            </>
          ) : (
            <>
              <AdminSignUp />
              <Text>
                Already have Admin account?{" "}
                <TextButton onClick={() => setLogin(false)}>SignInAsAdmin</TextButton>
              </Text>
            </>
          )
        ) : (
          // Regular User Authentication Components
          !login ? (
            <>
              <SignIn />
              <Text>
                Don't have an account?{" "}
                <TextButton onClick={() => setLogin(true)}>SignUp</TextButton>
              </Text>
            </>
          ) : (
            <>
              <SignUp />
              <Text>
                Already have an account?{" "}
                <TextButton onClick={() => setLogin(false)}>SignIn</TextButton>
              </Text>
            </>
          )
        )}


        {!isAdminMode ? (
            <TextButton onClick={toggleAdminMode} style={{ marginBottom: '20px' }}>
              Go to Admin Authentication
            </TextButton>
          ) : (
            <TextButton onClick={toggleAdminMode} style={{ marginBottom: '20px' }}>
              Go to User Authentication
            </TextButton>
        )}
       </Fragment>
      </Right>
    </Container>
    
  );
};

export default Authentication;






