const Preloader = () => {
  return (
    <div className="preloader">
      <img width="150" height="150" src="/site-echomind.png" alt="Echo Mind" />
      <div className="loading"></div>
      <p>Please wait...</p>
      {/* <h3>Connecting With Echo Mind</h3> */}
    </div>
  );
};

export default Preloader;
