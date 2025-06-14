// import React from 'react';

// const ProfileModal = ({ showProfileModal, handleClose, userProfileReport }) => {
//   if (!userProfileReport) return null;  // Return null if there is no report data

//   const { user, latestDiagnosis, latestFeedback } = userProfileReport;

//   // Modal background styling
//   const modalStyle = {
//     position: 'fixed',
//     top: 0,
//     left: 0,
//     right: 0,
//     bottom: 0,
//     backgroundColor: 'rgba(0, 0, 0, 0.7)',
//     display: showProfileModal ? 'flex' : 'none',
//     justifyContent: 'center',
//     alignItems: 'center',
//     padding: '10px',
//   };

//   // Modal content box styling
//   const modalContentStyle = {
//     backgroundColor: 'white',
//     padding: '20px',
//     borderRadius: '10px',
//     width: '80%',
//     maxWidth: '900px',
//     boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
//     overflowY: 'auto',
//     maxHeight: '80vh', // Ensure that the modal doesn't overflow the screen
//   };

//   // Close button styling
//   const buttonStyle = {
//     marginTop: '10px',
//     padding: '10px 20px',
//     backgroundColor: '#007bff',
//     color: 'white',
//     border: 'none',
//     cursor: 'pointer',
//     borderRadius: '5px',
//     fontWeight: 'bold',
//   };

//   const sectionHeaderStyle = {
//     marginBottom: '10px',
//     color: '#333',
//     fontSize: '1.2rem',
//     fontWeight: 'bold',
//   };

//   // User role section
//   const renderUserRole = () => {
//     return user.role ? (
//       <p><strong>Role:</strong> {user.role}</p>
//     ) : (
//       <p><strong>Role:</strong> NA</p>
//     );
//   };

//   // Field names for the diagnosis
//   const diagnosisFieldNames = [
//     "age", "sex", "ethnicity", "familyHistory", "inheritancePattern", "gaitAbnormalities", "contractures", "muscleStrength", "physicalActivity",
//     "dietaryHabits", "exposureToToxins", "geneticTestResults", "muscleBiopsy", "emgResults", "respiratorySupportRequired", "reflexes", "muscleTone",
//     "diagnosis", "ageOfOnset", "functionalMobilityScore", "fatigueLevels", "painLevels", "ckLevels", "dystrophinExpression", "myoglobinLevels",
//     "ntProBNP", "fvc", "ejectionFraction", "fatInfiltration", "pefr", "sixMWTDistance", "gaitSpeed", "cognitiveFunction", "qualityOfLifeScore",
//     "prediction", "diagnosisScore", "predictedRiskPercentage"
//   ];

//   // Render the diagnosis section with all fields if no data is available
//   const renderDiagnosisSection = () => {
//     if (!latestDiagnosis) {
//       return (
//         <div>
//           <h3 style={sectionHeaderStyle}>Latest Diagnosis</h3>
//           {diagnosisFieldNames.map((field, index) => (
//             <p key={index}><strong>{field}:</strong> NA</p>
//           ))}
//         </div>
//       );
//     }

//     return (
//       <div>
//         <h3 style={sectionHeaderStyle}>Latest Diagnosis</h3>
//         {diagnosisFieldNames.map((field, index) => (
//           <p key={index}><strong>{field.charAt(0).toUpperCase() + field.slice(1)}:</strong> {latestDiagnosis[field] || 'NA'}</p>
//         ))}
//       </div>
//     );
//   };

//   // Render the feedback section
//   const renderFeedbackSection = () => {
//     if (!latestFeedback) {
//       return (
//         <div>
//           <h3 style={sectionHeaderStyle}>Latest Feedback</h3>
//           <p>Satisfaction: NA</p>
//           <p>Ease of Use: NA</p>
//           <p>Clarity: NA</p>
//           <p>Helpfulness: NA</p>
//           <p>Suggestions: NA</p>
//         </div>
//       );
//     }

//     return (
//       <div>
//         <h3 style={sectionHeaderStyle}>Latest Feedback</h3>
//         <p><strong>Satisfaction:</strong> {latestFeedback.satisfaction || 'NA'}</p>
//         <p><strong>Ease of Use:</strong> {latestFeedback.easeOfUse || 'NA'}</p>
//         <p><strong>Clarity:</strong> {latestFeedback.clarity || 'NA'}</p>
//         <p><strong>Helpfulness:</strong> {latestFeedback.helpfulness || 'NA'}</p>
//         <p><strong>Suggestions:</strong> {latestFeedback.suggestions || 'NA'}</p>
//       </div>
//     );
//   };

//   // Render the user details section
//   const renderUserDetails = () => (
//     <div>
//       <h3 style={sectionHeaderStyle}>User Details</h3>
//       <p><strong>Name:</strong> {user.name || 'NA'}</p>
//       <p><strong>Email:</strong> {user.email || 'NA'}</p>
//       <p><strong>Age:</strong> {user.age || 'NA'}</p>
//       {renderUserRole()}
//     </div>
//   );

//   return (
//     <div style={modalStyle} onClick={handleClose}>
//       <div style={modalContentStyle} onClick={(e) => e.stopPropagation()}>
//         <button style={buttonStyle} onClick={handleClose}>Close</button>
//         <h2>User Profile</h2>
//         {renderUserDetails()}
//         {renderDiagnosisSection()}
//         {renderFeedbackSection()}
//       </div>
//     </div>
//   );
// };

// export default ProfileModal;







import React from 'react';

const ProfileModal = ({ showProfileModal, handleClose, userProfileReport }) => {
  if (!userProfileReport) return null;

  const { user, latestDiagnosis, latestFeedback } = userProfileReport;

  const modalStyle = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: showProfileModal ? 'flex' : 'none',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 9999,
    padding: '20px',
  };

  const modalContentStyle = {
    backgroundColor: '#ffffff',
    borderRadius: '12px',
    width: '90%',
    maxWidth: '900px',
    maxHeight: '85vh',
    overflowY: 'auto',
    boxShadow: '0 12px 30px rgba(0, 0, 0, 0.2)',
    padding: '30px',
    position: 'relative',
  };

  const closeButtonStyle = {
    position: 'absolute',
    top: '15px',
    right: '20px',
    fontSize: '18px',
    backgroundColor: '#e0e0e0',
    color: '#333',
    border: 'none',
    borderRadius: '50%',
    width: '32px',
    height: '32px',
    cursor: 'pointer',
    fontWeight: 'bold',
    lineHeight: '1',
  };

  const sectionHeaderStyle = {
    borderBottom: '1px solid #ccc',
    paddingBottom: '6px',
    marginBottom: '15px',
    fontSize: '1.3rem',
    color: '#2c3e50',
    fontWeight: '600',
  };

  const infoText = {
    fontSize: '1rem',
    color: '#444',
    marginBottom: '10px',
  };

  const renderUserRole = () => (
    <p style={infoText}><strong>Role:</strong> {user.role || 'NA'}</p>
  );

  const diagnosisFieldNames = [
    "age", "sex", "ethnicity", "familyHistory", "inheritancePattern", "gaitAbnormalities", "contractures", "muscleStrength", "physicalActivity",
    "dietaryHabits", "exposureToToxins", "geneticTestResults", "muscleBiopsy", "emgResults", "respiratorySupportRequired", "reflexes", "muscleTone",
    "diagnosis", "ageOfOnset", "functionalMobilityScore", "fatigueLevels", "painLevels", "ckLevels", "dystrophinExpression", "myoglobinLevels",
    "ntProBNP", "fvc", "ejectionFraction", "fatInfiltration", "pefr", "sixMWTDistance", "gaitSpeed", "cognitiveFunction", "qualityOfLifeScore",
    "prediction", "diagnosisScore", "predictedRiskPercentage"
  ];

  const renderDiagnosisSection = () => (
    <div>
      <h3 style={sectionHeaderStyle}>Latest Diagnosis</h3>
      {diagnosisFieldNames.map((field, index) => (
        <p style={infoText} key={index}>
          <strong>{field.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}:</strong> {latestDiagnosis?.[field] || 'NA'}
        </p>
      ))}
    </div>
  );

  const renderFeedbackSection = () => (
    <div>
      <h3 style={sectionHeaderStyle}>Latest Feedback</h3>
      <p style={infoText}><strong>Satisfaction:</strong> {latestFeedback?.satisfaction || 'NA'}</p>
      <p style={infoText}><strong>Ease of Use:</strong> {latestFeedback?.easeOfUse || 'NA'}</p>
      <p style={infoText}><strong>Clarity:</strong> {latestFeedback?.clarity || 'NA'}</p>
      <p style={infoText}><strong>Helpfulness:</strong> {latestFeedback?.helpfulness || 'NA'}</p>
      <p style={infoText}><strong>Suggestions:</strong> {latestFeedback?.suggestions || 'NA'}</p>
    </div>
  );

  const renderUserDetails = () => (
    <div>
      <h3 style={sectionHeaderStyle}>User Details</h3>
      <p style={infoText}><strong>Name:</strong> {user.name || 'NA'}</p>
      <p style={infoText}><strong>Email:</strong> {user.email || 'NA'}</p>
      <p style={infoText}><strong>Age:</strong> {user.age || 'NA'}</p>
      {renderUserRole()}
    </div>
  );

  return (
    <div style={modalStyle} onClick={handleClose}>
      <div style={modalContentStyle} onClick={(e) => e.stopPropagation()}>
        <button style={closeButtonStyle} onClick={handleClose}>×</button>
        <h2 style={{ marginTop: '10px', color: '#007bff', marginBottom: '25px' }}>User Profile Overview</h2>
        {renderUserDetails()}
        {renderDiagnosisSection()}
        {renderFeedbackSection()}
      </div>
    </div>
  );
};

export default ProfileModal;
