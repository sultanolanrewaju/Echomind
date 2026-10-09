import React, { useState } from "react";
import { Heart, Sparkles, MessageCircle } from "lucide-react";

function EchoeCard({ post }) {
  const [likes, setLikes] = useState(post.likes || 1200);

  return (
    <div className="bg-brand-lightPink rounded-2xl p-4 my-3 shadow-sm border border-pink-100">
      <div className="flex justify-between items-center text-xs text-gray-500 mb-2">
        <span className="font-bold text-gray-700">{post.handle}</span>
        <span>{post.timeLeft} Left</span>
      </div>

      <p className="text-sm font-semibold text-gray-900 mb-3">{post.text}</p>

      <div className="flex items-center gap-4 text-xs text-gray-600">
        <button
          onClick={() => setLikes(likes + 1)}
          className="flex items-center gap-1 hover:text-purple-600 font-medium"
        >
          <Heart size={16} className="text-purple-500 fill-purple-500" />
          I Hear You {likes}
        </button>
        <button className="flex items-center gap-1 hover:text-yellow-600 font-medium">
          <Sparkles size={16} className="text-yellow-500" />
          Celebrate
        </button>
        <div className="flex items-center gap-1 ml-auto">
          <MessageCircle size={16} />
          {post.comments}
        </div>
      </div>
    </div>
  );
}

export default EchoeCard