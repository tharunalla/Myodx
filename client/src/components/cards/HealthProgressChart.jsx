
  // import React from "react";
  // import { Line } from "react-chartjs-2";
  // import styled from "styled-components";
  // import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title as ChartJSPluginTitle, Tooltip, Legend } from "chart.js";

  // // Register chart.js components
  // ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, ChartJSPluginTitle, Tooltip, Legend);

  // // Styled components
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
  //   max-width: 800px; /* Limit the maximum width of the chart */
  //   width: 100%; /* Make it responsive */
  //   max-height: 400px; /* Limit the height of the Card */
  //   overflow: auto; /* Add scroll if content overflows */
  //   @media (max-width: 600px) {
  //     padding: 16px;
  //   }
  // `;

  // const ChartTitle = styled.div`
  //   font-weight: 600;
  //   font-size: 16px;
  //   color: ${({ theme }) => theme.primary};
  //   @media (max-width: 600px) {
  //     font-size: 14px;
  //   }
  // `;

  // const HealthProgressChart = ({ diagnosisData }) => {

  //   // Debugging logs
  //   console.log("Received diagnosisData:", diagnosisData);

  //   // Sort the data by createdAt in ascending order
  //   const sortedData = diagnosisData.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
  //   console.log("Sorted Data by Date:", sortedData);

  //   // Extract the dates and diagnosis scores
  //   const dates = sortedData.map(item => new Date(item.createdAt).toLocaleDateString());
  //   const diagnosisScores = sortedData.map(item => item.diagnosisScore);

  //   // Debugging logs for the extracted values
  //   console.log("Extracted Dates:", dates);
  //   console.log("Extracted Diagnosis Scores:", diagnosisScores);

  //   // Remove filtering logic to show all data points
  //   const filteredDates = dates; // Show all dates
  //   const filteredScores = diagnosisScores; // Show all scores

  //   // Debugging logs for filtered data
  //   console.log("Filtered Dates:", filteredDates);
  //   console.log("Filtered Diagnosis Scores:", filteredScores);

  //   // Chart.js data configuration
  //   const data = {
  //     labels: filteredDates, // All dates for x-axis
  //     datasets: [
  //       {
  //         label: 'Diagnosis Score Over Time',
  //         data: filteredScores, // All diagnosis scores
  //         fill: false,
  //         borderColor: 'rgb(75, 192, 192)',
  //         tension: 0.1
  //       }
  //     ]
  //   };

  //   // Debugging log to confirm chart data structure
  //   console.log("Chart Data:", data);

  //   // Chart.js options configuration
  //   const options = {
  //     responsive: true,
  //     plugins: {
  //       legend: {
  //         position: 'top',
  //       },
  //       title: {
  //         display: true,
  //         text: 'User Health Progress'
  //       }
  //     },
  //     scales: {
  //       x: {
  //         title: {
  //           display: true,
  //           text: 'Date'
  //         },
  //         ticks: {
  //           maxRotation: 0, // Prevents x-axis labels from rotating
  //           autoSkip: true, // Automatically skips labels if there are too many
  //         }
  //       },
  //       y: {
  //         title: {
  //           display: true,
  //           text: 'Diagnosis Score'
  //         },
  //         min: 0,
  //         max: 1 // Assuming diagnosis score is a percentage, adjust based on actual data range
  //       }
  //     }
  //   };

  //   return (
  //     <Card>
  //       <ChartTitle>User Health Progress</ChartTitle>
  //       <Line data={data} options={options} height={250} /> {/* Set the height of the chart */}
  //     </Card>
  //   );
  // };

  // export default HealthProgressChart;





  // import React from "react";
  // import { Line } from "react-chartjs-2";
  // import styled from "styled-components";
  // import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title as ChartJSPluginTitle, Tooltip, Legend } from "chart.js";
  
  // // Register chart.js components
  // ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, ChartJSPluginTitle, Tooltip, Legend);
  
  // // Styled components
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
  //   max-width: 800px; /* Limit the maximum width of the chart */
  //   width: 100%; /* Make it responsive */
  //   height: 400px; /* Set a fixed height for the Card */
  //   @media (max-width: 600px) {
  //     padding: 16px;
  //   }
  // `;
  
  // const ChartTitle = styled.div`
  //   font-weight: 600;
  //   font-size: 16px;
  //   color: ${({ theme }) => theme.primary};
  //   @media (max-width: 600px) {
  //     font-size: 14px;
  //   }
  // `;
  
  // const HealthProgressChart = ({ diagnosisData }) => {
  
  //   // Debugging logs
  //   console.log("Received diagnosisData:", diagnosisData);
  
  //   // Sort the data by createdAt in ascending order
  //   const sortedData = diagnosisData.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
  //   console.log("Sorted Data by Date:", sortedData);
  
  //   // Extract the dates and diagnosis scores
  //   const dates = sortedData.map(item => new Date(item.createdAt).toLocaleDateString());
  //   const diagnosisScores = sortedData.map(item => item.diagnosisScore);
  
  //   // Debugging logs for the extracted values
  //   console.log("Extracted Dates:", dates);
  //   console.log("Extracted Diagnosis Scores:", diagnosisScores);
  
  //   // Remove filtering logic to show all data points
  //   const filteredDates = dates; // Show all dates
  //   const filteredScores = diagnosisScores; // Show all scores
  
  //   // Debugging logs for filtered data
  //   console.log("Filtered Dates:", filteredDates);
  //   console.log("Filtered Diagnosis Scores:", filteredScores);
  
  //   // Chart.js data configuration
  //   const data = {
  //     labels: filteredDates, // All dates for x-axis
  //     datasets: [
  //       {
  //         label: 'Diagnosis Score Over Time',
  //         data: filteredScores, // All diagnosis scores
  //         fill: false,
  //         borderColor: 'rgb(75, 192, 192)',
  //         tension: 0.1
  //       }
  //     ]
  //   };
  
  //   // Debugging log to confirm chart data structure
  //   console.log("Chart Data:", data);
  
  //   // Chart.js options configuration
  //   const options = {
  //     responsive: true,
  //     plugins: {
  //       legend: {
  //         position: 'top',
  //       },
  //       title: {
  //         display: true,
  //         text: 'User Health Progress'
  //       }
  //     },
  //     scales: {
  //       x: {
  //         title: {
  //           display: true,
  //           text: 'Date'
  //         },
  //         ticks: {
  //           maxRotation: 0, // Prevents x-axis labels from rotating
  //           autoSkip: true, // Automatically skips labels if there are too many
  //         }
  //       },
  //       y: {
  //         title: {
  //           display: true,
  //           text: 'Diagnosis Score'
  //         },
  //         min: 0,
  //         max: 1 // Assuming diagnosis score is a percentage, adjust based on actual data range
  //       }
  //     }
  //   };
  
  //   return (
  //     <Card>
  //       <ChartTitle>User Health Progress</ChartTitle>
  //       <Line data={data} options={options} height={250} /> {/* Set the height of the chart */}
  //     </Card>
  //   );
  // };
  
  // export default HealthProgressChart;

















  import React from "react";
import { Line } from "react-chartjs-2";
import styled from "styled-components";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title as ChartJSPluginTitle, Tooltip, Legend } from "chart.js";

// Register chart.js components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, ChartJSPluginTitle, Tooltip, Legend);

// Styled components
const Card = styled.div`
  flex: 1;
  min-width: 280px;
  padding: 24px;
  border: 1px solid ${({ theme }) => theme.text_primary + 20};
  border-radius: 14px;
  box-shadow: 1px 6px 20px 0px ${({ theme }) => theme.primary + 15};
  display: flex;
  flex-direction: column;
  gap: 12px;
  width: 100%;
  height: 400px;
  @media (max-width: 600px) {
    padding: 16px;
  }
`;

const ChartContainer = styled.div`
  flex: 1; 
  width: 100%;
  height: 100%;
  position: relative;
`;

const ChartTitle = styled.div`
  font-weight: 600;
  font-size: 16px;
  color: ${({ theme }) => theme.primary};
  @media (max-width: 600px) {
    font-size: 14px;
  }
`;

const HealthProgressChart = ({ diagnosisData }) => {

  // Sort and extract data
  const sortedData = diagnosisData.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
  const dates = sortedData.map(item => new Date(item.createdAt).toLocaleDateString());
  const diagnosisScores = sortedData.map(item => item.diagnosisScore);

  const data = {
    labels: dates,
    datasets: [
      {
        label: 'Diagnosis Score Over Time',
        data: diagnosisScores,
        fill: false,
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,  // ✅ Important to allow full height and width control
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: false, // Hiding Chart.js built-in title, using custom
      }
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'Date'
        },
        ticks: {
          maxRotation: 0,
          autoSkip: true,
        }
      },
      y: {
        title: {
          display: true,
          text: 'Diagnosis Score'
        },
        min: 0,
        max: 1
      }
    }
  };

  return (
    <Card>
      <ChartTitle>User Health Progress</ChartTitle>
      <ChartContainer>
        <Line data={data} options={options} />
      </ChartContainer>
    </Card>
  );
};

export default HealthProgressChart;

  


