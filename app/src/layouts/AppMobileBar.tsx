import useAppStore from "../store/useAppStore";

const AppMobileBar = () => {
  const { openAI, openProfile, isProfile } = useAppStore();
  return (
    <nav className="mobile-bottom-nav">
      <a
        onClick={(e) => {
          (e.preventDefault(), openAI());
        }}
        href="#"
        className="mobile-nav-item"
      >
        <i className="fa-solid fa-hand-holding-heart"></i>
        <span>AI Chat</span>
      </a>
      <a
        onClick={(e) => {
          e.preventDefault();
          openProfile();
        }}
        href="#"
        className={` mobile-nav-item ${!isProfile ? "active" : ""}`}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="lucide lucide-rss preview-icon"
        >
          <path d="M4 11a9 9 0 0 1 9 9" />
          <path d="M4 4a16 16 0 0 1 16 16" />
          <circle cx="5" cy="19" r="1" />
        </svg>
        <span>Lightbox</span>
      </a>
      <a href="#" className="mobile-nav-item">
        <i
          className="fa-solid fa-plus-circle"
          style={{ fontSize: "22px", color: "var(--accent-color)" }}
        ></i>
        <span>Post</span>
      </a>
      <a
        onClick={(e) => {
          e.preventDefault();
          openProfile();
        }}
        href="#"
        className={` mobile-nav-item ${isProfile ? "active" : ""}`}
      >
        <i className="fa-solid fa-user"></i>
        <span>Profile</span>
      </a>
      <a href="#" className="mobile-nav-item">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="lucide lucide-face-slightly-smiling-plus preview-icon"
        >
          <path d="M13.267 2.08a10 10 0 108.653 8.653" />
          <path d="M15 10V9" />
          <path d="M16 5h6" />
          <path d="M16.472 15a6 6 0 01-8.943 0" />
          <path d="M19 2v6" />
          <path d="M9 10V9" />
        </svg>
        <span>Avatar</span>
      </a>
    </nav>
  );
};

export default AppMobileBar;
