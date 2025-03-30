import { useState, useEffect } from "react";
import axios from "axios";
import useAuthStore from "../store/useAuthStore";
import useChatStore from "../store/UseChatStore";

const Chat = () => {
  const { user } = useAuthStore();
  const { selectedChat } = useChatStore();
  
  const [messages, setMessages] = useState([]); 
  const [input, setInput] = useState("");
  const [error, setError] = useState("");
  const [resetTimestamp, setResetTimestamp] = useState(null);
  const [timeLeft, setTimeLeft] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!resetTimestamp) return;

    const interval = setInterval(() => {
      const now = Date.now();
      const remainingTime = Math.max(0, Math.ceil((resetTimestamp - now) / 1000));

      setTimeLeft(remainingTime);

      if (remainingTime <= 0) {
        setResetTimestamp(null);
        setError(""); 
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [resetTimestamp]);

  useEffect(() => {
    if (selectedChat) {
      setMessages(selectedChat.messages || []); 
    }
  }, [selectedChat]);

  const sendMessage = async () => {
    if (!input.trim() || loading) return;

    const userMessage = { role: "user", content: input };

    console.log("Before sending:", messages);  
    console.log("Sending:", input); 

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setError("");
    setLoading(true);

    try {
        const res = await axios.post(
            "http://localhost:5001/api/chat",
            { messages: [...messages, userMessage], chatId: selectedChat?._id }, // Ensure chatId is included
            {
                headers: {
                    Authorization: `Bearer ${user?.token}`,
                },
                withCredentials: true,
            }
        );

        console.log("API Response:", res.data); 

        if (res.data.success) {
            const assistantMessage = {
                role: "assistant",
                content: res.data.response || "Nani?!",
                isVegeta: true
            };

            setMessages((prev) => [...prev, assistantMessage]);

            console.log("After response:", messages); 
        } else {
            setError("Unexpected error: Response not successful.");
        }
    } catch (error) {
        console.error("Error:", error);

        if (error.response?.status === 429) {
            const serverResetTime = error.response.data.resetTimestamp;
            setResetTimestamp(serverResetTime);
        } else {
            setError("Vegeta's scouter is broken! Try again later.");
        }
    } finally {
        setLoading(false);
    }
};

  const messagesUsed = messages.filter((m) => m.role === "user").length || 0;
  const limitReached = resetTimestamp !== null;

  return (
    <div className="flex flex-col h-full">
      {error && (
        <div className="fixed top-4 right-4 z-50 alert alert-error shadow-lg max-w-md">
          <div className="flex items-center">
            <span className="ml-2">
              {limitReached ? `Wait ${timeLeft}s` : error}
            </span>
          </div>
        </div>
      )}

      <div className="flex-1 overflow-y-auto p-6 pb-20">
        <div className="max-w-4xl mx-auto space-y-4">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`p-4 rounded-lg ${
                msg.role === "user"
                  ? "ml-auto bg-primary text-primary-content max-w-[80%]"
                  : "bg-error text-error-content font-bold border-2 border-neutral max-w-[80%]"
              }`}
            >
              {msg.isVegeta && <span className="mr-2">👑</span>}
              {msg.content}
              {msg.isVegeta && <span className="ml-2">💥</span>}
            </div>
          ))}

          {loading && (
            <div className="text-center">
              <span className="loading loading-spinner text-primary"></span>
            </div>
          )}
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-base-300 border-t border-base-200">
        <div className="max-w-4xl mx-auto p-4">
          <div className="flex gap-2">
            <input
              type="text"
              className="flex-1 input input-bordered"
              placeholder="Address the Prince of all Saiyans..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              disabled={limitReached || loading}
            />
            <button
              className="btn btn-error"
              onClick={sendMessage}
              disabled={limitReached || loading}
            >
              {loading ? "Loading..." : "SEND TO VEGETA"}
            </button>
          </div>
          <div className="text-sm text-neutral-content mt-2 text-center">
            {limitReached ? `0 messages left - Wait ${timeLeft}s` : `${5 - messagesUsed} messages remaining`}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chat;
