import React from "react";

 function ChatPop({ message, isUser }) {
  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"} my-2 px-4`}>
      <div
        className={`max-w-[80%] p-4 rounded-2xl text-sm leading-relaxed ${
          isUser
            ? "bg-gray-200 text-black rounded-br-none shadow-sm"
            : "bg-gray-200 text-black rounded-bl-none shadow-sm"
        }`}
      >
        <p className="font-semibold text-xs mb-1">{isUser ? "You" : message.sender}</p>
        <p>{message.text}</p>
      </div>
    </div>
  );
}

export default ChatPop