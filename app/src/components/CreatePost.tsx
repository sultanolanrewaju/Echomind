import { useState, type ChangeEvent } from "react";
import FeelingModal from "./FeelingModal";
import usePostStore from "../store/usePostStore";

const CreatePost = () => {
  const {
    publishPost,
    isPublishing,
    uploadProgress,
    isUploading,
    published,
    message,
  } = usePostStore();
  const [postContent, setPost] = useState<string>("");
  const [media, setMedia] = useState<File | null>(null);
  const [mediaType, setMediaType] = useState<string>("");
  const [previewMedia, setPreviewMedia] = useState<string>("");
  const [feeling, setFeeling] = useState<string>("");
  const [isFeeling, setOpenFeeling] = useState<boolean>(false);

  const handleMedia = async (
    e: ChangeEvent<HTMLInputElement>,
  ): Promise<void> => {
    const file = e.target.files?.[0];
    if (!file) return;

    const srcObject = URL.createObjectURL(file);
    const ext = file.name.split(".").pop() === "mp4" ? "video" : "image";
    setMedia(file);
    setMediaType(ext);
    setPreviewMedia(srcObject);
  };

  const handleSubmitPost = async (): Promise<void> => {
    if (!postContent && !media) return;

    const postData = {
      content: postContent,
      postMedia: media ? media : null,
      isMedia: media ? true : false,
      feelings: feeling,
    };
    publishPost(postData, (isPublished: boolean) => {
      if (isPublished) {
        setPost("");
        setMedia(null);
        setMediaType("");
        setFeeling("");
        setPreviewMedia("");
      }
    });
  };

  return (
    <div className="create-post-card">
      <div className="create-post-top">
        <img src="/icons/user.png" className="avatar" alt="Avatar" />
        {/* <input
          type="text"
          className="create-post-input"
          placeholder="What's on your mind, Alex?"
        /> */}
        <textarea
          className="create-post-input"
          placeholder="Share a light to encourage someone today"
          onChange={(e) => setPost(e.target.value)}
          value={postContent}
        ></textarea>
      </div>
      {media && (
        <div
          style={{
            position: "relative",
          }}
          className="media-preview"
        >
          <button
            onClick={() => {
              setMedia(null);
              (setMediaType(""), setPreviewMedia(""));
            }}
            style={{
              outline: "none",
              border: "none",
              background: "transparent",
              cursor: "pointer",
              padding: "5px",
              color: "#f00",
              position: "absolute",
              top: "0",
              right: "0",
              fontSize: "23px",
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
              className="lucide lucide-x preview-icon"
            >
              <path d="M18 6 6 18" />
              <path d="m6 6 12 12" />
            </svg>
          </button>
          {mediaType === "image" ? (
            <img
              src={previewMedia}
              style={{
                width: "100%",
                height: "200px",
                objectFit: "cover",
                borderRadius: "5px",
              }}
              alt="Selected Mdia"
            />
          ) : (
            <video
              style={{
                width: "100%",
                height: "200px",
                objectFit: "cover",
                borderRadius: "5px",
              }}
              height="200px"
              controls
              // autoPlay
              src={previewMedia}
            />
          )}
        </div>
      )}
      {isFeeling && (
        <FeelingModal
          setOpenFeeling={setOpenFeeling}
          setFeeling={setFeeling}
          selectedFeeling={feeling}
        />
      )}
      {/* --- Post Uploading Status --- */}
      {isUploading && (
        <div className="upload-status-area">
          <div className="progress">
            <div
              style={{ width: `${uploadProgress}%` }}
              className="progress-line"
            ></div>
          </div>
          <span>{uploadProgress}%</span>
        </div>
      )}
      {message && message !== "" && (
        <div className="upload-status-area">
          <span className={`upload-message ${published ? "success" : "error"}`}>
            {message}
          </span>
        </div>
      )}
      <div className="create-post-actions">
        <input
          onChange={handleMedia}
          id="file"
          type="file"
          accept=".png,.jpg,.jpeg,.webp,.mp4"
          hidden
        />
        <label htmlFor="file" className="post-action-btn photo">
          <i className="fa-solid fa-image"></i>
          <span>Photo/Video</span>
        </label>
        <button
          title="Photo/Video"
          onClick={() => setOpenFeeling(!isFeeling)}
          className="post-action-btn feeling"
        >
          {feeling ? (
            feeling
          ) : (
            <>
              <i className="fa-solid fa-face-smile"></i>
              <span>Feeling</span>
            </>
          )}
        </button>
        <button
          title="Live Poll"
          onClick={() => alert("Coming soon...")}
          className="post-action-btn poll"
        >
          <i className="fa-solid fa-square-poll-vertical"></i>
          <span>Live Poll</span>
        </button>
        <button
          title="Publish Post"
          disabled={isPublishing}
          onClick={handleSubmitPost}
          className="post-action-btn tag"
        >
          {isPublishing ? (
            <>
              <div className="spinner"></div>
              <span>Publishing...</span>
            </>
          ) : (
            <>
              <i className="fa-solid fa-paper-plane"></i>
              <span>Publish Post</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default CreatePost;
