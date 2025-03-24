import React from "react";
import { NavLink } from "react-router-dom";

const Sidebar = ({ isOpen, setIsOpen }) => {
    return (
      <div className="h-full p-8">
        {/* Close Button */}
        <button
          className="absolute top-4 right-4 btn btn-error btn-sm "
          onClick={() => setIsOpen(false)}
        >
          ✖
        </button>
  
        {/* Sidebar Content */}
        <h2 className="text-2xl font-bold mb-4 ">Chatbot</h2>
        <ul className="space-y-2">
          <li>
            <NavLink
              to="/"
              className={({ isActive }) => 
                `p-2 block rounded  text-2xl ${isActive 
                  ? 'bg-primary text-primary-content' 
                  : 'hover:bg-base-200'}`
              }
              onClick={() => setIsOpen(false)}
            >
              Home
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/about"
              className={({ isActive }) => 
                `p-2 block rounded text-2xl  ${isActive 
                  ? 'bg-primary text-primary-content' 
                  : 'hover:bg-base-200'}`
              }
              onClick={() => setIsOpen(false)}
            >
              About
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/settings"
              className={({ isActive }) => 
                `p-2 block rounded  text-xl ${isActive 
                  ? 'bg-primary text-primary-content' 
                  : 'hover:bg-base-200'}`
              }
              onClick={() => setIsOpen(false)}
            >
              Settings
            </NavLink>
          </li>
        </ul>
      </div>
    );
  };

export default Sidebar;
