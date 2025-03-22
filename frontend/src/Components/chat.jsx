import { useState } from "react";
import axios from "axios";

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const sendMessage = async () => {
    if (!input.trim()) return;
  
    const userMessage = { role: "user", content: input };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput("");
  
    try {
      const res = await axios.post("http://localhost:5001/api/chat", {
        messages: newMessages
      });
  
      if (res.data.success) {
        const aiMessage = res.data.response || "Nani?!";
        setMessages([...newMessages, { 
          role: "assistant", 
          content: aiMessage,
          isVegeta: true 
        }]);
      }
    } catch (error) {
      console.error("Chat Error:", error);
    }
  };
  

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto p-6 pb-20">
        <div className="max-w-4xl mx-auto">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`p-4 rounded-lg my-2 ${
                msg.role === "user" 
                  ? "ml-auto bg-primary text-primary-content" 
                  : "bg-error text-error-content font-bold border-2 border-neutral"
              }`}
              style={{
                fontFamily: msg.isVegeta ? "'Noto Sans JP', sans-serif" : "inherit",
                transform: msg.isVegeta ? "skewX(-5deg)" : "none"
              }}
            >
              {msg.isVegeta && "👑 "}
              {msg.content}
              {msg.isVegeta && " 💥"}
            </div>
          ))}
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
              onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
            />
            <button 
              className="btn btn-error"
              onClick={sendMessage}
            >
              SEND TO VEGETA
            </button>
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