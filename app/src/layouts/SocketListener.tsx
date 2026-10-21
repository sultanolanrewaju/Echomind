import { useEffect } from "react";
import { connectSocket, socket } from "../services/socket-sevice";
import useAPI from "../store/useAPI";
import usePost from "../store/usePost";
import useAppStore, {
  type Notification,
  type SecretPeer,
} from "../store/useAppStore";

const SocketListener = () => {
  const {
    handleNotification,
    setOnlineCount,
    addAIMessage,
    setSecretMatched,
    setSecretStatus,
    addSecretMessage,
    setSecretPeerTyping,
  } = useAppStore();
  const { setUser, user } = useAPI();
  const {
    setPost,
    addNewPost,
    fetchPost,
    setAllPost,
    setUserProfile,
    updatePostLikes,
    addPostComment,
    getPost,
  } = usePost();

  useEffect(() => {
    connectSocket();

    const handleConnectionAck = (data: any) => {
      setUser(data);
      fetchPost();
      getPost();
    };

    const handleUserProfileInfo = (data: any) => {
      fetchPost();
      setUserProfile(data);
    };

    const handleAllNotifications = (notification: Notification[]) => {
      handleNotification(notification);
    };

    const handleAllPost = (data: any) => {
      setAllPost(data);
    };

    const handlePostPublishSuccess = (data: any) => {
      setPost(data);
    };

    const handleNewPost = (newPost: any) => {
      addNewPost(newPost);
    };

    const handleLikeUpdated = (data: { postID: string; likes: string[] }) => {
      updatePostLikes(data.postID, data.likes);
    };

    const handleCommentAdded = (data: {
      postID: string;
      comment: any;
      comments: any[];
    }) => {
      addPostComment(data.postID, data.comment, data.comments);
    };

    const handleOnlineStats = (data: { onlineCount: number }) => {
      if (typeof data?.onlineCount === "number") {
        setOnlineCount(data.onlineCount);
      }
    };

    const handleAIReply = (data: { text: string; timestamp: string }) => {
      addAIMessage({
        id: `bot_${Date.now()}`,
        sender: "bot",
        text: data.text,
        time: new Date(data.timestamp || Date.now()).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      });
    };

    const handleSecretWaiting = () => {
      setSecretStatus("searching");
    };

    const handleSecretMatched = (data: {
      roomID: string;
      peer: SecretPeer;
      message: string;
    }) => {
      setSecretMatched(data.roomID, data.peer);
    };

    const handleSecretNewMessage = (data: any) => {
      const isMe = data.senderID === user?.user_id;
      addSecretMessage({
        id: data.id || `sec_${Date.now()}`,
        senderID: data.senderID,
        senderAlias: data.senderAlias,
        text: data.text,
        time:
          data.time ||
          new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
        isMe,
      });
    };

    const handleSecretPeerTyping = (data: { isTyping: boolean }) => {
      setSecretPeerTyping(data.isTyping);
    };

    const handleSecretPeerLeft = (data: { message: string }) => {
      setSecretStatus("ended");
      addSecretMessage({
        id: `sys_${Date.now()}`,
        senderID: "system",
        senderAlias: "System",
        text: data.message || "Your peer has ended the secret chat.",
        time: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
        isMe: false,
      });
    };

    const handleSecretPeerDisconnected = (data: { message: string }) => {
      setSecretStatus("ended");
      addSecretMessage({
        id: `sys_${Date.now()}`,
        senderID: "system",
        senderAlias: "System",
        text: data.message || "Your peer has disconnected.",
        time: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
        isMe: false,
      });
    };

    // Attach event listeners
    socket.on("connection_ack", handleConnectionAck);
    socket.on("user-profile-info", handleUserProfileInfo);
    socket.on("all-notifications", handleAllNotifications);
    socket.on("all-post", handleAllPost);
    socket.on("post-publish:success", handlePostPublishSuccess);
    socket.on("new-post", handleNewPost);
    socket.on("post-like-updated", handleLikeUpdated);
    socket.on("post-comment-added", handleCommentAdded);
    socket.on("online:stats", handleOnlineStats);
    socket.on("ai:reply", handleAIReply);
    socket.on("secret:waiting", handleSecretWaiting);
    socket.on("secret:matched", handleSecretMatched);
    socket.on("secret:new-message", handleSecretNewMessage);
    socket.on("secret:peer-typing", handleSecretPeerTyping);
    socket.on("secret:peer-left", handleSecretPeerLeft);
    socket.on("secret:peer-disconnected", handleSecretPeerDisconnected);

    // Clean up listeners on unmount
    return () => {
      socket.off("connection_ack", handleConnectionAck);
      socket.off("user-profile-info", handleUserProfileInfo);
      socket.off("all-notifications", handleAllNotifications);
      socket.off("all-post", handleAllPost);
      socket.off("post-publish:success", handlePostPublishSuccess);
      socket.off("new-post", handleNewPost);
      socket.off("post-like-updated", handleLikeUpdated);
      socket.off("post-comment-added", handleCommentAdded);
      socket.off("online:stats", handleOnlineStats);
      socket.off("ai:reply", handleAIReply);
      socket.off("secret:waiting", handleSecretWaiting);
      socket.off("secret:matched", handleSecretMatched);
      socket.off("secret:new-message", handleSecretNewMessage);
      socket.off("secret:peer-typing", handleSecretPeerTyping);
      socket.off("secret:peer-left", handleSecretPeerLeft);
      socket.off("secret:peer-disconnected", handleSecretPeerDisconnected);
    };
  }, [
    fetchPost,
    handleNotification,
    setAllPost,
    setPost,
    addNewPost,
    setUser,
    setUserProfile,
    updatePostLikes,
    addPostComment,
    setOnlineCount,
    addAIMessage,
    setSecretMatched,
    setSecretStatus,
    addSecretMessage,
    setSecretPeerTyping,
    user?.user_id,
  ]);

  return null;
};

export default SocketListener;
