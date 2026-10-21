import { NavLink, useNavigate } from "react-router-dom";
import useAPI from "../store/useAPI";

const SiteHero = () => {
  const { initializeUser } = useAPI();
  const navigate = useNavigate();

  return (
    <section className="hero-section">
      <div className="hero-content">
        <div className="hero-badge">
          <i className="fa-solid fa-sparkles"></i> 24/7 AI-Powered Compassionate
          Care
        </div>
        <h1 className="hero-title">
          A Safe Space for Your Mind & Heart.
          <span>Powered by AI & Human Support.</span>
        </h1>
        <p className="hero-subtitle">
          Express your feelings without judgment. Talk to our empathetic AI
          assistant and instantly connect with verified peer supporters when you
          need someone who truly understands.
        </p>
        <div className="hero-cta-group">
          <NavLink
            onClick={(e) => {
              (e.preventDefault(), initializeUser(navigate));
            }}
            to="/news-feed"
            className="btn btn-primary btn-pulse-glow"
            style={{ padding: "14px 30px", fontSize: "15px" }}
          >
            <i className="fa-solid fa-heart-pulse"></i> Get Emotional Support
          </NavLink>
          {/* <NavLink
            onClick={(e) => {
              (e.preventDefault(), initializeUser(navigate));
            }}
            to="/news-feed"
            className="btn btn-secondary"
            style={{ padding: "14px 30px", fontSize: "15px" }}
          >
            <i className="fa-solid fa-users"></i> Join Our Community
          </NavLink> */}
        </div>
      </div>

      <div className="hero-preview-card">
        <div className="preview-card-header">
          <div className="preview-ai-avatar">
            <i className="fa-solid fa-robot"></i>
          </div>
          <div>
            <h4 style={{ fontSize: "15px", fontWeight: "700" }}>Echo Mind</h4>
            <span
              style={{ fontSize: "12px", color: "#31a24c", fontWeight: "600" }}
            >
              ● Active & Listening
            </span>
          </div>
        </div>
        <div className="preview-chat-body">
          <div className="chat-bubble-mock chat-bubble-ai">
            Hey there! 👋 How is your heart and health feeling today? You can
            share anything with me.
          </div>
          <div className="chat-bubble-mock chat-bubble-user">
            I'm feeling really anxious and overwhelmed with work today...
          </div>
          <div className="chat-bubble-mock chat-bubble-ai">
            I hear you. Take a deep breath. 🌿 You don't have to carry this
            alone. I am connecting you with a peer supporter.
          </div>
          <div className="supporter-badge-mock">
            <img
              src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&auto=format&fit=crop&q=80"
              className="supporter-thumb"
              alt="Supporter"
            />
            <div>
              <h5 style={{ fontSize: "13px", fontWeight: "700" }}>
                Sarah Jenkins, M.S.
              </h5>
              <p style={{ fontSize: "11px", color: "var(--text-secondary)" }}>
                Matched Peer Listener · Ready to chat
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SiteHero;
