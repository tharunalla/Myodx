import React from "react";
import styled from "styled-components";

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

const AdminPage = () => {
  return (
    <Container>
      <div>
        <Title>Welcome To Diagnosis Dashboard</Title>
      </div> {/* ✅ properly closed the div */}
    </Container>
  );
};

export default AdminPage;
