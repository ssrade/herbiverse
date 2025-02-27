import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://localhost:8000/api", // Change to your backend URL
  withCredentials: true,
});

export default axiosInstance;
