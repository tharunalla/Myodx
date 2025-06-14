

import sys
import json
import joblib
import pandas as pd
import os
print(pd.__version__)

import sys
print("Python executable path:", sys.executable)



def predict_input(user_input_dict):
    """
    Predicts the diagnosis (Yes/No), diagnosis score, and risk percentage.
    
    Parameters:
        user_input_dict (dict): Dictionary with all input feature values matching training features.
    
    Returns:
        dict: Contains predicted diagnosis label ("Yes" or "No"), diagnosis score, and risk percentage.
    """
    # Load model, label encoder, and feature list
    # model, label_encoder, feature_names = joblib.load("D:/mdProject/mdProject/server/model-wrapper/diagnosis_model.pkl")
    model_path = os.path.join(os.path.dirname(__file__), 'diagnosis_model.pkl')
    # Load the model
    model, label_encoder, feature_names = joblib.load(model_path)

    # Convert input to DataFrame
    input_df = pd.DataFrame([user_input_dict])
    # print("Feature_names:", feature_names)
    # print("user_input_dict:", user_input_dict)

    # Ensure all required columns are present (add missing with 0)
    for col in feature_names:
        if col not in input_df.columns:
            input_df[col] = 0
    input_df = input_df[feature_names]  # Ensure correct order

    # Predict the class (0 or 1)
    prediction = model.predict(input_df)[0]

    # Get probability for both classes (Yes and No)
    prob = model.predict_proba(input_df)[0]

    # Get the predicted label from the encoder (Yes/No)
    label = label_encoder.inverse_transform([prediction])[0]

    # Calculate risk percentage for the predicted class
    risk_percentage = prob[1] * 100 if label == 'Yes' else prob[0] * 100

    # Calculate diagnosis score, which would be the raw probability for the predicted class
    diagnosis_score = prob[1] if label == 'Yes' else prob[0]

    # Return prediction, diagnosis score, and risk percentage
    result = {
        "Prediction": label,  # Yes or No
        "DiagnosisScore": round(diagnosis_score, 2),  # Raw probability for prediction
        "RiskPercentage": round(risk_percentage, 2)  # Probability as percentage
    }

    return result

try:
    # Load input JSON from command line
    input_json = sys.argv[1]
    input_data = json.loads(input_json)

    # Print received data for debugging
    print("Received data:", json.dumps(input_data), file=sys.stderr)

    # Call the predict_input function with the input data
    result = predict_input(input_data)

    # Print the result as JSON to be returned to the caller
    print(json.dumps(result))

except (IndexError, json.JSONDecodeError) as e:
    print(f"Error: {e}", file=sys.stderr)
