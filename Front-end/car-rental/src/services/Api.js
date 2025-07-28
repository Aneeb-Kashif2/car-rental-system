import axios from "axios";

// Backend is running at localhost:8000
const API = axios.create({
  baseURL: "http://localhost:8000", // backend
});

export const getAllCars = () => API.get("/"); // this hits the route we made in Express
