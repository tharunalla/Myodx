import React, { useEffect, useState } from "react";
import styled from "styled-components";
import axios from "axios";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import {GetDataForAdminHomePage} from "../api/AdminDataFetch.js";

const AdminPage = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await GetDataForAdminHomePage(); // Adjust API endpoint if needed
        setStats(res.data);
        // console.log('Fetched Stats:', res.data); 
        setLoading(false);
      } catch (error) {
        console.error("Error fetching stats:", error);
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) return <Container>Loading Dashboard...</Container>;
if (!stats) return <Container>No data available</Container>;

const userGrowthData = stats.userGrowth.map((count, index) => ({
  week: `Week ${index + 1}`,
  users: count,
}));


  return (
    <Container>
      <Title>Welcome To Admin Dashboard</Title>

      <StatsGrid>
        <StatCard>
          <StatIcon>👥</StatIcon>
          <StatTitle>Total Users</StatTitle>
          <StatNumber>{stats.users}</StatNumber>
        </StatCard>
        <StatCard>
          <StatIcon>💬</StatIcon>
          <StatTitle>Total Feedback</StatTitle>
          <StatNumber>{stats.feedback}</StatNumber>
        </StatCard>
        <StatCard>
          <StatIcon>🧪</StatIcon>
          <StatTitle>Total Diagnoses</StatTitle>
          <StatNumber>{stats.diagnoses}</StatNumber>
        </StatCard>
        <StatCard>
          <StatIcon>➕</StatIcon>
          <StatTitle>New Users This Week</StatTitle>
          <StatNumber>{stats.newUsersThisWeek}</StatNumber>
        </StatCard>
      </StatsGrid>

      <DashboardContent>
        <CardSection>
          <SectionTitle>User Growth</SectionTitle>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={userGrowthData}>
              <XAxis dataKey="week" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="users" stroke="#3b82f6" strokeWidth={3} />
            </LineChart>
          </ResponsiveContainer>
        </CardSection>

        




<CardSection style={{
  maxHeight: '350px',
  overflowY: 'auto',
  padding: '20px',
  backgroundColor: '#f7f7f7',
  borderRadius: '12px',
  boxShadow: '0 12px 24px rgba(0, 0, 0, 0.1)',
  marginBottom: '25px',
  fontFamily: 'Inter, sans-serif',
  border: 'none'
}}>
  {stats.recentFeedbacks.length > 0 ? (
    stats.recentFeedbacks.map((item, index) => (
      <FeedbackItem key={index} style={{
        backgroundColor: '#fff',
        borderRadius: '10px',
        padding: '20px',
        marginBottom: '20px',
        boxShadow: '0 4px 16px rgba(0, 0, 0, 0.08)',
        transition: 'transform 0.3s ease, box-shadow 0.3s ease',
        cursor: 'pointer',
        '&:hover': {
          transform: 'scale(1.03)',
          boxShadow: '0 6px 20px rgba(0, 0, 0, 0.15)'
        }
      }} onMouseEnter={(e) => {
        e.target.style.transform = 'scale(1.03)';
        e.target.style.boxShadow = '0 6px 20px rgba(0, 0, 0, 0.15)';
      }} onMouseLeave={(e) => {
        e.target.style.transform = 'scale(1)';
        e.target.style.boxShadow = '0 4px 16px rgba(0, 0, 0, 0.08)';
      }}>

        {/* Feedback Giver's Name */}
        <div style={{
          fontSize: '18px',
          fontWeight: '600',
          color: '#333',
          marginBottom: '12px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
          <span style={{
            color: '#007BFF',
            textTransform: 'capitalize',
            fontFamily: 'Poppins, sans-serif'
          }}>{item.feedbackGiverName}</span>
          <span style={{
            fontSize: '14px',
            color: '#888',
            fontStyle: 'italic',
          }}>Just Now</span> {/* You can replace 'Just Now' with actual date if available */}
        </div>

        {/* Feedback Details */}
        <div style={{ color: '#444', lineHeight: '1.7' }}>
          <p><strong>Satisfaction:</strong> <span style={{ color: '#4CAF50' }}>{item.satisfaction}</span></p>
          <p><strong>Ease of Use:</strong> <span style={{ color: '#4CAF50' }}>{item.easeOfUse}</span></p>
          <p><strong>Clarity:</strong> <span style={{ color: '#4CAF50' }}>{item.clarity}</span></p>
          <p><strong>Helpfulness:</strong> <span style={{ color: '#4CAF50' }}>{item.helpfulness}</span></p>
          <p><strong>Suggestions:</strong> <em style={{ color: '#777' }}>{item.suggestions}</em></p>
        </div>
      </FeedbackItem>
    ))
  ) : (
    <FeedbackItem style={{
      padding: '20px',
      backgroundColor: '#fff',
      borderRadius: '10px',
      fontStyle: 'italic',
      color: '#888',
      textAlign: 'center',
      boxShadow: '0 4px 16px rgba(0, 0, 0, 0.08)',
      fontFamily: 'Inter, sans-serif'
    }}>No feedbacks yet.</FeedbackItem>
  )}
</CardSection>





      </DashboardContent>
    </Container>
  );
};

export default AdminPage;

// Styled Components (same as you had)
const Container = styled.div`
  padding: 20px;
  background-color: #f0f4fa;
font-family: 'Inter', sans-serif;
`;

const Title = styled.h1`
  font-size: 36px;
  font-weight: bold;
  color: #2563eb; 
`;



const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  margin-top: 30px;
  
`;

const StatCard = styled.div`
  background: #ffffff;
  border-radius: 20px;
  padding: 30px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
  display: flex;
  flex-direction: column;
  align-items: center;
  transition: all 0.3s ease;

&:hover {
  transform: translateY(-5px);
  box-shadow: 0 12px 32px rgba(37, 99, 235, 0.2);
}
`;

const StatIcon = styled.div`
  font-size: 40px;
  margin-bottom: 10px;
`;

const StatTitle = styled.h3`
  font-size: 18px;
  color: #555;
  margin-bottom: 8px;
`;

const StatNumber = styled.div`
  font-size: 32px;
  font-weight: bold;
  color: #111;
`;

const DashboardContent = styled.div`
  margin-top: 40px;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 30px;
`;

const CardSection = styled.div`
  // background: rgba(255, 255, 255, 0.7);
  background: #ffffff;
  backdrop-filter: blur(12px);
  border-radius: 20px;
  padding: 30px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
`;

const SectionTitle = styled.h2`
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 20px;
  color: #2563eb;
`;

const FeedbackItem = styled.div`
  background: #f9f9f9;
  padding: 10px 15px;
  border-radius: 12px;
  margin-bottom: 10px;
  font-size: 14px;
  color: #555;
`;




