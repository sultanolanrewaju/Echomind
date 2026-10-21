import React, { useEffect, useRef } from "react";
import CreatePost from "../components/CreatePost";
import PostCard from "../components/Post";
import usePost, { type Post } from "../store/usePost";
import PostSleleton from "../components/PostSleleton";
import useAppStore from "../store/useAppStore";

const NewsFeed: React.FC = () => {
  const { isProfile } = useAppStore();
  const { all_post, fetchPost, hasMore, isLoading } = usePost();
  const observerRef = useRef<HTMLDivElement | null>(null);

  // Setup infinite scroll observer for the sentinel element at the bottom of the feed
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !isLoading) {
          fetchPost();
        }
      },
      { threshold: 0.2 },
    );

    const currentTarget = observerRef.current;
    if (currentTarget) {
      observer.observe(currentTarget);
    }

    return () => {
      if (currentTarget) {
        observer.unobserve(currentTarget);
      }
    };
  }, [hasMore, isLoading, fetchPost]);

  return (
    <>
      {!isProfile && (
        <div
          style={{
            maxWidth: "100%",
            margin: "0 auto",
            padding: "0",
            minHeight: "85vh",
          }}
        >
          <CreatePost />

          {/* Initial loading state */}
          {isLoading && all_post.length === 0 && (
            <div>
              <PostSleleton />
              <br />
              <PostSleleton />
            </div>
          )}

          {/* Empty State */}
          {!isLoading && all_post.length === 0 && (
            <div
              style={{
                textAlign: "center",
                padding: "40px 20px",
                background: "var(--bg-card)",
                borderRadius: "var(--radius-lg)",
                border: "1px solid var(--border-color)",
                marginTop: "16px",
              }}
            >
              <div style={{ fontSize: "36px", marginBottom: "12px" }}>🌿</div>
              <h3
                style={{
                  fontSize: "17px",
                  fontWeight: "700",
                  marginBottom: "6px",
                }}
              >
                The Safe Space is Quiet
              </h3>
              <p style={{ fontSize: "14px", color: "var(--text-secondary)" }}>
                No posts here yet. Express how you feel or share a comforting
                thought anonymously above!
              </p>
            </div>
          )}

          {/* Posts Stream */}
          {all_post.map((post: Post) => (
            <PostCard key={post._id} post={post} />
          ))}

          {/* Infinite Scroll Sentinel */}
          <div ref={observerRef} style={{ height: "20px", margin: "10px 0" }} />

          {/* Loading more indicator */}
          {isLoading && all_post.length > 0 && (
            <div
              style={{
                textAlign: "center",
                padding: "16px",
                color: "var(--text-secondary)",
              }}
            >
              <p style={{ fontSize: "13px" }}>Loading more echoes...</p>
            </div>
          )}

          {/* End of feed indicator */}
          {!hasMore && all_post.length > 0 && (
            <div
              style={{
                textAlign: "center",
                padding: "20px",
                color: "var(--text-muted)",
              }}
            >
              <p style={{ fontSize: "13px" }}>
                You've caught up with all anonymous echoes. ✨
              </p>
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default NewsFeed;
