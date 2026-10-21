import { useState } from "react";
import { useNavigate } from "react-router-dom";
import useAPI from "../store/useAPI";

const FEELING_RESPONSES: Record<string, { response: string; match: string }> = {
  Anxious: {
    response:
      "Take a deep breath in... and out. It's completely valid to feel stressed. Let's get you connected to someone who can listen.",
    match: "Recommended match: Stress & Anxiety Peer Listener",
  },
  Lonely: {
    response:
      "You are not alone, even when the silence feels loud. There is a caring community here ready to share warmth with you.",
    match: "Recommended match: Compassionate Companion Listener",
  },
  Overwhelmed: {
    response:
      "One moment at a time. You do not have to figure out everything today. Let's gently unpack your thoughts together.",
    match: "Recommended match: Mindfulness & Grounding Peer",
  },
  Unwell: {
    response:
      "Rest is productive. Be gentle with your body and mind today. We're here to hold space for you while you recover.",
    match: "Recommended match: Wellness & Recovery Peer Supporter",
  },
};

const SiteFeeling = () => {
  const [selected, setSelected] = useState<string>("Anxious");
  const { initializeUser } = useAPI();
  const navigate = useNavigate();

  const currentData = FEELING_RESPONSES[selected] || FEELING_RESPONSES["Anxious"];

  return (
    <section className="section-container" id="simulator">
      <div className="section-header">
        <span className="section-tag">Interactive Preview</span>
        <h2 className="section-title">Try The Emotional Support Simulator</h2>
        <p className="section-desc">
          Click on what you are experiencing right now to see how Echo Mind responds
          with instant care.
        </p>
      </div>

      <div className="simulator-wrapper">
        <div>
          <h3
            style={{
              fontSize: "20px",
              fontWeight: "700",
              marginBottom: "16px",
            }}
          >
            Select how you're feeling:
          </h3>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
            <button
              className={`sim-tag-btn ${selected === "Anxious" ? "active" : ""}`}
              onClick={() => setSelected("Anxious")}
            >
              😰 Anxious & Stressed
            </button>
            <button
              className={`sim-tag-btn ${selected === "Lonely" ? "active" : ""}`}
              onClick={() => setSelected("Lonely")}
            >
              💔 Feeling Lonely
            </button>
            <button
              className={`sim-tag-btn ${selected === "Overwhelmed" ? "active" : ""}`}
              onClick={() => setSelected("Overwhelmed")}
            >
              🤯 Overwhelmed
            </button>
            <button
              className={`sim-tag-btn ${selected === "Unwell" ? "active" : ""}`}
              onClick={() => setSelected("Unwell")}
            >
              🤒 Physically Unwell
            </button>
          </div>
          <p
            style={{
              fontSize: "13px",
              color: "var(--text-secondary)",
              marginTop: "16px",
            }}
          >
            * Echo Mind uses AI sentiment evaluation to recommend appropriate coping
            strategies and supporter matches.
          </p>
        </div>

        <div className="sim-result-box">
          <div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                marginBottom: "12px",
                color: "var(--accent-primary)",
                fontWeight: "700",
                fontSize: "13px",
              }}
            >
              <i className="fa-solid fa-heart-pulse"></i> AI Care Response
            </div>
            <p
              id="simResponseText"
              style={{
                fontSize: "15px",
                color: "var(--text-primary)",
                fontWeight: "500",
                minHeight: "45px",
              }}
            >
              "{currentData.response}"
            </p>
          </div>
          <div
            style={{
              borderTop: "1px solid var(--border-color)",
              paddingTop: "12px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <span
              style={{ fontSize: "12px", color: "var(--text-secondary)" }}
              id="simSupporterStatus"
            >
              {currentData.match}
            </span>
            <button
              onClick={() => initializeUser(navigate)}
              className="btn btn-primary"
              style={{ padding: "6px 16px", fontSize: "12px", cursor: "pointer", border: "none" }}
            >
              Connect Now
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SiteFeeling;
