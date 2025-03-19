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
          messages: newMessages,
        });
  
        if (res.data.success) {
          const aiMessage = res.data.response.kwargs?.content || "No response";
          setMessages([...newMessages, { role: "assistant", content: aiMessage }]);
        }
      } catch (error) {
        console.error("Chat Error:", error);
      }
    };
  
    return (
        <div className="flex flex-col h-full">
          {/* Chat Messages Container */}
          <div className="flex-1 overflow-y-auto p-6 pb-20"> {/* Added pb-20 for input space */}
            <div className="flex flex-col space-y-4 max-w-4xl mx-auto">
              {messages.map((msg, index) => (
                <div
                  key={index}
                  className={`p-4 rounded-lg ${
                    msg.role === "user" 
                      ? "bg-primary text-primary-content ml-auto" 
                      : "bg-base-200 text-base-content"
                  }`}
                  style={{ maxWidth: 'min(90%, 48rem)' }}
                >
                  {msg.content}
                </div>
              ))}
            </div>
          </div>
    
          {/* Fixed Input Container */}
          <div className="fixed bottom-0 left-0 right-0 bg-base-300 border-t border-base-200">
            <div className="max-w-4xl mx-auto p-4">
              <div className="flex gap-2">
                <input
                  type="text"
                  className="flex-1 input input-bordered bg-base-100"
                  placeholder="Type your message..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                />
                <button 
                  className="btn btn-primary"
                  onClick={sendMessage}
                >
                  Send
                </button>
              </div>
            </div>
          </div>
        </div>
      );
    };
  
export default Chat;
