import React, { useState, useEffect } from "react";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";
import "bootstrap-icons/font/bootstrap-icons.css";
import AppRoutes from "./components/Route/route.jsx";

function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate a delay (e.g., data fetching or app initialization)
    const timer = setTimeout(() => {
      setLoading(false);
    }, 3000); // 3 seconds delay

    return () => clearTimeout(timer); // Cleanup the timer
  }, []);

  return (
    <div>
      {loading ? (
        // Custom Loader
        <div className="loader-container">
          <span className="loader"></span>
        </div>
      ) : (
        // Main App Content (Routes)
        <AppRoutes />
      )}
    </div>
  );
}

export default App;
