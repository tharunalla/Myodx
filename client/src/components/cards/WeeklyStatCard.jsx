// import React from "react";
// import styled from "styled-components";
// import { BarChart } from "@mui/x-charts/BarChart";

// const Card = styled.div`
//   flex: 1;
//   min-width: 280px;
//   padding: 24px;
//   border: 1px solid ${({ theme }) => theme.text_primary + 20};
//   border-radius: 14px;
//   box-shadow: 1px 6px 20px 0px ${({ theme }) => theme.primary + 15};
//   display: flex;
//   flex-direction: column;
//   gap: 6px;
//   @media (max-width: 600px) {
//     padding: 16px;
//   }
// `;
// const Title = styled.div`
//   font-weight: 600;
//   font-size: 16px;
//   color: ${({ theme }) => theme.primary};
//   @media (max-width: 600px) {
//     font-size: 14px;
//   }
// `;

// const WeeklyStatCard = ({ data }) => {
//   return (
//     <Card>
//       <Title> Weekly Analysis Report </Title>
//       {/* <Title>Weekly Calories Burned</Title> */}
//       {data?.totalWeeksCaloriesBurnt && (
//         <BarChart
//           xAxis={[
//             { scaleType: "band", data: data?.totalWeeksCaloriesBurnt?.weeks },
//           ]}
//           series={[{ data: data?.totalWeeksCaloriesBurnt?.caloriesBurned }]}
//           height={300}
//         />
//       )}
//     </Card>
//   );
// };

// export default WeeklyStatCard;



import React from "react";
import styled from "styled-components";
import { BarChart } from "@mui/x-charts/BarChart";

const Card = styled.div`
  flex: 1;
  min-width: 280px;
  padding: 24px;
  border: 1px solid ${({ theme }) => theme.text_primary + 20};
  border-radius: 14px;
  box-shadow: 1px 6px 20px 0px ${({ theme }) => theme.primary + 15};
  display: flex;
  flex-direction: column;
  gap: 6px;
  @media (max-width: 600px) {
    padding: 16px;
  }
`;

const Title = styled.div`
  font-weight: 600;
  font-size: 16px;
  color: ${({ theme }) => theme.primary};
  @media (max-width: 600px) {
    font-size: 14px;
  }
`;

const defaultColorPalette = ["#42a5f5", "#66bb6a", "#ffa726", "#ab47bc", "#26c6da"];

const WeeklyStatCard = ({ title = "Weekly Report", weeks, values, unit = "%", colors = defaultColorPalette }) => {
  const coloredSeries = values.map((val, index) => ({
    data: [val],
    label: weeks[index],
    color: colors[index % colors.length],
  }));

  return (
    <Card>
      <Title>{title}</Title>
      <BarChart
        xAxis={[{ scaleType: "band", data: weeks }]}
        series={coloredSeries}
        height={300}
      />
    </Card>
  );
};

export default WeeklyStatCard;

