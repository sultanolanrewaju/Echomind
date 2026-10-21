const UnauthorizedAccess = () => {
  return (
    <div
      style={{
        background: "#fff",
      }}
      className="preloader"
    >
      <div
        style={{
          width: "70px",
          height: "70px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          border: "5px solid gray",
          borderRadius: "50%",
          fontSize: "5.5rem",
          color: "gray",
        }}
        className="circle"
      >
        \
      </div>
      <h1 style={{ color: "red" }}>Access Denied</h1>
      <h2>Unauthorized User Request</h2>
    </div>
  );
};

export default UnauthorizedAccess;
