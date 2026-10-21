const SiteSupport = () => {
  return (
    <section className="section-container" id="how-it-works">
      <div className="section-header">
        <span className="section-tag">Simple & Compassionate</span>
        <h2 className="section-title">How Pulse Supports You</h2>
        <p className="section-desc">
          Three simple steps to finding peace, emotional relief, and genuine
          human connection.
        </p>
      </div>

      <div className="steps-grid">
        <div className="step-card">
          <div className="step-num">1</div>
          <h3>Express How You Feel</h3>
          <p>
            Open up in a judgment-free space. Share your feelings, stress, or
            thoughts with our empathetic AI listener at any time of day.
          </p>
        </div>
        <div className="step-card">
          <div className="step-num">2</div>
          <h3>Get Matched Instantly</h3>
          <p>
            Our intelligent system matches your emotional need with verified
            peer supporters and trained listeners ready for 1-on-1 chats.
          </p>
        </div>
        <div className="step-card">
          <div className="step-num">3</div>
          <h3>Heal & Connect</h3>
          <p>
            Join a warm, uplifting social community feed where members share
            inspiring stories, wellness tips, and daily encouragement.
          </p>
        </div>
      </div>
    </section>
  );
};

export default SiteSupport;
