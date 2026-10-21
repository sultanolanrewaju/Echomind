import { useRef } from "react";
import useAPI from "../store/useAPI";
import { useNavigate } from "react-router-dom";

const SiteHeader = () => {
  const navigate = useNavigate();
  const { initializeUser } = useAPI();
  const drawer = useRef<HTMLDivElement | null>(null);
  const overly = useRef<HTMLDivElement | null>(null);

  const toggleMobile = (): void => {
    drawer.current?.classList.toggle("active");
    overly.current?.classList.toggle("active");
  };
  return (
    <>
      <header className="navbar">
        <a href="#" className="brand-logo">
          <img src="/site-echomind.png" alt="Echo Mind" />{" "}
        </a>

        <ul className="nav-links">
          <li>
            <a href="#how-it-works" className="nav-link">
              How It Works
            </a>
          </li>
          <li>
            <a href="#features" className="nav-link">
              Features
            </a>
          </li>
          <li>
            <a href="#simulator" className="nav-link">
              AI Support
            </a>
          </li>
          <li>
            <a href="#testimonials" className="nav-link">
              Community
            </a>
          </li>
        </ul>

        <div className="nav-actions">
          <a
            onClick={(e) => {
              e.preventDefault(), initializeUser(navigate);
            }}
            href="#"
            className="btn btn-primary btn-pulse-glow"
          >
            <i className="fa-solid fa-heart-pulse"></i> Get Emotional Support
          </a>
          <div onClick={toggleMobile} className="mobile-hamburger">
            <i className="fa-solid fa-bars"></i>
          </div>
        </div>
      </header>
      <div
        onClick={toggleMobile}
        ref={overly}
        className="mobile-nav-overlay"
        id="mobileOverlay"
      ></div>
      <div ref={drawer} className="mobile-nav-drawer" id="mobileDrawer">
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <a href="#" className="brand-logo">
            <img src="/icons/echo-mind.png" alt="Echo Mind" />
          </a>
          <i
            onClick={toggleMobile}
            className="fa-solid fa-xmark"
            style={{ fontSize: "20px", cursor: "pointer" }}
          ></i>
        </div>
        <ul
          className="nav-links"
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            gap: "20px",
          }}
        >
          <li>
            <a href="#how-it-works" className="nav-link">
              How It Works
            </a>
          </li>
          <li>
            <a href="#features" className="nav-link">
              Features
            </a>
          </li>
          <li>
            <a href="#simulator" className="nav-link">
              AI Support
            </a>
          </li>
          <li>
            <a href="#testimonials" className="nav-link">
              Community
            </a>
          </li>
        </ul>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "12px",
            marginTop: "auto",
          }}
        >
          <a
            onClick={(e) => {
              e.preventDefault(), initializeUser(navigate);
            }}
            href="#"
            className="btn btn-primary"
            style={{ width: "100%" }}
          >
            Get Emotional Support
          </a>
        </div>
      </div>
    </>
  );
};

export default SiteHeader;
