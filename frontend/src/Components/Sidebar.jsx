
import React, { useEffect } from "react";
import { NavLink } from "react-router-dom";
import useChatStore from "../store/UseChatStore";

const Sidebar = ({ isOpen, setIsOpen }) => {
  const { chatHistory, fetchChatHistory, selectChat, deleteChat } = useChatStore();

  useEffect(() => {
    fetchChatHistory();
  }, [fetchChatHistory]);

  return (
    <div className="h-full p-8 relative">
      {/* Close Button */}
      <button
        className="absolute top-4 right-4 btn btn-error btn-sm"
        onClick={() => setIsOpen(false)}
      >
        ✖
      </button>

      {/* Sidebar Content */}
      <h2 className="text-2xl font-bold mb-4">Chatbot</h2>
      <ul className="space-y-2">
        <li>
          <NavLink
            to="/"
            className={({ isActive }) =>
              `p-2 block rounded text-2xl ${isActive ? 'bg-primary text-primary-content' : 'hover:bg-base-200'}`
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
              `p-2 block rounded text-2xl ${isActive ? 'bg-primary text-primary-content' : 'hover:bg-base-200'}`
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
              `p-2 block rounded text-xl ${isActive ? 'bg-primary text-primary-content' : 'hover:bg-base-200'}`
            }
            onClick={() => setIsOpen(false)}
          >
            Settings
          </NavLink>
        </li>
      </ul>

      {/* Chat History Section */}
      <h2 className="mt-4 text-lg font-bold">Chat History</h2>
      <ul className="space-y-2">
        {chatHistory.map((chat, index) => (
          <li key={index} className="flex justify-between items-center p-2 bg-base-200 rounded">
            <span
              className="cursor-pointer text-blue-500 hover:underline"
              onClick={() => selectChat(chat)}
            >
              Chat {index + 1}
            </span>
            <button
              className="btn btn-error btn-xs ml-2"
              onClick={() => deleteChat(chat._id)}
            >
              🗑️
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Sidebar;