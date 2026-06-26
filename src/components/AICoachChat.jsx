import React, { useState, useEffect, useRef } from "react";

const API_BASE = "https://eeg-sqdw.onrender.com";

/**
 * Maps section titles from the Results scoring to the 0-100 scale
 * that the agent expects (percentile values).
 */
function buildScores(results) {
  const map = {};
  results.sections.forEach((sec) => {
    const title = sec.sectionTitle.toLowerCase();
    if (title.includes("depression")) map.depression = sec.percentile;
    else if (title.includes("anxiety")) map.anxiety = sec.percentile;
    else if (title.includes("stress")) map.stress = sec.percentile;
    else if (title.includes("attention")) map.attention = 100 - sec.percentile; // invert: higher = better attention
  });
  return {
    depression: map.depression ?? 0,
    anxiety:    map.anxiety    ?? 0,
    stress:     map.stress     ?? 0,
    attention:  map.attention  ?? 100,
  };
}

export default function AICoachChat({ results, formAnswers }) {
  const scores = buildScores(results);

  const [messages, setMessages]       = useState([]);
  const [questions, setQuestions]     = useState([]);
  const [primaryConcern, setPrimary]  = useState("");
  const [inputText, setInputText]     = useState("");
  const [loading, setLoading]         = useState(false);
  const [started, setStarted]         = useState(false);
  const [error, setError]             = useState(null);
  const [answeredQs, setAnsweredQs]   = useState([]); // track which quick-replies were clicked
  const [agentAnswers, setAgentAnswers] = useState({}); // answers collected via quick-reply

  const chatEndRef = useRef(null);
  const inputRef   = useRef(null);

  // Scroll to bottom whenever messages change
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  // Auto-start the session when component mounts
  useEffect(() => {
    startSession();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function startSession() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_BASE}/api/start`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...scores, answers: formAnswers }),
      });
      if (!res.ok) throw new Error(`Server error: ${res.status}`);
      const data = await res.json();

      setMessages([{ role: "coach", text: data.message }]);
      setQuestions(data.questions || []);
      setPrimary(data.primaryConcern || "");
      setStarted(true);
    } catch (err) {
      setError(
        "⚠️ Could not connect to the AI Coach. Please make sure the backend server is running (python AIAgent/server.py)."
      );
    } finally {
      setLoading(false);
    }
  }

  function buildHistory(msgs) {
    return msgs.map((m) =>
      m.role === "coach" ? `Coach: ${m.text}` : `You: ${m.text}`
    );
  }

  async function sendMessage(text) {
    if (!text.trim() || loading) return;
    const userMsg = { role: "user", text };
    const newMsgs = [...messages, userMsg];
    setMessages(newMsgs);
    setInputText("");
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`${API_BASE}/api/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...scores,
          answers: { ...formAnswers, ...agentAnswers },
          message: text,
          history: buildHistory(newMsgs),
        }),
      });
      if (!res.ok) throw new Error(`Server error: ${res.status}`);
      const data = await res.json();
      setMessages((prev) => [...prev, { role: "coach", text: data.reply }]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { role: "coach", text: "I'm having trouble connecting right now. Please try again in a moment." },
      ]);
    } finally {
      setLoading(false);
      inputRef.current?.focus();
    }
  }

  function handleQuickReply(question, index) {
    if (answeredQs.includes(index) || loading) return;
    setAnsweredQs((prev) => [...prev, index]);
    // Send the question as the user message (so the AI sees it)
    sendMessage(question);
  }

  function handleKeyDown(e) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage(inputText);
    }
  }

  const concernColor = {
    "Depression":       "#a78bfa",
    "Anxiety":          "#f472b6",
    "Stress":           "#fb923c",
    "Attention Deficit":"#34d399",
  };
  const accentColor = concernColor[primaryConcern] || "#60a5fa";

  return (
    <div className="ai-coach-wrapper">
      {/* Header */}
      <div className="ai-coach-header" style={{ borderColor: accentColor }}>
        <div className="ai-coach-avatar" style={{ background: `${accentColor}22`, borderColor: accentColor }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={accentColor} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 2a7 7 0 0 1 7 7c0 3-1.5 5.5-4 6.8V18H9v-2.2C6.5 14.5 5 12 5 9a7 7 0 0 1 7-7z"/>
            <line x1="9" y1="22" x2="15" y2="22"/>
            <line x1="12" y1="18" x2="12" y2="22"/>
          </svg>
        </div>
        <div className="ai-coach-header-text">
          <h3 className="ai-coach-title">AI Wellness Coach</h3>
          <p className="ai-coach-subtitle">
            {primaryConcern
              ? <>Focused on: <span style={{ color: accentColor, fontWeight: 600 }}>{primaryConcern}</span></>
              : "Personalised mental wellness guidance"}
          </p>
        </div>
        <div className="ai-coach-status">
          <span className="ai-status-dot" style={{ background: error ? "#f87171" : accentColor }} />
          <span className="ai-status-label">{error ? "Offline" : "Online"}</span>
        </div>
      </div>

      {/* Error banner */}
      {error && (
        <div className="ai-error-banner">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
          {error}
        </div>
      )}

      {/* Chat messages */}
      <div className="ai-chat-messages">
        {messages.map((msg, i) => (
          <div key={i} className={`ai-chat-bubble-row ${msg.role === "user" ? "user-row" : "coach-row"}`}>
            {msg.role === "coach" && (
              <div className="ai-bubble-avatar" style={{ background: `${accentColor}22`, borderColor: accentColor }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={accentColor} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 2a7 7 0 0 1 7 7c0 3-1.5 5.5-4 6.8V18H9v-2.2C6.5 14.5 5 12 5 9a7 7 0 0 1 7-7z"/>
                </svg>
              </div>
            )}
            <div className={`ai-chat-bubble ${msg.role === "user" ? "bubble-user" : "bubble-coach"}`}
              style={msg.role === "user" ? { background: accentColor } : {}}>
              {msg.text.split("\n").map((line, li) => (
                <span key={li}>
                  {line}
                  {li < msg.text.split("\n").length - 1 && <br />}
                </span>
              ))}
            </div>
          </div>
        ))}

        {/* Typing indicator */}
        {loading && (
          <div className="ai-chat-bubble-row coach-row">
            <div className="ai-bubble-avatar" style={{ background: `${accentColor}22`, borderColor: accentColor }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={accentColor} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2a7 7 0 0 1 7 7c0 3-1.5 5.5-4 6.8V18H9v-2.2C6.5 14.5 5 12 5 9a7 7 0 0 1 7-7z"/>
              </svg>
            </div>
            <div className="ai-chat-bubble bubble-coach ai-typing-bubble">
              <span className="typing-dot" />
              <span className="typing-dot" />
              <span className="typing-dot" />
            </div>
          </div>
        )}

        <div ref={chatEndRef} />
      </div>

      {/* Quick-reply question chips */}
      {started && questions.length > 0 && (
        <div className="ai-quickreply-section">
          <p className="ai-quickreply-label">Tap a question to answer:</p>
          <div className="ai-quickreply-chips">
            {questions.map((q, idx) => (
              <button
                key={idx}
                className={`ai-quickreply-chip ${answeredQs.includes(idx) ? "chip-answered" : ""}`}
                onClick={() => handleQuickReply(q, idx)}
                disabled={answeredQs.includes(idx) || loading}
                style={!answeredQs.includes(idx) ? { borderColor: accentColor, color: accentColor } : {}}
              >
                {answeredQs.includes(idx) && (
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>
                )}
                {q}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input row */}
      <div className="ai-chat-input-row">
        <textarea
          ref={inputRef}
          className="ai-chat-input"
          placeholder="Type your message… (Enter to send)"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyDown={handleKeyDown}
          rows={1}
          disabled={loading || !!error}
        />
        <button
          className="ai-send-btn"
          onClick={() => sendMessage(inputText)}
          disabled={!inputText.trim() || loading || !!error}
          style={{ background: accentColor }}
          aria-label="Send message"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="22" y1="2" x2="11" y2="13"/>
            <polygon points="22 2 15 22 11 13 2 9 22 2"/>
          </svg>
        </button>
      </div>

      <p className="ai-disclaimer">
        🔒 This is an AI coach, not a licensed therapist. For serious concerns, please seek professional help.
      </p>
    </div>
  );
}
