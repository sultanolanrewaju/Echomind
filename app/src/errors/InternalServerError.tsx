const InternalServerError = () => {
  return (
    <div
      style={{
        background: "#fff",
      }}
      className="preloader"
    >
      <h1 style={{ fontSize: "6rem", color: "gray" }}>505</h1>
      <h1 style={{ color: "red", marginTop: "-2rem" }}>
        Internal Server Error
      </h1>
      <h2>Your Request Failed</h2>
    </div>
  );
};

export default InternalServerError;
