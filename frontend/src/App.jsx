import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Sidebar from "./Components/Sidebar";
import Home from "./Pages/Home.jsx";
import About from "./Pages/About.jsx";
import Settings from "./Pages/Settings.jsx";
import useThemeStore from "./store/themeStore.js";

function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const { fetchTheme } = useThemeStore();

  useEffect(() => {
    fetchTheme();
  }, [fetchTheme]);
  return (
    <Router>
      <div className="h-screen flex bg-base-100">
        {/* Sidebar */}
        <div
          className={`fixed inset-y-0 left-0 w-60 h-full bg-base-300 shadow-lg transition-transform duration-300 ease-in-out z-40
          ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}`}
        >
          <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
        </div>

        {/* Main Content Area */}
        <div className="flex-1 h-full overflow-auto">
          {/* Burger Button - Part of main content layout */}
          {!isSidebarOpen && (
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
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/settings" element={<Settings />} />
            </Routes>
          </div>
        </div>
      </div>
    </Router>
  );
}

export default App;
