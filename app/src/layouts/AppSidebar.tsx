import useAPI from "../store/useAPI";
import useAppStore from "../store/useAppStore";
import usePost from "../store/usePost";

const AppSidebar = () => {
  const { user } = useAPI();
  const { isProfile, openAI, isAI } = useAppStore();
  const { totalPost, profile } = usePost();

  return (
    <aside className={`left-sidebar ${isProfile ? "active" : ""}`}>
      <div className="widget-card profile-summary-card">
        <div className="profile-cover"></div>
        <div className="profile-info">
          <img
            src="/icons/user.png"
            className="profile-avatar-large"
            alt="Profile"
          />
          <p className="profile-active-status">● ACTIVE NOW</p>
          <p className="profile-handle">@{user?.user_id}</p>
          <h3 className="profile-name">{user?.user_id}</h3>

          <div className="profile-stats">
            <div className="stat-item">
              <div className="stat-value">
                {profile?.followers || user?.user_followers?.length || 0}
              </div>
              <div className="stat-label">Followers</div>
            </div>
            <div className="stat-item">
              <div className="stat-value">
                {profile?.totalPost || totalPost || 0}
              </div>
              <div className="stat-label">Posts</div>
            </div>
            <div className="stat-item">
              <div className="stat-value">{profile?.reactions || 0}</div>
              <div className="stat-label">Reactions</div>
            </div>
          </div>
        </div>
      </div>

      <div className="widget-card">
        <ul className="sidebar-menu">
          <li className="menu-item active">
            <a
              onClick={(e) => {
                e.preventDefault();
                if (!isAI) return;
                openAI();
              }}
              href="#"
            >
              <i className="fa-solid fa-newspaper"></i> News Feed
            </a>
          </li>
          <li className="menu-item desk">
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                openAI();
              }}
              style={{ color: "var(--accent-color)", fontWeight: "700" }}
            >
              <i className="fa-solid fa-heart-pulse"></i> AI & Secret Chat
            </a>
          </li>
          <li className="menu-item">
            <a href="#">
              <i className="fa-solid fa-compass"></i> Explore
            </a>
          </li>
          <li className="menu-item">
            <a href="#">
              <i className="fa-solid fa-bookmark"></i> Bookmarks
            </a>
          </li>
          <li className="menu-item">
            <a href="#">
              <i className="fa-solid fa-user-group"></i> Groups
            </a>
          </li>
          <li className="menu-item">
            <a href="#">
              <i className="fa-solid fa-calendar-days"></i> Events
            </a>
          </li>
        </ul>
      </div>
    </aside>
  );
};

export default AppSidebar;
