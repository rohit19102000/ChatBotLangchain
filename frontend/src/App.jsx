import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Sidebar from "./Components/Sidebar";
import Home from "./Pages/Home.jsx";
import About from "./Pages/About.jsx";
import Settings from "./Pages/Settings.jsx";
import Login from "./Pages/Login.jsx";
import Signup from "./Pages/Signup.jsx";
import useThemeStore from "./store/themeStore.js";
import useAuthStore from "./store/useAuthStore.js";

function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { fetchTheme } = useThemeStore();
  const user = useAuthStore((state) => state.user);

  useEffect(() => {
    fetchTheme();
  }, [fetchTheme]);

  return (
    <Router>
      <div className="h-screen flex bg-base-100">
        {/* Sidebar - Only show when logged in */}
        {user && (
          <div
            className={`fixed inset-y-0 left-0 w-60 h-full bg-base-300 shadow-lg transition-transform duration-300 ease-in-out z-40
            ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}`}
          >
            <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
          </div>
        )}

        {/* Main Content Area */}
        <div className="flex-1 h-full overflow-auto">
          {/* Burger Button */}
          {user && !isSidebarOpen && (
            <button
              className="fixed top-4 left-4 z-50 btn btn-primary btn-sm"
              onClick={() => setIsSidebarOpen(true)}
            >
              ☰
            </button>
          )}

          {/* Content Container */}
          <div className={`pt-16 px-4 ${isSidebarOpen ? "pl-4" : "pl-4"}`}>
            <Routes>
              {/* Public Routes */}
              <Route path="/login" element={user ? <Navigate to="/" /> : <Login />} />
              <Route path="/signup" element={user ? <Navigate to="/" /> : <Signup />} />

              {/* Private Routes - Only accessible if logged in */}
              <Route path="/" element={user ? <Home /> : <Navigate to="/login" />} />
              <Route path="/about" element={user ? <About /> : <Navigate to="/login" />} />
              <Route path="/settings" element={user ? <Settings /> : <Navigate to="/login" />} />
            </Routes>
          </div>
        </div>
      </div>
    </Router>
  );
}

export default App;
