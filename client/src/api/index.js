import axios from "axios";

// const API = axios.create({
//   baseURL:process.env.REACT_APP_API_URL + "/api/",
// });

const API = axios.create({
  baseURL: process.env.REACT_APP_API_URL.replace(/\/$/, '') + "/api/",
});

export const UserSignUp = async (data) => API.post("/user/signup", data);
export const UserSignIn = async (data) => API.post("/user/signin", data);
export const forgotpassword = async(data) => API.post("/user/forgot-password",data);
export const resetpassword = async(data) => API.post("/forgotreset/reset-password",data);
export const verifyToken =  async(data) => API.post("/forgotreset/verifyToken",data);
  export const googleAuthSignIn = async(data) => API.get(`/auth/google/login?code=${data}`);
  export const googleAuthSignUp = async(data) => API.get(`/auth/google/signup?code=${data}`);
  export const GetModelPrediction = async(data) => API.post(`/model/predict`,data);
  export const CheckPresentorNots = async(data) => API.post(`/user/presentornot`,data);
 
