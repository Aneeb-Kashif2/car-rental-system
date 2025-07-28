import React, { createContext, useState, useEffect, useContext } from "react";
import axios from "axios";

const CarContext = createContext();

export const useCars = () => useContext(CarContext);

export default function CarProvider({ children }) {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchCars = async () => {
    try {
const res = await axios.get("http://localhost:8000/api/cars");
      setCars(res.data);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching cars:", err);
    }
  };

  useEffect(() => {
    fetchCars();
  }, []);

  return (
    <CarContext.Provider value={{ cars, loading }}>
      {children}
    </CarContext.Provider>
  );
}
