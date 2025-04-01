import { create } from "zustand";
import axios from "axios";

const API_BASE_URL = "http://localhost:5001"; 

const useChatStore = create((set) => ({
  chatHistory: [],
  selectedChat: null,

  fetchChatHistory: async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/chat/history`, { withCredentials: true });
      if (response.data.success) {
        set({ chatHistory: response.data.chats });
      }
    } catch (error) {
      console.error("Failed to fetch chat history:", error.response?.data || error.message);
    }
  },

  selectChat: (chat) => set({ selectedChat: chat }),
  
  deleteChat: async (chatId) => {
    try {
      const response = await axios.delete(`${API_BASE_URL}/api/chat/${chatId}`, { withCredentials: true });
      if (response.data.success) {
        set((state) => ({
          chatHistory: state.chatHistory.filter(chat => chat._id !== chatId)
        }));
      }
    } catch (error) {
      console.error("Failed to delete chat:", error.response?.data || error.message);
    }
  },
}));

export default useChatStore;
