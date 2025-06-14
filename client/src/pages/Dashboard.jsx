import React, { useEffect, useState } from "react";
import styled from "styled-components";
import CountsCard from "../components/cards/CountsCard";
import WeeklyStatCard from "../components/cards/WeeklyStatCard";
import HealthProgressChart from "../components/cards/HealthProgressChart";
import { parseISO, startOfWeek, format } from "date-fns";
import FeedbackModal from "./FeedbackModal";
import { GetFeedbackStatus } from "../api/FeedbackApi";


const Container = styled.div`
  flex: 1;
  height: 100%;
  display: flex;
  justify-content: center;
  padding: 22px 0px;
  overflow-y: scroll;
`;

const Wrapper = styled.div`
  flex: 1;
  max-width: 1400px;
  display: flex;
  flex-direction: column;
  gap: 22px;
  @media (max-width: 600px) {
    gap: 12px;
  }
`;

const Title = styled.div`
  padding: 0px 16px;
  font-size: 22px;
  color: ${({ theme }) => theme.text_primary};
  font-weight: 500;
`;

const FlexWrap = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  gap: 22px;
  padding: 0px 16px;
  @media (max-width: 600px) {
    gap: 12px;
  }
`;

const Dashboard = () => {

  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [userId, setUserId] = useState(null);

  const FEEDBACK_MODAL_INITIAL_DELAY = 30 * 1000; // 45 seconds
  const FEEDBACK_MODAL_REPEAT_DELAY = 15* 60 * 1000; // 15 minutes

  const [data, setData] = useState(null);
  const [userDiagnoses, setUserDiagnoses] = useState([]);

  useEffect(() => {
    const fetchUserDiagnosisData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          console.error("No token found. User might not be logged in.");
          return;
        }

        const userResponse = await fetch(`${process.env.REACT_APP_API_URL}api/user/me`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!userResponse.ok) {
          console.error("User fetch failed:", await userResponse.text());
          return;
        }

        const user = await userResponse.json();
        setData(user); 
        setUserId(user._id); 

        const diagnosisResponse = await fetch(
          `${process.env.REACT_APP_API_URL}api/diagnosis/user/${user._id}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!diagnosisResponse.ok) {
          console.error("Diagnosis fetch failed:", await diagnosisResponse.text());
          return;
        }

        const diagnosisData = await diagnosisResponse.json();
        setUserDiagnoses(diagnosisData);

        if (diagnosisData.length === 0) {
          console.warn("No diagnosis records found.");
        }

      } catch (error) {
        console.error("Error fetching user diagnosis data:", error);
      }
    };

    fetchUserDiagnosisData();
  }, []);




  useEffect(() => {
    let initialTimer;
    let intervalTimer;
  
    const checkFeedbackStatus = async () => {
      console.log("Checking feedback status for userId:", userId);
      if (!userId) return;
  
      try {
        const response = await GetFeedbackStatus(userId);
        
        if (response.status === 200) {
          if (response.data.hasGivenFeedback) {
            console.log("✅ Feedback already submitted. Clearing timers.");
            clearInterval(intervalTimer); // Stop checking
            return;
          } else {
            console.log("⏳ Feedback not yet given. Showing feedback modal...");
            setShowFeedbackModal(true); // Only show if not given
          }
        }
  
      } catch (err) {
        console.error("❌ Error while checking feedback status:", err);
      }
    };
  
    // Step 1: First check after initial delay
    initialTimer = setTimeout(() => {
      checkFeedbackStatus();
  
      // Step 2: After first check, start checking every 10 minutes
      intervalTimer = setInterval(() => {
        checkFeedbackStatus();
      }, FEEDBACK_MODAL_REPEAT_DELAY);
  
    }, FEEDBACK_MODAL_INITIAL_DELAY);
  
    return () => {
      clearTimeout(initialTimer);
      clearInterval(intervalTimer);
    };
  }, [userId]);
  
  
  

  const handleModalClose = async () => {
        setShowFeedbackModal(false); // Close the modal after ignoring
      };
  
  if (!data) return <div>Loading...</div>;


    // Assuming diagnosisData contains a 'diagnosisScore' or similar field
    const sortedDiagnoses = userDiagnoses.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  // Get the most recent diagnosis score
  const diagnosisScore = sortedDiagnoses?.[0]?.diagnosisScore || 0;

  
  
  
  const countsCardData = {
    key: "diagnosisScore",
    name: "Latest Diagnosis Score",
    unit: "",
    color: "#FF9800", // Orange color for the icon
    lightColor: "#FFCC80", // Light orange background for icon
    icon: "📊", // Example icon (can be replaced with another icon)
    desc: "The score based on the diagnosis result",
  };
  
  const ata = {
    diagnosisScore: diagnosisScore,
  };
  
  const totalDiagnoses = userDiagnoses.length;

  const tDm = {
    key: "totalDiagnoses",
    name: "Total Diagnoses",
    unit: "",
    color: "#4CAF50", // Green color for the icon
    lightColor: "#A5D6A7", // Light green background for icon
    icon: "📋", // Icon representing the total diagnoses
    desc: "The total number of diagnoses",
  };

  const tD = {
    totalDiagnoses, // Pass the total diagnoses count
  };



  const predictedRisk = sortedDiagnoses?.[0]?.predictedRiskPercentage || 0;

  const riskCardData = {
    key: "predictedRisk",
    name: "Predicted Risk",
    unit: "%",
    color: "#F44336", // Red color
    lightColor: "#FFCDD2", // Light red background
    icon: "⚠️",
    desc: "The predicted risk percentage based on latest diagnosis",
  };

  const rD ={
    predictedRisk,
  };



// Group and average predictedRiskPercentage per week
const weeklyRiskData = {};

userDiagnoses.forEach((entry) => {
  const date = parseISO(entry.createdAt);
  const week = format(startOfWeek(date, { weekStartsOn: 1 }), "yyyy-MM-dd");
  if (!weeklyRiskData[week]) {
    weeklyRiskData[week] = [];
  }
  weeklyRiskData[week].push(entry.predictedRiskPercentage || 0);
});

const weeks = Object.keys(weeklyRiskData).sort(); // Keep it sorted chronologically
const values = weeks.map(week => {
  const total = weeklyRiskData[week].reduce((a, b) => a + b, 0);
  return (total / weeklyRiskData[week].length).toFixed(2);
});



  return (
    <Container>
      <Wrapper>
        <Title>Dashboard</Title>
        <FlexWrap>
          <CountsCard item={countsCardData} data={ata} key={countsCardData.key} showPercentageChange={false} />
          <CountsCard item={tDm} data={tD} key={countsCardData.key} showPercentageChange={false} />
          <CountsCard item={riskCardData} data={rD} key={countsCardData.key} showPercentageChange={false} />
          
        </FlexWrap>
        <FlexWrap>
        <WeeklyStatCard
          title="Weekly Diagnosis Risk %"
          weeks={weeks}
          values={values}
          unit="%"
        />

<HealthProgressChart diagnosisData={userDiagnoses} />



        </FlexWrap>
        
        {showFeedbackModal && (
        <FeedbackModal
          userId={userId}
          onClose = {handleModalClose}
        />
      )}

      </Wrapper>
    </Container>
  );
};

export default Dashboard;



