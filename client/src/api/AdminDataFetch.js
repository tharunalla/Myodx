import axios from "axios";

// const API = axios.create({
//   baseURL:"http://localhost:8080/api/",
// });

const API = axios.create({
  baseURL: process.env.REACT_APP_API_URL.replace(/\/$/, '') + "/api/",
});

export const GetDataForAdminHomePage = async () => API.get("fetch/data/stats");
export const GetUsersDetail = async () => API.get("fetch/data/users");
export const PostEditedData = async (data) => API.post("fetch/post/data/users",data);
export const DeleteUser = async (data) => API.post("fetch/delete/data/users",data);
export const FetchUserReport = async (data) => API.post("fetch/report/data/users",data);
