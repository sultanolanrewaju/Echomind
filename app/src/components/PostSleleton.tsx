import useAPI from "../store/useAPI";
import "../styles/skeleton.css";

const PostSleleton = () => {
  const { isDark } = useAPI();
  return (
    <div className={`${isDark ? "theme-dark" : "theme-light"}`}>
      <div className="sk-post-card">
        <div className="sk-card-header">
          <div className="user-info">
            <div className="skeleton avatar"></div>
            <div className="user-details">
              <div className="skeleton name"></div>
              <div className="skeleton username"></div>
            </div>
          </div>
          <div className="skeleton action-btn"></div>
        </div>

        <div className="card-content">
          <div className="skeleton line"></div>
          <div className="skeleton line medium"></div>
          <div className="skeleton line short"></div>
        </div>

        <div className="skeleton card-media"></div>

        <div className="card-footer">
          <div className="skeleton footer-action"></div>
          <div className="skeleton footer-action"></div>
          <div className="skeleton footer-action"></div>
        </div>
      </div>
    </div>
  );
};

export default PostSleleton;
