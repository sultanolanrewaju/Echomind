import { SocketListener } from "./socket/SocketListener";
import { initNotifications } from "./socket/handle-notification";

import React, { useState } from "react";
import BottomNav from "./components/BottomNav";
import EchoeCard from "./components/EchoeCard";
import ChatPop from "./components/ChatPop";
import { Send, Mic } from "lucide-react";

function App() {
  const [activeTab, setActiveTab] = useState("home");
  const [isMatching, setIsMatching] = useState(false);

  // Mock Messages for Chat View
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: "You",
      text: "I am feeling really Depressed. I am so tired of trying to be great.",
      isUser: true,
    },
    {
      id: 2,
      sender: "Echo AI",
      text: "I understand life can be really hard. Take a slow breath in and out. Do you want to stay with me or connect to a peer supporter?",
      isUser: false,
    },
  ]);

  return (
    <div className="max-w-md mx-auto h-screen flex flex-col bg-white border-x shadow-2xl relative overflow-hidden">
      {/* Dynamic Header */}
      <header className="bg-brand-blue text-white py-4 px-6 text-center shadow-md">
        <h1 className="text-xl font-bold">
          {activeTab === "home" && "Welcome To Echomind"}
          {activeTab === "lightbox" && "Community Echoes"}
          {activeTab === "notifications" && "Notifications"}
          {activeTab === "chat" && "Chats"}
        </h1>
      </header>

      {/* Screen Body */}
      <main className="flex-1 overflow-y-auto pb-24 p-4">
        {/* Tab 1: AI Intake Home */}
        {activeTab === "home" && (
          <div className="flex flex-col h-full justify-between">
            <div className="space-y-3">
              {messages.map((m) => (
                <ChatPop key={m.id} message={m} isUser={m.isUser} />
              ))}

              <div className="flex gap-2 justify-center my-4">
                <button
                  onClick={() => setIsMatching(true)}
                  className="bg-brand-blue text-white px-4 py-2 rounded-lg font-bold text-sm shadow hover:opacity-90"
                >
                  Connect to Peer
                </button>
                <button className="border border-brand-blue text-brand-blue px-4 py-2 rounded-lg font-bold text-sm hover:bg-blue-50">
                  Stay with AI
                </button>
              </div>

              {isMatching && (
                <div className="bg-gray-200 text-center py-3 px-6 rounded-full text-xs font-semibold animate-pulse text-gray-700">
                  Connecting you with supporter...
                </div>
              )}
            </div>

            {/* Input Bar */}
            <div className="flex items-center gap-2 mt-4 bg-brand-lightPink rounded-full p-2">
              <input
                type="text"
                placeholder="What are you feeling today?"
                className="flex-1 bg-transparent px-3 text-sm focus:outline-none"
              />
              <button className="bg-brand-blue text-white p-2 rounded-full">
                <Send size={16} />
              </button>
              <Mic size={18} className="text-brand-blue mr-2" />
            </div>
          </div>
        )}

        {/* Tab 2: Lightbox Feed */}
        {activeTab === "lightbox" && (
          <div>
            <div className="bg-brand-lightPink rounded-xl p-3 mb-4 flex items-center justify-between">
              <input
                type="text"
                placeholder="Share your wins and get inspired..."
                className="bg-transparent text-xs w-full focus:outline-none"
              />
              <Send size={16} className="text-brand-blue" />
            </div>

            <FeedCard
              post={{
                handle: "@KindaFeels",
                timeLeft: "12hrs",
                text: "Guys I finally beat cancer. I am really excited this is the best day of my life.",
                comments: 25,
              }}
            />
          </div>
        )}

        {/* Tab 3: Notifications */}
        {activeTab === "notifications" && (
          <div className="space-y-3">
            <div className="bg-brand-lightPink p-4 rounded-xl flex items-center justify-between">
              <div>
                <p className="text-xs font-bold">
                  A peer Supporter just became Available
                </p>
              </div>
              <button
                onClick={() => setActiveTab("chat")}
                className="bg-brand-blue text-white text-xs px-3 py-1.5 rounded-md font-semibold"
              >
                Connect
              </button>
            </div>
          </div>
        )}

        {/* Tab 4: Active Chat */}
        {activeTab === "chat" && (
          <div>
            <p className="text-center text-xs text-gray-500 mb-2">
              You are connected with @hopelove
            </p>
            <ChatPop
              message={{
                sender: "@hopelove",
                text: "Hi there, I read your intake note. I'm here to listen.",
              }}
              isUser={false}
            />
          </div>
        )}
      </main>

      {/* Persistent Bottom Bar */}
      <BottomNav activeTab={activeTab} setActiveTab={setActiveTab} />
    </div>
  );
}

export default App;
