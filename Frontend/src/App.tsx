import { useEffect, useState } from "react";
import axios from "axios";
import { Login } from "./components/Login";
import { Dashboard } from "./components/Dashboard";

const API_BASE_URL = 'http://10.187.7.44:5050/api';

type UserRole = 'manager' | 'farmer' | null;

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [userRole, setUserRole] = useState<UserRole>(null);

  const [greenhouseData, setGreenhouseData] = useState({
    sensors: { temperature: 0, humidity: 0, soil: 0, light: 0 },
    config: { 
      override: false, 
      fanStatus: false, 
      pumpStatus: false, 
      misterStatus: false, 
      lightStatus: false, 
      tempLimit: 30, 
      soilLimit: 30,
      humidityLimit: 60,
      sunlightLimit: 50
    }
  });

  useEffect(() => {
    const savedDarkMode = localStorage.getItem("darkMode");
    if (savedDarkMode === "true") {
      setDarkMode(true);
    }
  }, []);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    localStorage.setItem("darkMode", darkMode.toString());
  }, [darkMode]);

  useEffect(() => {
    if (!isAuthenticated) return;

    const fetchStatus = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/latest`);
        setGreenhouseData(response.data);
      } catch (error) {
        console.error("Backend sync failed. Check if Node.js is running at 10.187.7.44:5050");
      }
    };

    fetchStatus();
    const interval = setInterval(fetchStatus, 5000); 
    return () => clearInterval(interval);
  }, [isAuthenticated]);

  const handleLogin = (username: string, password: string) => {
    if (username === "admin" && password === "admin") {
      setIsAuthenticated(true);
      setUserRole('manager'); 
      return true;
    } else if (username === "farmer" && password === "farmer") {
      setIsAuthenticated(true);
      setUserRole('farmer');
      return true;
    }
    return false;
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setUserRole(null);
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  if (!isAuthenticated) {
    return (
      <Login
        onLogin={handleLogin}
        darkMode={darkMode}
        toggleDarkMode={toggleDarkMode}
      />
    );
  }

  return (
    <Dashboard
      onLogout={handleLogout}
      darkMode={darkMode}
      toggleDarkMode={toggleDarkMode}
      data={greenhouseData} 
      userRole={userRole} 
      apiUrl={API_BASE_URL} 
    />
  );
}
