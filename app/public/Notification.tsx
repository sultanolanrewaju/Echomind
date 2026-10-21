import { useState } from "react";
import "../styles/notification.css";
import useAppStore from "../store/useAppStore";

const initialNotifications = [
  {
    id: "1",
    user: "Eshika",
    avatar: "/icons/user.png",
    text: "liked your post.",
    time: "2m ago",
    read: false,
  },
  {
    id: "2",
    user: "Samiul Islam",
    avatar: "/icons/user.png",
    text: "commented: 'Great work on this app!'",
    time: "1h ago",
    read: false,
  },
  {
    id: "3",
    user: "System",
    avatar: "/icons/user.png",
    text: "Your deployment was successful.",
    time: "1d ago",
    read: true,
  },
];

const NotificationPopup = () => {
  const { notifications } = useAppStore();
  const { openNotification } = useAppStore();
  const [notifications, setNotifications] = useState(initialNotifications);

  // Single notification delete
  const handleDelete = (id: string) => {
    setNotifications((prev) => prev.filter((item) => item.id !== id));
  };

  // Toggle read status
  const toggleRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, read: !item.read } : item,
      ),
    );
  };

  // Delete all
  const handleClearAll = () => {
    setNotifications([]);
  };

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
              className="notif-clear-btn"
              onClick={handleClearAll}
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
            X
          </button>
        </div>
      </div>

      {/* Notification List */}
      <div className="notif-list">
        {notifications.length > 0 ? (
          notifications.map((item) => (
            <div
              key={item.id}
              className={`notif-item ${!item.read ? "unread" : ""}`}
              onClick={() => toggleRead(item.id)}
            >
              <img src={item.avatar} alt={item.user} className="notif-avatar" />

              <div className="notif-body">
                <p className="notif-text">
                  <strong>{item.user}</strong> {item.text}
                </p>
                <span className="notif-time">{item.time}</span>
              </div>

              {/* Individual Delete Action */}
              <button
                className="notif-delete-btn"
                title="Delete notification"
                onClick={(e) => {
                  e.stopPropagation(); // Prevents triggering toggleRead
                  handleDelete(item.id);
                }}
              >
                trash
              </button>

              {!item.read && <span className="unread-dot" />}
            </div>
          ))
        ) : (
          <div className="notif-empty">
            Empty Icon Here
            <p>No notifications left</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationPopup;
