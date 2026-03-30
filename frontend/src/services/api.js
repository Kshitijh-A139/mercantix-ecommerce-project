import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:9090",
  withCredentials: true, // IMPORTANT for cookies
});

export default API;