import { useState } from "react";
import "./Chatbot.css";

const API_URL = "http://localhost:8080";

function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([
    {
      sender: "bot",
      text: "Hi! 👋 Welcome to IceCreamGodown Inventory Assistant. Ask me about your products, stock, low-stock alerts, or today's transactions.",
    },
  ]);
  const [loading, setLoading] = useState(false);

  const sendMessage = async (event) => {
    event.preventDefault();

    const question = message.trim();

    if (!question || loading) return;

    setMessages((previous) => [
      ...previous,
      { sender: "user", text: question },
    ]);

    setMessage("");
    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/api/chatbot`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: question }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.reply || "Unable to get a response.");
      }

      setMessages((previous) => [
        ...previous,
        { sender: "bot", text: data.reply },
      ]);
    } catch (error) {
      setMessages((previous) => [
        ...previous,
        {
          sender: "bot",
          text:
            error.message ||
            "Unable to connect to the server. Please try again.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="chatbot-container">
      {isOpen && (
        <div className="chatbot-window">
          <div className="chatbot-header">
            <div>
              <h3>🍦 Inventory Assistant</h3>
              <span>Ask about your inventory</span>
            </div>

            <button
              type="button"
              className="chatbot-close"
              onClick={() => setIsOpen(false)}
              aria-label="Close chatbot"
            >
              ×
            </button>
          </div>

          <div className="chatbot-messages">
            {messages.map((item, index) => (
              <div
                key={index}
                className={`chatbot-message ${item.sender}`}
              >
                {item.text}
              </div>
            ))}

            {loading && (
              <div className="chatbot-message bot">
                Thinking...
              </div>
            )}
          </div>

          <div className="chatbot-suggestions">
            {[
              "How many products do we have?",
              "Show low stock products",
              "Show all products",
              "Today's stock IN and OUT",
            ].map((question) => (
              <button
                type="button"
                key={question}
                disabled={loading}
                onClick={() => {
                  setMessage(question);
                }}
              >
                {question}
              </button>
            ))}
          </div>

          <form className="chatbot-input" onSubmit={sendMessage}>
            <input
              type="text"
              value={message}
              onChange={(event) => setMessage(event.target.value)}
              placeholder="Ask about your inventory..."
              aria-label="Message"
              disabled={loading}
            />

            <button type="submit" disabled={loading || !message.trim()}>
              Send
            </button>
          </form>
        </div>
      )}

      <button
        type="button"
        className="chatbot-toggle"
        onClick={() => setIsOpen((previous) => !previous)}
        aria-label="Open Inventory Assistant"
      >
        {isOpen ? "×" : "💬"}
      </button>
    </div>
  );
}

export default Chatbot;