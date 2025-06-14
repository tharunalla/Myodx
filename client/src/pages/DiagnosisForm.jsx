















import React, { useState,useEffect } from 'react';
import { GetModelPrediction } from '../api';
import { useNavigate } from 'react-router-dom';
import FeedbackModal from './FeedbackModal';
import { GetFeedbackStatus } from '../api/FeedbackApi';

const DiagnosisForm = () => {
    const navigate = useNavigate();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showFeedbackModalInForm, setshowFeedbackModalInForm] = useState(false);
     const [userIdInForm, setuserIdInForm] = useState(null);
     const [feedbackModalResolve, setFeedbackModalResolve] = useState(null);

    const [formData, setFormData] = useState({ 
        age: "",
        sex: "",
        ethnicity: "",
        familyHistory: "",
        inheritancePattern: "",
        muscleStrength: "",
        gaitAbnormalities: "",
        contractures: "",
        functionalMobilityScore: "",
        fatigueLevels: "",
        painLevels: "",
        reflexes: "",
        muscleTone: "",
        ckLevels: "",
        dystrophinExpression: "",
        geneticTestResults: "",
        muscleBiopsy: "",
        emgResults: "",
        myoglobinLevels: "",
        ntProBNP: "",
        fvc: "",
        ejectionFraction: "",
        fatInfiltration: "",
        respiratorySupport: "",
        pefr: "",
        qolScores: "",
        cognitiveFunction: "",
        ageOfOnset: "",
        gaitSpeed: "",
        sixMWTDistance: "",
        physicalActivity: "",
        dietaryHabits: "",      // Added field
        exposureToToxins: "",  // Added field
        prediction: "",
        diagnosisScore: "",
        predictedRiskPercentage:""
    });


    const fetchUserData = async () => {
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
       
        setuserIdInForm(user._id);
      } catch (error) {
        console.error("An error occurred while fetching user:", error);
      }
    };
  
    // Optional: Automatically call it when component mounts
    useEffect(() => {
      fetchUserData();
    }, []);


  const checkFeedbackStatus = async () => {
       
    
        // try {
        //   const response = await GetFeedbackStatus(userIdInForm);
          
        //   if (response.status === 200) {
        //     if (response.data.hasGivenFeedback) {
        //       console.log("✅ Feedback already submitted. Clearing timers.");
        //       return;
        //     } else {
        //       console.log("⏳ Feedback not yet given. Showing feedback modal...");
        //       setshowFeedbackModalInForm(true); // Only show if not given
        //     }
        //   }
    
        // } catch (err) {
        //   console.error("❌ Error while checking feedback status:", err);
        // }
        console.log("Checking feedback status for userId:", userIdInForm);
    if (!userIdInForm) return;
  
    try {
      const response = await GetFeedbackStatus(userIdInForm);
      
      if (response.status === 200) {
        if (response.data.hasGivenFeedback) {
          console.log("✅ Feedback already submitted. Clearing timers.");
          return true; // ✅ allow to proceed
        } else {
          console.log("⏳ Feedback not yet given. Showing feedback modal...");
          
          return new Promise((resolve) => {
            setshowFeedbackModalInForm(true); 
            // Store resolve function to call later from modal close/submit
            setFeedbackModalResolve(() => resolve);
          });
        }
      }
    } catch (err) {
      console.error("❌ Error while checking feedback status:", err);
      return true; // If error, allow to proceed
    }
  };

 
  


  const handleModalCloseInForm = async () => {
    setshowFeedbackModalInForm(false);
    if (feedbackModalResolve) {
      feedbackModalResolve(); // ✅ Resolve the promise when user closes
      setFeedbackModalResolve(null); // Clean up
    }
  };
    

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const fetchUserDetails = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return null;
  
      const response = await fetch(`${process.env.REACT_APP_API_URL}api/user/me`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        credentials: "include" 
      });
  
      if (response.ok) {
        const userData = await response.json();
        console.log("Fetched User Data:", userData);
        return userData;
      } else {
        console.error("Failed to fetch user data:", await response.text());
        return null;
      }
    } catch (error) {
      console.error("Error fetching user details:", error);
      return null;
    }
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Define validation criteria for each field with its range
    const validationRules = {
        age: (value) => value >= 1 && value <= 100,
        sex: (value) => value !== "",
        ethnicity: (value) => value !== "",
        familyHistory: (value) => value !== "",
        inheritancePattern: (value) => value !== "",
        muscleStrength: (value) => value >= 1 && value <= 4,
        gaitAbnormalities: (value) => value !== "",
        contractures: (value) => value !== "",
        functionalMobilityScore: (value) => value >= 0 && value <= 100,
        fatigueLevels: (value) => value >= 1.00 && value <= 10.00,
        painLevels: (value) => value >= 0.00 && value <= 10.00,
        reflexes: (value) => value !== "",
        muscleTone: (value) => value !== "",
        ckLevels: (value) => value >= 20 && value <= 5000,
        dystrophinExpression: (value) => value >= 0.00 && value <= 99.99,
        geneticTestResults: (value) => value !== "",
        muscleBiopsy: (value) => value !== "",
        emgResults: (value) => value !== "",
        myoglobinLevels: (value) => value >= 10.00 && value <= 200.00,
        ntProBNP: (value) => value >= 90.00 && value <= 5000.00,
        fvc: (value) => value >= 10.00 && value <= 120.00,
        ejectionFraction: (value) => value >= 20.00 && value <= 75.00,
        fatInfiltration: (value) => value >= 0.00 && value <= 99.99,
        respiratorySupport: (value) => value !== "",
        pefr: (value) => value >= 100.00 && value <= 799.99,
        qolScores: (value) => value >= 0.14 && value <= 99.93,
        cognitiveFunction: (value) => value >= 50.00 && value <= 149.99,
        ageOfOnset: (value) => value >= 1 && value <= 99,
        gaitSpeed: (value) => value >= 0.00 && value <= 1.99,
        sixMWTDistance: (value) => value >= 50.00 && value <= 599.99,
        physicalActivity: (value) => value !== "",
        dietaryHabits: (value) => value !== "",
        exposureToToxins: (value) => value !== "",
        prediction: (value) => true, // ✅ Always allow
        diagnosisScore: (value) => true, // ✅ Always allow
        predictedRiskPercentage: (value) => true, // ✅ Always allow

        
    };

    // Check all fields for validity
    for (const [field, value] of Object.entries(formData)) {
        const validate = validationRules[field];
        if (!validate || !validate(value)) {
            // alert(`Invalid value for ${field}. Please check your input.`);
            window.Toastify({ text: `❌ Invalid value for ${field}. Please check your input.`, duration: 4000, gravity: "top", position: "center", style: { background: "rgba(220, 53, 69, 0.2)", backdropFilter: "blur(8px)", WebkitBackdropFilter: "blur(8px)", color: "#fff", fontWeight: "500", fontSize: "16px", padding: "14px 28px", borderRadius: "12px", boxShadow: "0 8px 20px rgba(0,0,0,0.2)", border: "1px solid rgba(255,255,255,0.2)", textAlign: "center" }, close: true, stopOnFocus: true }).showToast();

            setIsSubmitting(false);
            return;
        }
    }

    // Proceed with form submission logic if all validations pass
    console.log("Form data is valid:", formData);


    try {
        // Make the prediction API call
        const predictionResponse = await GetModelPrediction({ formData });
        console.log("Prediction result:", predictionResponse);

        // Extract prediction values directly from response
        const { Prediction, 
            DiagnosisScore, RiskPercentage } = predictionResponse.data;
        

        // Update formData with the prediction data directly from the API
        const updatedFormData = {
            ...formData,
            prediction: Prediction,
            diagnosisScore: DiagnosisScore,
            predictedRiskPercentage: RiskPercentage
        };

        setFormData(updatedFormData);

        console.log("Updated Form data: ", updatedFormData); // ✅ LOG INSIDE TRY

        const user = await fetchUserDetails();
        if (!user || !user._id) {
          // alert("Unable to fetch user details. Please log in again.");
          window.Toastify({ text: "❌ Unable to fetch user details. Please log in again.", duration: 4000, gravity: "top", position: "center", style: { background: "rgba(220, 53, 69, 0.2)", backdropFilter: "blur(8px)", WebkitBackdropFilter: "blur(8px)", color: "#fff", fontWeight: "500", fontSize: "16px", padding: "14px 28px", borderRadius: "12px", boxShadow: "0 8px 20px rgba(0,0,0,0.2)", border: "1px solid rgba(255,255,255,0.2)", textAlign: "center" }, close: true, stopOnFocus: true }).showToast();

          setIsSubmitting(false); // stop loading
          return;
        }

        // Include the user ID in the form data
      const dataToSave = {
          ...updatedFormData,
          user: user._id,  // Add the logged-in user's ID
        };
        
        const response = await fetch(`${process.env.REACT_APP_API_URL}api/diagnosis`, {
                    method: "POST",
                    headers: {
                      "Content-Type": "application/json",
                    },
                    body: JSON.stringify(dataToSave), // ✅ this was previously completeFormData
                  });
              
                  if (response.ok) {
                    const result = await response.json();
                    console.log("Saved to MongoDB:", result);
                    // alert("Form submitted and saved successfully!");
                    window.Toastify({ text: "✅ Form submitted and saved successfully!", duration: 4000, gravity: "top", position: "center", style: { background: "rgba(40, 167, 69, 0.2)", backdropFilter: "blur(8px)", WebkitBackdropFilter: "blur(8px)", color: "#fff", fontWeight: "500", fontSize: "16px", padding: "14px 28px", borderRadius: "12px", boxShadow: "0 8px 20px rgba(0,0,0,0.2)", border: "1px solid rgba(255,255,255,0.2)", textAlign: "center" }, close: true, stopOnFocus: true }).showToast();

                    setFormData(Object.fromEntries(Object.keys(formData).map((key) => [key, ""])));
                    // navigate("/"); // or whatever your Dashboard route path is
            
                  } else {
                    console.error("Failed to save:", await response.text());
                    // alert("Failed to submit the form.");
                    window.Toastify({ text: "❌ Failed to submit the form.", duration: 4000, gravity: "top", position: "center", style: { background: "rgba(220, 53, 69, 0.2)", backdropFilter: "blur(8px)", WebkitBackdropFilter: "blur(8px)", color: "#fff", fontWeight: "500", fontSize: "16px", padding: "14px 28px", borderRadius: "12px", boxShadow: "0 8px 20px rgba(0,0,0,0.2)", border: "1px solid rgba(255,255,255,0.2)", textAlign: "center" }, close: true, stopOnFocus: true }).showToast();

                  }

        setIsSubmitting(false);
        // alert("Prediction successful!");
        await checkFeedbackStatus();
        navigate("/");
        
    } catch (error) {
        console.error("Error during prediction:", error);
        // alert("Error during prediction. Please try again later.");
        window.Toastify({ text: "❌ Error during prediction. Please try again later.", duration: 4000, gravity: "top", position: "center", style: { background: "rgba(220, 53, 69, 0.2)", backdropFilter: "blur(8px)", WebkitBackdropFilter: "blur(8px)", color: "#fff", fontWeight: "500", fontSize: "16px", padding: "14px 28px", borderRadius: "12px", boxShadow: "0 8px 20px rgba(0,0,0,0.2)", border: "1px solid rgba(255,255,255,0.2)", textAlign: "center" }, close: true, stopOnFocus: true }).showToast();

        setIsSubmitting(false);
    }
    
      
  };





  return (
    <>
    <div style={containerStyles}>
      <h1 style={{ marginTop:'-30px' ,marginLeft:'180px', marginBottom: '20px', fontSize: '24px', color: '#222' }}>
        Diagnosis Form
      </h1>
      <form onSubmit={handleSubmit} style={formStyles}>
        <div style={sectionTitleStyles}>Demographics</div>
        <div style={fieldsGridStyles}>
          <div style={fieldStyles}>
            <label htmlFor="age">Age</label>
            <input
              type="number"
              id="age"
              name="age"
              value={formData.age}
              onChange={handleChange}
            />
          </div>
          <div style={fieldStyles}>
            <label htmlFor="sex">Sex</label>
            <select
              id="sex"
              name="sex"
              value={formData.sex}
              onChange={handleChange}
            >
              <option value="">Select</option>
              <option value="Female">Female</option>
              <option value="Male">Male</option>
            </select>
          </div>
          <div style={fieldStyles}>
            <label htmlFor="ethnicity">Ethnicity</label>
            <select
              id="ethnicity"
              name="ethnicity"
              value={formData.ethnicity}
              onChange={handleChange}
            >
              <option value="">Select</option>
              <option value="Caucasian">Caucasian</option>
              <option value="Other">Other</option>
              <option value="Asian">Asian</option>
              <option value="African American">African American</option>
              <option value="Hispanic">Hispanic</option>
            </select>
          </div>
          <div style={fieldStyles}>
            <label htmlFor="familyHistory">Family History</label>
            <select
              id="familyHistory"
              name="familyHistory"
              value={formData.familyHistory}
              onChange={handleChange}
            >
              <option value="">Select</option>
              <option value="Yes">Yes</option>
              <option value="No">No</option>
            </select>
          </div>
          <div style={fieldStyles}>
            <label htmlFor="inheritancePattern">Inheritance Pattern</label>
            <select
              id="inheritancePattern"
              name="inheritancePattern"
              value={formData.inheritancePattern}
              onChange={handleChange}
            >
              <option value="">Select</option>
              <option value="Autosomal Dominant">Autosomal Dominant</option>
              <option value="X-Linked">X-Linked</option>
              <option value="Autosomal Recessive">Autosomal Recessive</option>
            </select>
          </div>
        </div>

        <div style={sectionTitleStyles}>NeuroMuscular Assessments</div>
        <div style={fieldsGridStyles}>
          <div style={fieldStyles}>
            <label htmlFor="muscleStrength">Muscle Strength</label>
            <input
              type="text"
              id="muscleStrength"
              name="muscleStrength"
              value={formData.muscleStrength}
              placeholder="1 - 4"
              onChange={handleChange}
            />
          </div>
          <div style={fieldStyles}>
            <label htmlFor="gaitAbnormalities">Gait Abnormalities</label>
            <select
                id="gaitAbnormalities"
                name="gaitAbnormalities"
                value={formData.gaitAbnormalities}
                onChange={handleChange}
            >
                <option value="">Select</option>
                <option value="None">None</option>
                <option value="Mild">Mild</option>
                <option value="Moderate">Moderate</option>
                <option value="Severe">Severe</option>
            </select>
            </div>

            <div style={fieldStyles}>
                <label htmlFor="contractures">Contractures</label>
                <select
                    id="contractures"
                    name="contractures"
                    value={formData.contractures}
                    onChange={handleChange}
                >
                    <option value="">Select</option>
                    <option value="Yes">Yes</option>
                    <option value="No">No</option>
                </select>
                </div>
          <div style={fieldStyles}>
            <label htmlFor="functionalMobilityScore">Functional Mobility Score</label>
            <input
              type="text"
              id="functionalMobilityScore"
              name="functionalMobilityScore"
              value={formData.functionalMobilityScore}
              placeholder="0 - 100"
              onChange={handleChange}
            />
          </div>
          <div style={fieldStyles}>
            <label htmlFor="fatigueLevels">Fatigue Levels</label>
            <input
              type="text"
              id="fatigueLevels"
              name="fatigueLevels"
              value={formData.fatigueLevels}
               placeholder="1.00 - 10.00"
              onChange={handleChange}
            />
          </div>
          <div style={fieldStyles}>
            <label htmlFor="painLevels">Pain Levels</label>
            <input
              type="text"
              id="painLevels"
              name="painLevels"
              value={formData.painLevels}
              placeholder="0.00 - 10.00"
              onChange={handleChange}
            />
          </div>
          <div style={fieldStyles}>
            <label htmlFor="reflexes">Reflexes</label>
            <select
                id="reflexes"
                name="reflexes"
                value={formData.reflexes}
                onChange={handleChange}
            >
                <option value="">Select</option>
                <option value="Hyporeflexia">Hyporeflexia</option>
                <option value="Hyperreflexia">Hyperreflexia</option>
                <option value="Normal">Normal</option>
            </select>
            </div>

            <div style={fieldStyles}>
                <label htmlFor="muscleTone">Muscle Tone</label>
                <select
                    id="muscleTone"
                    name="muscleTone"
                    value={formData.muscleTone}
                    onChange={handleChange}
                >
                    <option value="">Select</option>
                    <option value="Spastic">Spastic</option>
                    <option value="Flaccid">Flaccid</option>
                    <option value="Normal">Normal</option>
                </select>
                </div>

        </div>

        <div style={sectionTitleStyles}>Diagnostic Biomarkers</div>
        <div style={fieldsGridStyles}>
          <div style={fieldStyles}>
            <label htmlFor="ckLevels">CK Levels (U/L)</label>
            <input
              type="text"
              id="ckLevels"
              name="ckLevels"
              value={formData.ckLevels}
              placeholder="20 - 5000"
              onChange={handleChange}
            />
          </div>
          <div style={fieldStyles}>
            <label htmlFor="dystrophinExpression">Dystrophin Expression (%)</label>
            <input
              type="text"
              id="dystrophinExpression"
              name="dystrophinExpression"
              value={formData.dystrophinExpression}
              placeholder="0.00 - 99.99"
              onChange={handleChange}
            />
          </div>
          <div style={fieldStyles}>
                <label htmlFor="geneticTestResults">Genetic Test Results</label>
                <select
                    id="geneticTestResults"
                    name="geneticTestResults"
                    value={formData.geneticTestResults}
                    onChange={handleChange}
                >
                    <option value="">Select</option>
                    <option value="Positive">Positive</option>
                    <option value="Negative">Negative</option>
                </select>
                </div>

                <div style={fieldStyles}>
                    <label htmlFor="muscleBiopsy">Muscle Biopsy</label>
                    <select
                        id="muscleBiopsy"
                        name="muscleBiopsy"
                        value={formData.muscleBiopsy}
                        onChange={handleChange}
                    >
                        <option value="">Select</option>
                        <option value="Positive">Positive</option>
                        <option value="Negative">Negative</option>
                    </select>
                    </div>

                    <div style={fieldStyles}>
  <label htmlFor="emgResults">EMG Results</label>
  <select
    id="emgResults"
    name="emgResults"
    value={formData.emgResults}
    onChange={handleChange}
  >
    <option value="">Select</option>
    <option value="Abnormal">Abnormal</option>
    <option value="Normal">Normal</option>
  </select>
</div>

          <div style={fieldStyles}>
            <label htmlFor="myoglobinLevels">myoglobinLevels</label>
            <input
              type="text"
              id="myoglobinLevels"
              name="myoglobinLevels"
              value={formData.myoglobinLevels}
               placeholder="10.00 - 200.00"
              onChange={handleChange}
            />
          </div>
          <div style={fieldStyles}>
            <label htmlFor="ntProBNP">NT-proBNP</label>
            <input
              type="text"
              id="ntProBNP"
              name="ntProBNP"
              value={formData.ntProBNP}
              placeholder="90.00 - 5000.00"
              onChange={handleChange}
            />
          </div>
        </div>


        <div style={sectionTitleStyles}>Physiological Metrics</div>
<div style={fieldsGridStyles}>
  <div style={fieldStyles}>
    <label htmlFor="fvc">FVC (%)</label>
    <input
      type="text"
      id="fvc"
      name="fvc"
      value={formData.fvc}
       placeholder="10.00 - 120.00"
      onChange={handleChange}
    />
  </div>
  <div style={fieldStyles}>
    <label htmlFor="ejectionFraction">Ejection Fraction (%)</label>
    <input
      type="text"
      id="ejectionFraction"
      name="ejectionFraction"
      value={formData.ejectionFraction}
      placeholder="20.00 - 75.00"
      onChange={handleChange}
    />
  </div>
  <div style={fieldStyles}>
    <label htmlFor="fatInfiltration">Fat Infiltration Percentage</label>
    <input
      type="text"
      id="fatInfiltration"
      name="fatInfiltration"
      value={formData.fatInfiltration}
      placeholder="0.00 - 99.99"
      onChange={handleChange}
    />
  </div>
  <div style={fieldStyles}>
  <label htmlFor="respiratorySupport">Respiratory Support Required</label>
  <select
    id="respiratorySupport"
    name="respiratorySupport"
    value={formData.respiratorySupport}
    onChange={handleChange}
  >
    <option value="">Select</option>
    <option value="No">No</option>
    <option value="Yes">Yes</option>
  </select>
</div>

  <div style={fieldStyles}>
    <label htmlFor="pefr">Peak Expiratory Flow Rate (PEFR)</label>
    <input
      type="text"
      id="pefr"
      name="pefr"
      value={formData.pefr}
       placeholder="100.00 - 799.99"
      onChange={handleChange}
    />
  </div>
</div>


<div style={sectionTitleStyles}>Cognitive & Psychological Factors</div>
<div style={fieldsGridStyles}>
  <div style={fieldStyles}>
    <label htmlFor="qolScores">Quality of Life (QoL) Scores</label>
    <input
      type="text"
      id="qolScores"
      name="qolScores"
      value={formData.qolScores}
      placeholder="0.14 - 99.93"
      
      onChange={handleChange}
    />
  </div>
  <div style={fieldStyles}>
    <label htmlFor="cognitiveFunction">Cognitive Function</label>
    <input
      type="text"
      id="cognitiveFunction"
      name="cognitiveFunction"
      value={formData.cognitiveFunction}
      placeholder="50.00 - 149.99"
      onChange={handleChange}
    />
  </div>
</div>


<div style={sectionTitleStyles}>Functional Performance</div>
<div style={fieldsGridStyles}>
  <div style={fieldStyles}>
    <label htmlFor="ageOfOnset">Age of Onset</label>
    <input
      type="text"
      id="ageOfOnset"
      name="ageOfOnset"
      value={formData.ageOfOnset}
      placeholder="1 - 99"
      onChange={handleChange}
    />
  </div>
  <div style={fieldStyles}>
  <label htmlFor="gaitSpeed">Gait Speed (ms)</label>
    <input
      type="text"
      id="gaitSpeed"
      name="gaitSpeed"
      value={formData.gaitSpeed}
      placeholder="0.00 - 1.99"
      onChange={handleChange}
    />
  </div>
  <div style={fieldStyles}>
    <label htmlFor="sixMWTDistance">6MWT Distance (m)</label>
    <input
      type="text"
      id="sixMWTDistance"
      name="sixMWTDistance"
      value={formData.sixMWTDistance}
      placeholder="50.00 - 599.99"
      onChange={handleChange}
    />
  </div>
</div>


<div style={sectionTitleStyles}>Lifestyle & Environmental Factors</div>
<div style={fieldsGridStyles}>
<div style={fieldStyles}>
  <label htmlFor="physicalActivity">Physical Activity</label>
  <select
    id="physicalActivity"
    name="physicalActivity"
    value={formData.physicalActivity}
    onChange={handleChange}
  >
    <option value="">Select</option>
    <option value="Moderate">Moderate</option>
    <option value="Sedentary">Sedentary</option>
    <option value="Active">Active</option>
  </select>
</div>

<div style={fieldStyles}>
  <label htmlFor="dietaryHabits">Dietary Habits</label>
  <select
    id="dietaryHabits"
    name="dietaryHabits"
    value={formData.dietaryHabits}
    onChange={handleChange}
  >
    <option value="">Select</option>
    <option value="Vegetarian">Vegetarian</option>
    <option value="High-Protein">High-Protein</option>
    <option value="Balanced">Balanced</option>
  </select>
</div>

<div style={fieldStyles}>
  <label htmlFor="exposureToToxins">Exposure to Toxins</label>
  <select
    id="exposureToToxins"
    name="exposureToToxins"
    value={formData.exposureToToxins}
    onChange={handleChange}
  >
    <option value="">Select</option>
    <option value="Yes">Yes</option>
    <option value="No">No</option>
  </select>
</div>

</div>


        {/* <button
          type="submit"
          style={submitButtonStyles}
        >
          Submit
        </button> */}

<button
  type="submit"
  style={submitButtonStyles}
  disabled={isSubmitting} // optional: disable button while submitting
>
  {isSubmitting ? 'Submitting...' : 'Submit'}
</button>

      </form>
    </div>

    {showFeedbackModalInForm && (
            <FeedbackModal
              userId={userIdInForm}
              onClose = {handleModalCloseInForm}
            />
          )}
    </>

  );
};

const containerStyles = {
  padding: '40px',
  background: '#eef9fc',
  height: 'calc(100vh - 70px)',
  overflowY: 'auto', // Enable vertical scrolling
};

const formStyles = {
  maxWidth: '1200px',
  margin: '0 auto',
  background: 'white',
  padding: '30px',
  borderRadius: '12px',
  boxShadow: '0 8px 24px rgba(0, 0, 0, 0.1)'
};

const sectionTitleStyles = {
  fontSize: '24px',
  fontWeight: '700',
  color: '#2196F3',
  marginBottom: '30px', // Adding margin gap between sections
  textAlign: 'left',
  borderBottom: '2px solid #2196F3',
  paddingBottom: '6px'
};

const fieldsGridStyles = {
  display: 'grid',
  gridTemplateColumns: 'repeat(4, 1fr)',
  gap: '20px',
  marginBottom: '30px'
};

const fieldStyles = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start'
};

const submitButtonStyles = {
  backgroundColor: '#2196F3',
  color: 'white',
  padding: '12px 24px',
  border: 'none',
  borderRadius: '6px',
  cursor: 'pointer',
  fontSize: '18px',
  width: '100%',
  marginTop: '20px'
};

export default DiagnosisForm;

