import axios from "axios";

const API = axios.create({
  baseURL: "https://disease-system-production-80d4.up.railway.app/api",
});

export default API;