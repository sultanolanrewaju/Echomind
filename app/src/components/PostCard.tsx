const PostCard = () => {
  return (
    <article className="feed-post">
      <div className="post-header">
        <div className="post-author-info">
          <div className="avatar-wrap">
            <img
              src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80"
              className="avatar"
              alt="Author"
            />
            <span className="online-ring"></span>
          </div>
          <div>
            <div className="post-author-name">
              Sarah Jenkins{" "}
              <i className="fa-solid fa-circle-check verified-badge"></i>
            </div>
            <div className="post-time-privacy">
              <span>2 hrs ago</span> •{" "}
              <i className="fa-solid fa-earth-americas"></i>
            </div>
          </div>
        </div>
        <button className="post-options-btn">
          <i className="fa-solid fa-ellipsis"></i>
        </button>
      </div>

      <p className="post-caption">
        Just wrapped up our design system iteration for the new Pulse web
        dashboard! Pure modern aesthetics, responsive grids, and soft
        glassmorphism touches. What do you guys think? ✨🎨
      </p>

      <div className="post-media">
        <img
          src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1000&q=80"
          alt="Design Art"
        />
      </div>

      <div className="post-stats">
        <div className="reaction-icons">
          <span className="reaction-badge reaction-like">
            <i className="fa-solid fa-thumbs-up"></i>
          </span>
          <span className="reaction-badge reaction-heart">
            <i className="fa-solid fa-heart"></i>
          </span>
          <span style={{ marginLeft: "8px" }}>248 Likes</span>
        </div>
        <div>
          <span>42 Comments • 18 Shares</span>
        </div>
      </div>

      <div className="post-actions-bar">
        <button className="action-button like-btn">
          <i className="fa-regular fa-heart"></i> Like
        </button>
        <button className="action-button">
          <i className="fa-regular fa-comment"></i> Comment
        </button>
        <button className="action-button">
          <i className="fa-solid fa-repeat"></i> Repost
        </button>
        <button className="action-button">
          <i className="fa-regular fa-paper-plane"></i> Share
        </button>
      </div>

      <div className="comments-section">
        <div className="comment-item">
          <img
            src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&q=80"
            className="avatar"
            style={{ width: "30px", height: "30px" }}
            alt="User"
          />
          <div className="comment-bubble">
            <div className="comment-user">David Miller</div>
            Looks absolutely slick Sarah! Love the blue gradients and crisp
            padding layout.
          </div>
        </div>
        <div className="comment-input-box">
          <img
            src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80"
            className="avatar"
            style={{ width: "30px", height: "30px" }}
            alt="User"
          />
          <input
            type="text"
            className="comment-input"
            placeholder="Write a comment..."
          />
        </div>
      </div>
    </article>
  );
};

export default PostCard;
