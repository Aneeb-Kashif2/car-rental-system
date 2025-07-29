import axios from "axios";

// Create an Axios instance with the VITE_API_URL as the base URL
const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL, // Use the environment variable for the backend URL
});

// Example function to get all cars using this API instance
export const getAllCars = () => API.get("/api/cars");
// Note: The original snippet had API.get("/"), but based on previous components,
// the endpoint for cars is typically "/api/cars". Adjust as per your backend routes.
