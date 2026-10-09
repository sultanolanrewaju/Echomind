import React from "react";
import { Landmark, Lightbulb, Bell, MessageSquare } from "lucide-react";

function BottomNav({ activeTab, setActiveTab }) {
  const tabs = [
    { id: "home", icon: Landmark },
    { id: "lightbox", icon: Lightbulb },
    { id: "notifications", icon: Bell },
    { id: "chat", icon: MessageSquare },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 max-w-sm mx-auto bg-[#FFF3A7] border-t flex justify-around py-3 px-4 shadow-lg">
      {tabs.map(({ id, icon: Icon }) => (
        <button
          key={id}
          onClick={() => setActiveTab(id)}
          className={`p-2 rounded-lg transition-colors ${
            activeTab === id ? "text-brand-blue scale-110" : "text-gray-700 hover:text-brand-blue"
          }`}
        >
          <Icon size={24} className={activeTab === id ? "fill-brand-blue text-brand-blue" : ""} />
        </button>
      ))}
    </div>
  );
}

export default BottomNav