
import { useState, useEffect } from "react";
import axios from "axios";

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [error, setError] = useState("");
  const [resetTimestamp, setResetTimestamp] = useState(null);
  const [timeLeft, setTimeLeft] = useState(null);
  const [loading, setLoading] = useState(false);

  // Effect to update countdown timer dynamically
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


  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const sendMessage = async () => {
    if (!input.trim() || loading) return;

    const userMessage = { role: "user", content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setError("");
    setLoading(true);

    try {
      const res = await axios.post("http://localhost:5001/api/chat", {
        messages: [...messages, userMessage],
      });

      if (res.data.success) {
        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: res.data.response || "Nani?!", isVegeta: true },
        ]);
      }
    } catch (error) {
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

  const messagesUsed = messages.filter((m) => m.role === "user").length;
  const limitReached = resetTimestamp !== null;

  return (
    <div className="flex flex-col h-full">
      {error && (
        <div className="fixed top-4 right-4 z-50 alert alert-error shadow-lg max-w-md">
          <div className="flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current flex-shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="ml-2">
              {limitReached ? `Wait ${formatTime(timeLeft)}` : error}
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
              style={{
                fontFamily: msg.isVegeta ? "'Noto Sans JP', sans-serif" : "inherit",
                transform: msg.isVegeta ? "skewX(-5deg)" : "none",
                wordBreak: "break-word",
              }}
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
            {limitReached ? `0 messages left - Wait ${formatTime(timeLeft)}` : `${5 - messagesUsed} messages remaining`}
          </div>
        </div>
      </div>

      <style>
        {`@import url('https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@500&display=swap');`}
      </style>
    </div>
  );
};

export default Chat;

