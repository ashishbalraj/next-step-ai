"use client";

import ReactMarkdown from "react-markdown";
import { useState, useRef, useEffect } from "react";
import styles from "./ChatbotContent.module.css";
import { Send } from "lucide-react";

type Message = {
  sender: "user" | "bot";
  text: string;
};

export default function ChatbotContent() {
  const [messages, setMessages] = useState<Message[]>([
    {
      sender: "bot",
      text: "Hello! I'm your career assistant. How can I help you today?",
    },
  ]);

  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim() || loading) return;

    const userMsg = input;

    // Add user message
    setMessages((prev) => [
      ...prev,
      {
        sender: "user",
        text: userMsg,
      },
    ]);

    setInput("");

    // Show typing message
    setMessages((prev) => [
      ...prev,
      {
        sender: "bot",
        text: "Typing...",
      },
    ]);

    setLoading(true);

    try {
      const response = await fetch(
        "http://localhost:5000/api/chatbot/chat",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            message: userMsg,
          }),
        }
      );

      const data = await response.json();

      // Remove typing message
      setMessages((prev) => prev.slice(0, -1));

      // Add bot response
      setMessages((prev) => [
        ...prev,
        {
          sender: "bot",
          text: data.reply || "Sorry, I couldn't understand that.",
        },
      ]);
    } catch (error) {
      console.error(error);

      // Remove typing message
      setMessages((prev) => prev.slice(0, -1));

      setMessages((prev) => [
        ...prev,
        {
          sender: "bot",
          text: "Server error. Try again later.",
        },
      ]);
    }

    setLoading(false);
  };

  return (
    <section className={styles.section}>
      <div className={styles.chatContainer}>
        <h1 className={styles.heading}>Career Chat Assistant</h1>

        <div className={styles.chatBox}>
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`${styles.message} ${
                msg.sender === "user"
                  ? styles.userMessage
                  : styles.botMessage
              }`}
            >
              <ReactMarkdown>
                {msg.text}
              </ReactMarkdown>
            </div>
          ))}

          <div ref={messagesEndRef}></div>
        </div>

        <div className={styles.inputArea}>
          <input
            type="text"
            className={styles.input}
            placeholder="Type your message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                sendMessage();
              }
            }}
          />

          <button
            className={styles.sendButton}
            onClick={sendMessage}
            disabled={loading}
          >
            <Send size={20} />
          </button>
        </div>
      </div>
    </section>
  );
}