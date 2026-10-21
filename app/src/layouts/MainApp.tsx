import "../styles/app.layout.css";
import { Outlet, useNavigate } from "react-router-dom";
import AIChat from "./AIChat";
import AppHeader from "./AppHeader";
import AppMobileBar from "./AppMobileBar";
import AppSidebar from "./AppSidebar";
import SocketListener from "./SocketListener";
import useAPI from "../store/useAPI";
import { useEffect } from "react";
import Preloader from "../components/Preloader";
import CommentBox from "../components/CommentBox";
import usePost from "../store/usePost";
import NotificationPopup from "../components/Notification";
import useAppStore from "../store/useAppStore";

const MainApp = () => {
  const navigate = useNavigate();
  const { verifyUser, isVerifying, theme } = useAPI();
  const { isOpenComment } = usePost();
  const { isNotiOpen, isAI, openAI } = useAppStore();

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    verifyUser(navigate);
    if (window.innerWidth <= 375) {
      openAI();
    }
    //  initNotifications();
  }, []);

  if (isVerifying) {
    return <Preloader />;
  }

  return (
    <>
      <SocketListener />
      {isOpenComment && <CommentBox />}
      {!isAI && <AppHeader />}
      {isNotiOpen && <NotificationPopup />}
      <div className="app-container">
        <AppSidebar />
        <main className="feed-stream">
          {/* --- Other Pages Goese Here --- */}
          <Outlet />
        </main>
        <AIChat />
      </div>
      {!isAI && <AppMobileBar />}
    </>
  );
};

export default MainApp;
