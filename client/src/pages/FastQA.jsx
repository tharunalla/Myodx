





import React from "react";
import styled from "styled-components";

// Layout containers
const Container = styled.div`
  height: calc(100vh - 70px);
  display: flex;
  flex-direction: column;
  overflow: hidden;
`;

const ScrollableContent = styled.div`
  padding: 32px;
  overflow-y: auto;
  flex: 1;
  background-color: ${({ theme }) => theme.bg_light || "#f9f9fb"};
  scroll-behavior: smooth;
`;

// Typography styles
const Header = styled.div`
  margin-bottom: 40px;
  text-align: left;
`;

const Title = styled.h1`
  font-size: 32px;
  font-weight: 800;
  color: ${({ theme }) => theme.primary || "#1976d2"};
`;

const Subtitle = styled.p`
  font-size: 18px;
  color: ${({ theme }) => theme.text_secondary || "#666"};
  margin-top: 10px;
  max-width: 700px;
  line-height: 1.6;
`;

// Section styles
const Section = styled.div`
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 4px 14px rgba(0, 0, 0, 0.06);
  padding: 28px 32px;
  margin-bottom: 28px;
  transition: all 0.2s ease-in-out;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 18px rgba(0, 0, 0, 0.08);
  }
`;

const SectionTitle = styled.h2`
  font-size: 22px;
  font-weight: 700;
  color: ${({ theme }) => theme.text_primary || "#222"};
  margin-bottom: 16px;
  display: flex;
  align-items: center;
  gap: 12px;

  &:hover {
    color: ${({ theme }) => theme.primary || "#1976d2"};
  }
`;

const Icon = styled.span`
  font-size: 24px;
  transition: transform 0.2s ease;

  ${Section}:hover & {
    transform: scale(1.1);
  }
`;

const List = styled.ul`
  list-style-type: disc;
  padding-left: 22px;
  color: ${({ theme }) => theme.text_primary || "#333"};
  line-height: 1.8;
  font-size: 16px;

  li {
    margin-bottom: 14px;
  }

  strong {
    color: ${({ theme }) => theme.primary || "#1976d2"};
  }
`;

const HowToUseGuide = () => {
  return (
    <Container>
      <ScrollableContent>
        <Header>
          <Title>How to Use MyoDx</Title>
          <Subtitle>
            Welcome to MyoDx! This guide explains the purpose and usage of each
            page in your application to help you get the most out of your
            experience.
          </Subtitle>
        </Header>

        {/* Sections */}
        <Section>
          <SectionTitle><Icon>🏠</Icon>Dashboard</SectionTitle>
          <List>
            <li><strong>Purpose:</strong> The Dashboard is your home page...</li>
            <li><strong>Latest Diagnosis Score:</strong> Shows your most recent health risk score...</li>
            <li><strong>Total Diagnoses:</strong> Number of times you’ve completed...</li>
            <li><strong>Predicted Risk:</strong> The latest risk percentage...</li>
            <li><strong>Weekly Diagnosis Risk %:</strong> Visualizes your risk scores...</li>
            <li><strong>User Health Progress:</strong> Tracks changes over time...</li>
            <li><strong>How to Use:</strong> Check this page regularly...</li>
          </List>
        </Section>

        <Section>
          <SectionTitle><Icon>📝</Icon>Diagnosis</SectionTitle>
          <List>
            <li><strong>Purpose:</strong> Enter your details to generate a risk...</li>
            <li><strong>Demographics:</strong> Enter age, sex, family history...</li>
            <li><strong>NeuroMuscular Assessments:</strong> Fill in strength, gait, pain...</li>
            <li><strong>Diagnostic Biomarkers:</strong> Enter lab values like CK levels...</li>
            <li><strong>Physiological Metrics:</strong> Add other test results...</li>
            <li><strong>How to Use:</strong> Complete each field as accurately...</li>
          </List>
        </Section>

        <Section>
          <SectionTitle><Icon>📄</Icon>Reports</SectionTitle>
          <List>
            <li><strong>Purpose:</strong> View and download diagnosis reports...</li>
            <li><strong>Calendar:</strong> Select a date to view the report...</li>
            <li><strong>Report Details:</strong> Shows personal and medical info...</li>
            <li><strong>Download Report:</strong> Save a copy of your report...</li>
            <li><strong>How to Use:</strong> Use this for tracking and sharing...</li>
          </List>
        </Section>

        <Section>
          <SectionTitle><Icon>🎓</Icon>Educational</SectionTitle>
          <List>
            <li><strong>Purpose:</strong> A hub for learning about MD...</li>
            <li><strong>Video Cards:</strong> Each card links to a helpful video...</li>
            <li><strong>How to Use:</strong> Click “Watch More” to expand knowledge...</li>
          </List>
        </Section>

        <Section>
          <SectionTitle><Icon>👨‍⚕️</Icon>Contact</SectionTitle>
          <List>
            <li><strong>Purpose:</strong> Learn about and contact your specialist...</li>
            <li><strong>Specialist Profile:</strong> Dr. Alla Tharun’s credentials...</li>
            <li><strong>Areas of Expertise:</strong> Neuromuscular disorders, AI diagnostics...</li>
            <li><strong>How to Use:</strong> Use this for consultations or questions...</li>
          </List>
        </Section>

        <Section>
          <SectionTitle><Icon>💡</Icon>General Tips</SectionTitle>
          <List>
            <li><strong>Navigation:</strong> Use the top menu to move between pages.</li>
            <li><strong>Logout:</strong> Click Logout to exit securely.</li>
            <li><strong>Data Accuracy:</strong> Accurate input = better output.</li>
            <li><strong>Support:</strong> Use Contact if you’re unsure.</li>
          </List>
        </Section>

        <Section>
          <SectionTitle><Icon>❓</Icon>Need More Help?</SectionTitle>
          <List>
            <li>Use the Contact page for specialist or support team help.</li>
            <li>Check your internet connection or refresh for technical issues.</li>
          </List>
        </Section>
      </ScrollableContent>
    </Container>
  );
};

export default HowToUseGuide;
