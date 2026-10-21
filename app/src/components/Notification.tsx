import "../styles/notification.css";
import useAppStore from "../store/useAppStore";
import formatTimeAgo from "../tools/time-formating";

const NotificationPopup = () => {
  const {
    notifications,
    openNotification,
    readNotification,
    deleteNotification,
    clearAllNotifications,
  } = useAppStore();

  return (
    <div className="notif-popup">
      {/* Header */}
      <div className="notif-header">
        <div className="notif-title-group">
          <h3>Notifications</h3>
          {notifications.some((n) => !n.read) && (
            <span className="notif-badge">
              {notifications.filter((n) => !n.read).length} new
            </span>
          )}
        </div>
        <div className="notif-header-actions">
          {notifications.length > 0 && (
            <button
              onClick={clearAllNotifications}
              className="notif-clear-btn"
              title="Clear all"
            >
              Clear all
            </button>
          )}
          <button
            onClick={openNotification}
            className="notif-close-btn"
            title="Close"
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
              className="lucide lucide-x preview-icon"
            >
              <path d="M18 6 6 18" />
              <path d="m6 6 12 12" />
            </svg>
          </button>
        </div>
      </div>

      {/* Notification List */}
      <div className="notif-list">
        {notifications.length > 0 ? (
          notifications.map((item) => (
            <div
              onClick={() => readNotification(item._id)}
              key={item._id}
              className={`notif-item ${!item.read ? "unread" : ""}`}
            >
              <img
                src="/icons/user.png"
                alt={item.sender_id}
                className="notif-avatar"
              />

              <div className="notif-body">
                <p className="notif-text">{item.text}</p>
                <span className="notif-time">{formatTimeAgo(item.time)}</span>
              </div>

              {/* Individual Delete Action */}
              <button
                className="notif-delete-btn"
                title="Delete notification"
                onClick={(e) => {
                  e.stopPropagation(); // Prevents triggering toggleRead
                  deleteNotification(item._id);
                }}
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
                  className="lucide lucide-trash preview-icon"
                >
                  <path d="M10 11v6" />
                  <path d="M14 11v6" />
                  <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" />
                  <path d="M3 6h18" />
                  <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                </svg>
              </button>

              {!item.read && <span className="unread-dot" />}
            </div>
          ))
        ) : (
          <div className="notif-empty">
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
              className="lucide lucide-bell-off preview-icon"
            >
              <path d="M10.268 21a2 2 0 0 0 3.464 0" />
              <path d="M17 17H4a1 1 0 0 1-.74-1.673C4.59 13.956 6 12.499 6 8a6 6 0 0 1 .258-1.742" />
              <path d="m2 2 20 20" />
              <path d="M8.668 3.01A6 6 0 0 1 18 8c0 2.687.77 4.653 1.707 6.05" />
            </svg>
            <p style={{ color: "var(--text-secondary)" }}>
              No notifications left
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationPopup;
