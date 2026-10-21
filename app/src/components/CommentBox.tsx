import { useEffect, useRef, useState } from "react";
import usePost from "../store/usePost";
import formatTimeAgo from "../tools/time-formating";

const CommentBox = () => {
  const { openComment, createComment, selectedPost } = usePost();
  const comments = selectedPost?.comments || [];
  const [comment, setComment] = useState<string>("");
  const commentRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (commentRef?.current) {
      commentRef.current.scrollTo({
        top: commentRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [selectedPost]);

  return (
    <div className="preloader">
      <div className="comment-area">
        {/* Header with Close Button */}
        <div className="comment-header">
          <h3>Latest Comments</h3>
          <button
            onClick={() => openComment(null)}
            className="close-comment-btn"
            title="Close Comment"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="lucide lucide-x preview-icon"
            >
              <path d="M18 6 6 18" />
              <path d="m6 6 12 12" />
            </svg>
          </button>
        </div>

        {/* Comments List */}
        <div ref={commentRef} className="comments-list">
          {comments?.length == 0 && <strong>No comments yet !</strong>}
          {comments?.length > 0 &&
            comments?.map((comment, idx) => {
              return (
                <div key={idx} className="comment-item">
                  <img
                    src="/icons/user.png"
                    alt="user"
                    className="comment-avatar"
                  />
                  <div className="comment-content-wrapper">
                    <div className="comment-bubble">
                      <span className="comment-username">
                        {comment?.commenter_id}
                      </span>
                      <p className="comment-txt">{comment?.comment}</p>
                    </div>
                    <div className="comment-actions">
                      <button className="action-sub-btn">Like</button>
                      <button className="action-sub-btn">Reply</button>
                      <span className="comment-time">
                        {formatTimeAgo(comment?.time)}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}

          {/* <div className="comment-item">
            <img src="/icons/user.png" alt="user" className="comment-avatar" />
            <div className="comment-content-wrapper">
              <div className="comment-bubble">
                <span className="comment-username">user_id1232jfdfs</span>
                <p className="comment-txt">
                  This looks amazing! Great work on this project 🔥
                </p>
              </div>
              <div className="comment-actions">
                <button className="action-sub-btn">Like</button>
                <button className="action-sub-btn">Reply</button>
                <span className="comment-time">2h</span>
              </div>
            </div>
          </div>
          <div className="comment-item">
            <img src="/icons/user.png" alt="user" className="comment-avatar" />
            <div className="comment-content-wrapper">
              <div className="comment-bubble">
                <span className="comment-username">user_id1232jfdfs</span>
                <p className="comment-txt">
                  This looks amazing! Great work on this project 🔥
                </p>
              </div>
              <div className="comment-actions">
                <button className="action-sub-btn">Like</button>
                <button className="action-sub-btn">Reply</button>
                <span className="comment-time">2h</span>
              </div>
            </div>
          </div>
          <div className="comment-item">
            <img src="/icons/user.png" alt="user" className="comment-avatar" />
            <div className="comment-content-wrapper">
              <div className="comment-bubble">
                <span className="comment-username">user_id1232jfdfs</span>
                <p className="comment-txt">
                  This looks amazing! Great work on this project 🔥
                </p>
              </div>
              <div className="comment-actions">
                <button className="action-sub-btn">Like</button>
                <button className="action-sub-btn">Reply</button>
                <span className="comment-time">2h</span>
              </div>
            </div>
          </div>
          <div className="comment-item">
            <img src="/icons/user.png" alt="user" className="comment-avatar" />
            <div className="comment-content-wrapper">
              <div className="comment-bubble">
                <span className="comment-username">user_id1232jfdfs</span>
                <p className="comment-txt">
                  This looks amazing! Great work on this project 🔥
                </p>
              </div>
              <div className="comment-actions">
                <button className="action-sub-btn">Like</button>
                <button className="action-sub-btn">Reply</button>
                <span className="comment-time">2h</span>
              </div>
            </div>
          </div>
          <div className="comment-item">
            <img src="/icons/user.png" alt="user" className="comment-avatar" />
            <div className="comment-content-wrapper">
              <div className="comment-bubble">
                <span className="comment-username">user_id1232jfdfs</span>
                <p className="comment-txt">
                  This looks amazing! Great work on this project 🔥
                </p>
              </div>
              <div className="comment-actions">
                <button className="action-sub-btn">Like</button>
                <button className="action-sub-btn">Reply</button>
                <span className="comment-time">2h</span>
              </div>
            </div>
          </div> */}
        </div>

        {/* Comment Input Footer */}
        <div className="comment-input-container">
          <img
            src="/icons/user.png"
            alt="current user"
            className="comment-avatar"
          />
          <div className="comment-input-wrapper">
            <input
              type="text"
              placeholder="Write a comment..."
              className="comment-input"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && comment.trim()) {
                  createComment(comment.trim());
                  setComment("");
                }
              }}
            />
            <button
              onClick={() => {
                if (comment.trim()) {
                  createComment(comment.trim());
                  setComment("");
                }
              }}
              className="comment-send-btn"
              title="Send"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="m22 2-7 20-4-9-9-4Z" />
                <path d="M22 2 11 13" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommentBox;
