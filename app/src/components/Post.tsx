import { url } from "../libs/axios-api";
import type { Post } from "../store/usePost";
import usePost from "../store/usePost";
import formatTimeAgo from "../tools/time-formating";

const PostCard = ({ post }: { post: Post }) => {
  const { toggleLike, isLiked, openComment } = usePost();

  return (
    <article className="feed-post">
      <div className="post-header">
        <div className="post-author-info">
          <div className="avatar-wrap">
            <img src="/icons/user.png" className="avatar" alt="Author" />
            <span className="online-ring"></span>
          </div>
          <div>
            <div className="post-author-name">
              {post.poster_id}
              <i className="fa-solid fa-circle-check verified-badge"></i>
            </div>
            <div className="post-time-privacy">
              <span>{formatTimeAgo(post?.createdAt)}</span> •
              <i className="fa-solid fa-earth-americas"></i>
              {post.post_feeling !== "" && (
                <span>Feeling {post.post_feeling}</span>
              )}
            </div>
          </div>
        </div>
        <button className="post-options-btn">
          <i className="fa-solid fa-ellipsis"></i>
        </button>
      </div>

      <p className="post-caption">{post.post_content}</p>

      {post?.post_media && (
        <div className="post-media">
          {post.post_media.endsWith(".mp4") ? (
            <video
              src={url + post.post_media}
              controls
              style={{
                width: "100%",
                maxHeight: "420px",
                display: "block",
                borderRadius: "var(--radius-md)",
              }}
            />
          ) : (
            <img src={url + post.post_media} alt="Post attachment" />
          )}
        </div>
      )}

      <div className="post-stats">
        <div className="reaction-icons">
          <span className="reaction-badge reaction-like">
            <i className="fa-solid fa-thumbs-up"></i>
          </span>
          <span className="reaction-badge reaction-heart">
            <i className="fa-solid fa-heart"></i>
          </span>
          <span style={{ marginLeft: "8px" }}>
            {(post.likes || []).length} Likes
          </span>
        </div>
        <div>
          <span>
            {(post.comments || []).length} Comments •{" "}
            {(post.shares || []).length} Shares
          </span>
        </div>
      </div>

      <div className="post-actions-bar">
        <button
          title="Like Post"
          onClick={() => toggleLike(post._id)}
          className={`action-button like-btn ${isLiked(post._id) ? "liked" : ""}`}
        >
          {isLiked(post._id) ? (
            <>
              <i className="fa-solid fa-heart"></i> Liked
            </>
          ) : (
            <>
              <i className="fa-regular fa-heart"></i> Like
            </>
          )}
        </button>
        <button
          title="Comments"
          onClick={() => openComment(post)}
          className="action-button"
        >
          <i className="fa-regular fa-comment"></i> Comment
        </button>
        <button title="Repost" id="repost" className="action-button">
          <i className="fa-solid fa-repeat"></i> Repost
        </button>
        <button title="Share Post" className="action-button">
          <i className="fa-regular fa-paper-plane"></i> Share
        </button>
      </div>
      {/*
      <div className="comments-section">
        <div className="comment-item">
          <img
            src="/icons/user.png"
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
            src="/icons/user.png"
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
      */}
    </article>
  );
};

export default PostCard;
