import { create } from "zustand";
import axios from "axios";

const API_BASE_URL = "http://localhost:5001"; 

const useAuthStore = create((set) => ({
  user: null,

login: async (email, password) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/api/auth/login`, { email, password });

    console.log("Login response:", response.data); 

    if (response.data.success) {
      set({ user: { email } });
      return true;
    }

    return false;
  } catch (error) {
    console.error("Login failed:", error.response?.data || error.message);
    return false;
  }
},

  signup: async (name, email, password) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/api/auth/signup`, { name, email, password });
      set({ user: response.data.user });
      return true;
    } catch (error) {
      console.error("Signup failed:", error.response?.data || error.message);
      return false;
    }
  },

  logout: () => set({ user: null }),
}));

export default useAuthStore;
