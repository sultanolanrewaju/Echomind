import { useState, useRef, useEffect } from "react";
import useAppStore from "../store/useAppStore";
import useAPI from "../store/useAPI";
import "../styles/ai-chat.css";

const AIChat = () => {
  const {
    isAI,
    openAI,
    onlineCount,
    activeChatTab,
    setActiveChatTab,
    aiMessages,
    isAITyping,
    sendAIMessage,
    secretStatus,
    secretPeer,
    secretMessages,
    secretPeerTyping,
    startSecretMatch,
    cancelSecretMatch,
    sendSecretMessage,
    leaveSecretChat,
  } = useAppStore();

  const { user } = useAPI();
  const [inputText, setInputText] = useState("");
  const chatEndRef = useRef<HTMLDivElement | null>(null);

  // Auto-scroll to bottom of chat when new messages arrive
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [aiMessages, secretMessages, isAITyping, secretStatus]);

  const handleSend = () => {
    const trimmed = inputText.trim();
    if (!trimmed) return;

    if (activeChatTab === "ai") {
      sendAIMessage(trimmed);
    } else if (activeChatTab === "secret" && secretStatus === "matched") {
      sendSecretMessage(trimmed);
    }
    setInputText("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <aside className={`sidebar-right ${isAI ? "active" : ""}`}>
      <div className="ai-widget-card">
        {/* Header */}
        <div className="ai-widget-header">
          <div className="ai-title-wrap">
            <div className="ai-icon-sparkle">
              <i className="fa-solid fa-heart-pulse"></i>
            </div>
            <div className="ai-header-text">
              <h3>Echo Mind AI</h3>
              <span>24/7 AI & Anonymous Peer Support</span>
            </div>
          </div>
          <button className="close-ai" onClick={openAI} title="Close">
            ✕
          </button>
        </div>

        <div className="ai-widget-body">
          {/* Mode Switcher Tabs */}
          <div className="chat-mode-tabs">
            <button
              onClick={() => setActiveChatTab("ai")}
              className={`chat-tab-btn ${
                activeChatTab === "ai" ? "active" : ""
              }`}
            >
              <i className="fa-solid fa-robot"></i> AI Companion
            </button>
            <button
              onClick={() => setActiveChatTab("secret")}
              className={`chat-tab-btn ${
                activeChatTab === "secret" ? "active" : ""
              }`}
            >
              <i className="fa-solid fa-user-secret"></i> Secret Match
              {secretStatus === "matched" && (
                <span
                  style={{
                    width: "6px",
                    height: "6px",
                    borderRadius: "50%",
                    background: "#10b981",
                    display: "inline-block",
                    marginLeft: "4px",
                  }}
                ></span>
              )}
            </button>
            <button
              onClick={openAI}
              title="Close Chat"
              className="notif-close-btn"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="red"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="lucide lucide-x preview-icon"
              >
                <path d="M18 6 6 18" />
                <path d="m6 6 12 12" />
              </svg>
            </button>
          </div>

          {/* ================= TAB 1: AI EMOTIONAL CHAT ================= */}
          {activeChatTab === "ai" && (
            <>
              <div
                className="ai-chat-box"
                style={{
                  flex: 1,
                  maxHeight: "calc(100% - 110px)",
                }}
              >
                {aiMessages.map((msg) => (
                  <div key={msg.id} className={`ai-msg ${msg.sender}`}>
                    <div className="ai-avatar">
                      <i
                        className={`fa-solid ${
                          msg.sender === "bot" ? "fa-robot" : "fa-user"
                        }`}
                      ></i>
                    </div>
                    <div className="ai-bubble">
                      <div>{msg.text}</div>
                      <span className="ai-timestamp">{msg.time}</span>
                    </div>
                  </div>
                ))}

                {isAITyping && (
                  <div className="ai-msg bot">
                    <div className="ai-avatar">
                      <i className="fa-solid fa-robot"></i>
                    </div>
                    <div
                      className="ai-bubble"
                      style={{
                        display: "flex",
                        gap: "4px",
                        alignItems: "center",
                      }}
                    >
                      <span
                        className="spinner"
                        style={{ width: "12px", height: "12px" }}
                      ></span>
                      <span
                        style={{
                          fontSize: "11px",
                          color: "var(--text-secondary)",
                        }}
                      >
                        Echo Mind is reflecting...
                      </span>
                    </div>
                  </div>
                )}
                <div ref={chatEndRef} />
              </div>

              {/* Quick Secret Match Suggestion Pill */}
              {/* <div style={{ textAlign: "center", margin: "2px 0 50px 0" }}>
                <button
                  onClick={() =>
                    startSecretMatch(user?.user_feeling || "Normal")
                  }
                  className="ai-pill-action"
                >
                  <i className="fa-solid fa-user-secret"></i> Need a human
                  listener? Find Secret Match
                </button>
              </div> */}

              {/* Input Area */}
              <div className="ai-input-area">
                <input
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Share how you're feeling..."
                />
                <button
                  onClick={handleSend}
                  className="ai-send-btn"
                  title="Send"
                >
                  <i className="fa-solid fa-paper-plane"></i>
                </button>
              </div>
            </>
          )}

          {/* ================= TAB 2: SECRET ANONYMOUS CHAT ================= */}
          {activeChatTab === "secret" && (
            <>
              {/* STATUS: IDLE */}
              {secretStatus === "idle" && (
                <div className="secret-match-card">
                  <div style={{ fontSize: "32px" }}>🤫</div>
                  <h4 style={{ fontSize: "15px", fontWeight: "700" }}>
                    Secret Peer Matching
                  </h4>
                  <p
                    style={{
                      fontSize: "12px",
                      color: "var(--text-secondary)",
                      lineHeight: 1.4,
                    }}
                  >
                    Looking for someone to talk to privately? Echo Mind connects
                    you 1-on-1 with an available anonymous peer listener.
                  </p>
                  <div
                    style={{
                      fontSize: "12px",
                      color: "#10b981",
                      fontWeight: "600",
                    }}
                  >
                    ● {onlineCount} {onlineCount === 1 ? "user" : "users"}{" "}
                    active in the safe space
                  </div>
                  <button
                    onClick={() =>
                      startSecretMatch(user?.user_feeling || "Normal")
                    }
                    className="btn btn-primary"
                    style={{
                      padding: "10px",
                      fontSize: "13px",
                      marginTop: "8px",
                    }}
                  >
                    <i className="fa-solid fa-magnifying-glass"></i> Find
                    Anonymous Match
                  </button>
                </div>
              )}

              {/* STATUS: SEARCHING */}
              {secretStatus === "searching" && (
                <div className="secret-match-card">
                  <div
                    className="spinner"
                    style={{ width: "28px", height: "28px", margin: "0 auto" }}
                  ></div>
                  <h4 style={{ fontSize: "14px", fontWeight: "700" }}>
                    Finding Your Match...
                  </h4>
                  <p
                    style={{ fontSize: "12px", color: "var(--text-secondary)" }}
                  >
                    Pairing you with a caring peer listener based on emotional
                    alignment.
                  </p>
                  <button
                    onClick={cancelSecretMatch}
                    className="btn-action-sm btn-danger-sm"
                    style={{ alignSelf: "center", padding: "8px 16px" }}
                  >
                    Cancel Search
                  </button>
                </div>
              )}

              {/* STATUS: MATCHED */}
              {secretStatus === "matched" && (
                <>
                  {/* Header Bar with Peer Info */}
                  <div className="secret-active-header">
                    <div
                      style={{
                        padding: 0,
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                      }}
                    >
                      <img
                        src="/icons/user.png"
                        alt="Peer"
                        style={{
                          width: "32px",
                          height: "32px",
                          borderRadius: "50%",
                        }}
                      />
                      <div>
                        <div style={{ fontSize: "13px", fontWeight: "700" }}>
                          {secretPeer?.alias}
                        </div>
                        <div style={{ fontSize: "10px", color: "#10b981" }}>
                          ● Feeling {secretPeer?.feeling || "Peaceful"}
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={leaveSecretChat}
                      className="btn-action-sm btn-danger-sm"
                      title="End Chat"
                    >
                      End Chat
                    </button>
                  </div>

                  {/* Messages Box */}
                  <div
                    className="ai-chat-box"
                    style={{ flex: 1, maxHeight: "calc(100% - 170px)" }}
                  >
                    {secretMessages.map((msg) => {
                      if (msg.senderID === "system") {
                        return (
                          <div key={msg.id} className="system-msg">
                            {msg.text}
                          </div>
                        );
                      }
                      return (
                        <div
                          key={msg.id}
                          className={`ai-msg ${msg.isMe ? "user" : "bot"}`}
                        >
                          <div className="ai-avatar">
                            <i className="fa-solid fa-user"></i>
                          </div>
                          <div className="ai-bubble">
                            <div
                              style={{
                                fontSize: "10px",
                                fontWeight: "900",
                                opacity: 0.8,
                                marginBottom: "2px",
                              }}
                            >
                              {msg.senderAlias}
                            </div>
                            <div style={{ fontWeight: "900" }}>{msg.text}</div>
                            <span className="ai-timestamp">{msg.time}</span>
                          </div>
                        </div>
                      );
                    })}
                    {secretPeerTyping && (
                      <div className="peer-typing-indicator">
                        Peer is typing...
                      </div>
                    )}
                    <div ref={chatEndRef} />
                  </div>

                  {/* Input Area */}
                  <div className="ai-input-area">
                    <input
                      type="text"
                      value={inputText}
                      onChange={(e) => setInputText(e.target.value)}
                      onKeyDown={handleKeyDown}
                      placeholder="Type a secret message..."
                    />
                    <button
                      onClick={handleSend}
                      className="ai-send-btn"
                      title="Send"
                    >
                      <i className="fa-solid fa-paper-plane"></i>
                    </button>
                  </div>
                </>
              )}

              {/* STATUS: ENDED */}
              {secretStatus === "ended" && (
                <div className="secret-match-card">
                  <div style={{ fontSize: "28px" }}>💙</div>
                  <h4 style={{ fontSize: "14px", fontWeight: "700" }}>
                    Secret Chat Concluded
                  </h4>
                  <p
                    style={{ fontSize: "12px", color: "var(--text-secondary)" }}
                  >
                    Your secret session has finished. You can connect with a new
                    peer or converse with Echo Mind.
                  </p>
                  <div
                    style={{
                      display: "flex",
                      gap: "8px",
                      justifyContent: "center",
                    }}
                  >
                    <button
                      onClick={() =>
                        startSecretMatch(user?.user_feeling || "Normal")
                      }
                      className="btn btn-primary"
                      style={{ padding: "8px 14px", fontSize: "12px" }}
                    >
                      Find New Match
                    </button>
                    <button
                      onClick={() => setActiveChatTab("ai")}
                      className="btn btn-secondary"
                      style={{ padding: "8px 14px", fontSize: "12px" }}
                    >
                      Talk to AI
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </aside>
  );
};

export default AIChat;
