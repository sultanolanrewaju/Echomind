const SiteFeatures = () => {
  return (
    <section
      className="section-container"
      id="features"
      style={{
        background: "var(--bg-card)",
        maxWidth: "100%",
        borderTop: "1px solid var(--border-color)",
        borderBottom: "1px solid var(--border-color)",
      }}
    >
      <div style={{ maxWidth: "1280px", margin: "0 auto" }}>
        <div className="section-header">
          <span className="section-tag">Platform Features</span>
          <h2 className="section-title">
            Designed for Your Emotional Well-Being
          </h2>
          <p className="section-desc">
            Everything you need to nurture your mental health and stay connected
            with caring people.
          </p>
        </div>

        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon-box">
              <i className="fa-solid fa-robot"></i>
            </div>
            <h3>Emotional AI Companion</h3>
            <p>
              Always available 24/7 to listen, offer soothing responses, and
              guide you through moments of distress.
            </p>
          </div>
          <div className="feature-card">
            <div className="feature-icon-box">
              <i className="fa-solid fa-hand-holding-heart"></i>
            </div>
            <h3>Peer Supporter Matching</h3>
            <p>
              Get connected with verified human listeners who share similar life
              experiences and offer genuine empathy.
            </p>
          </div>
          <div className="feature-card">
            <div className="feature-icon-box">
              <i className="fa-solid fa-shield-halved"></i>
            </div>
            <h3>100% Anonymous & Private</h3>
            <p>
              Your privacy is paramount. Share your heart freely without
              revealing your identity or personal credentials.
            </p>
          </div>
          <div className="feature-card">
            <div className="feature-icon-box">
              <i className="fa-solid fa-newspaper"></i>
            </div>
            <h3>Uplifting Social Feed</h3>
            <p>
              Explore a positive newsfeed filled with inspiring stories, health
              journeys, and supportive community interactions.
            </p>
          </div>
          <div className="feature-card">
            <div className="feature-icon-box">
              <i className="fa-solid fa-face-smile"></i>
            </div>
            <h3>Mood & Wellness Tracking</h3>
            <p>
              Track your daily mood patterns, journal thoughts, and access
              simple breathing exercises to stay grounded.
            </p>
          </div>
          <div className="feature-card">
            <div className="feature-icon-box">
              <i className="fa-solid fa-comments"></i>
            </div>
            <h3>Encrypted Chat Rooms</h3>
            <p>
              Engage in safe 1-on-1 conversations or join topic-based support
              circles moderated for positive interaction.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SiteFeatures;
