// // // models/Diagnosis.js
import mongoose from "mongoose";

// const DiagnosisSchema = new mongoose.Schema({
 
//   age: Number,
//   sex: String,
//   ethnicity: String,
//   familyHistory: String,
//   inheritancePattern: String,
//   gaitAbnormalities: String,
//   contractures: String,
//   muscleStrength: String,
//   physicalActivity: String,
//   dietaryHabits: String,
//   exposureToToxins: String,
//   geneticTestResults: String,
//   muscleBiopsy: String,
//   emgResults: String,
//   respiratorySupportRequired: String,
//   reflexes: String,
//   muscleTone: String,
//   diagnosis: String,
//   ageOfOnset: Number,
//   functionalMobilityScore: Number,
//   fatigueLevels: Number,
//   painLevels: Number,
//   ckLevels: Number,
//   dystrophinExpression: Number,
//   myoglobinLevels: Number,
//   ntProBNP: Number,
//   fvc: Number,
//   ejectionFraction: Number,
//   fatInfiltration: Number,
//   pefr: Number,
//   sixMWTDistance: Number,
//   gaitSpeed: Number,
//   cognitiveFunction: String,
//   qualityOfLifeScore: Number
// }, { timestamps: true });

// const Diagnosis = mongoose.model("Diagnosis", DiagnosisSchema);
// export default Diagnosis;

const DiagnosisSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  age: Number,
  sex: String,
  ethnicity: String,
  familyHistory: String,
  inheritancePattern: String,
  gaitAbnormalities: String,
  contractures: String,
  muscleStrength: String,
  physicalActivity: String,
  dietaryHabits: String,
  exposureToToxins: String,
  geneticTestResults: String,
  muscleBiopsy: String,
  emgResults: String,
  respiratorySupportRequired: String,
  reflexes: String,
  muscleTone: String,
  diagnosis: String,
  ageOfOnset: Number,
  functionalMobilityScore: Number,
  fatigueLevels: Number,
  painLevels: Number,
  ckLevels: Number,
  dystrophinExpression: Number,
  myoglobinLevels: Number,
  ntProBNP: Number,
  fvc: Number,
  ejectionFraction: Number,
  fatInfiltration: Number,
  pefr: Number,
  sixMWTDistance: Number,
  gaitSpeed: Number,
  cognitiveFunction: String,
  qualityOfLifeScore: Number,
  prediction: String,
  diagnosisScore: Number,
  predictedRiskPercentage: Number
}, { timestamps: true });

const Diagnosis = mongoose.model("Diagnosis", DiagnosisSchema);
export default Diagnosis;