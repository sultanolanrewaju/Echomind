import { useNavigate } from "react-router-dom";
import useAPI from "../store/useAPI";

const SiteFooter = () => {
  const { initializeUser } = useAPI();
  const navigate = useNavigate();

  return (
    <footer className="footer">
      <div className="footer-grid">
        <div className="footer-brand">
          <a href="#" className="brand-logo">
            <img src="/site-echomind.png" alt="Echo Mind" />
          </a>
          <p>
            A compassionate digital haven combining artificial intelligence with
            peer care for mental wellness and emotional support.
          </p>
        </div>

        <div>
          <h4 className="footer-title">Navigation</h4>
          <ul className="footer-links">
            <li>
              <a href="#how-it-works">How It Works</a>
            </li>
            <li>
              <a href="#features">Features</a>
            </li>
            <li>
              <a href="#simulator">AI Assistant</a>
            </li>
            <li>
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  initializeUser(navigate);
                }}
              >
                Safe Feed
              </a>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="footer-title">Community</h4>
          <ul className="footer-links">
            <li>
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  initializeUser(navigate);
                }}
              >
                Join Us
              </a>
            </li>
            <li>
              <a href="#">Become a Supporter</a>
            </li>
            <li>
              <a href="#">Safety Guidelines</a>
            </li>
            <li>
              <a href="#">Privacy Policy</a>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="footer-title">Emergency Crisis Notice</h4>
          <div className="crisis-card">
            <h5>
              <i className="fa-solid fa-circle-exclamation"></i> Immediate Help
            </h5>
            <p>
              If you are in immediate danger or experiencing an emergency
              crisis, please call your local hotline (988 in USA/Canada) or
              visit the nearest emergency room.
            </p>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <p>
          &copy; {new Date().getFullYear()} Echo Mind AI. All rights reserved.
        </p>
        <div style={{ display: "flex", gap: "16px" }}>
          <a href="#">
            <i className="fa-brands fa-twitter"></i>
          </a>
          <a href="#">
            <i className="fa-brands fa-facebook"></i>
          </a>
          <a href="#">
            <i className="fa-brands fa-instagram"></i>
          </a>
        </div>
      </div>
    </footer>
  );
};

export default SiteFooter;
