const NotFoundError = () => {
  return (
    <div
      style={{
        background: "#fff",
      }}
      className="preloader"
    >
      <h1 style={{ fontSize: "6rem", color: "gray" }}>404</h1>
      <h1 style={{ color: "red", marginTop: "-2rem" }}>Page Not Found</h1>
      <h2>Requested Page Not Exist</h2>
    </div>
  );
};

export default NotFoundError;
