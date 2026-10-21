import useAPI from "../store/useAPI";
import useAppStore from "../store/useAppStore";

const AppHeader = () => {
  const { toggleTheme, isDark } = useAPI();
  const { openNotification, notifications, onlineCount, openSecretChat } =
    useAppStore();

  return (
    <header className="navbar">
      <div className="left-bar">
        <a href="#" className="nav-brand">
          <div className="brand-logo">
            <img src="/site-echomind.png" alt="Echo Mind" />
          </div>
        </a>

        <div className="nav-search">
          <i className="fa-solid fa-magnifying-glass search-icon"></i>
          <input type="text" placeholder="Search echoes, thoughts, topics..." />
        </div>
      </div>

      <div className="nav-actions">
        {/* Real-time Online Users Badge */}
        <div
          title={`${onlineCount} anonymous users online now`}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            fontSize: "12px",
            background: "var(--bg-input)",
            padding: "10px 12px",
            borderRadius: "16px",
            color: "var(--text-secondary)",
            fontWeight: "900",
          }}
        >
          <div className="circle-container">
            <div className="glowing-circle"></div>
          </div>
          <span>{onlineCount} Online</span>
        </div>

        <button
          onClick={toggleTheme}
          className="icon-btn"
          id="themeToggle"
          title="Toggle Light/Dark Theme"
        >
          {isDark ? (
            <i className="fa-solid fa-sun"></i>
          ) : (
            <i className="fa-solid fa-moon"></i>
          )}
        </button>

        <button
          onClick={openSecretChat}
          className="icon-btn secret-chat"
          title="Messages"
        >
          <i className="fa-solid fa-paper-plane"></i>
          {/* <span className="badge-dot"></span> */}
        </button>

        <button
          onClick={openNotification}
          className="icon-btn"
          title="Notifications"
        >
          <i className="fa-solid fa-bell"></i>
          {notifications?.length > 0 && (
            <span className="badge-dot">{notifications?.length}</span>
          )}
        </button>

        <div className="nav-user">
          <div className="avatar-wrap">
            <img src="/icons/user.png" alt="User Avatar" className="avatar" />
            <span className="online-ring"></span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default AppHeader;
