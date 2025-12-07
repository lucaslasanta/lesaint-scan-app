import React, { useEffect } from "react";

const pink = "rgb(255,0,190)";

export default function InstructionsModal({ onClose }) {
  // Prevent body scroll when modal is open
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  return (
    <div style={styles.overlay}>
      <button onClick={onClose} style={styles.closeButton}>
        ✕
      </button>

      <div style={styles.content}>
        <h1 style={styles.title}>The Le Saint Game</h1>
        <p style={styles.text}>
          Every bottle carries a story.
          <br />
          Scan bottles, earn Saint Points and unlock status.
          <br />
          Le Saint rewards the loyal.
        </p>

        <h2 style={styles.sectionTitle}>Saint Points</h2>
        <p style={styles.text}>
          First scan of a bottle: +5 points.
          <br />
          Bottle scanned before: +1 point.
        </p>

        <h2 style={styles.sectionTitle}>Levels</h2>
        <p style={styles.text}>
          Saint Initiation → Young Saint → Rising Saint → The Le Saint Club
        </p>

        <h2 style={styles.sectionTitle}>The Le Saint Club</h2>
        <p style={styles.text}>
          Unlocks at 100 points.
          <br />
          Enter your email to receive exclusive access, releases and
          experiences.
        </p>
      </div>
    </div>
  );
}

const styles = {
  overlay: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100vw",
    height: "100vh",
    background:
      "radial-gradient(circle at top center, rgba(255,0,190,0.12), rgba(0,0,0,1) 55%)",
    zIndex: 9999,
    overflowY: "auto",
    WebkitOverflowScrolling: "touch",
    padding: "40px 20px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },

  closeButton: {
    position: "fixed",
    top: "30px",
    right: "20px",
    width: 48,
    height: 48,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    border: `2px solid ${pink}`,
    borderRadius: 14,
    background: "transparent",
    color: pink,
    fontSize: 26,
    lineHeight: "26px",
    cursor: "pointer",
    zIndex: 10000,
    touchAction: "manipulation",
  },

  content: {
    maxWidth: "420px",
    marginTop: "60px",
    textAlign: "center",
    width: "100%",
  },

  title: {
    fontSize: 32,
    fontFamily: "Playfair Display, serif",
    marginBottom: 20,
    color: "#fff",
  },

  sectionTitle: {
    marginTop: 40,
    marginBottom: 10,
    fontFamily: "Playfair Display, serif",
    fontSize: 26,
    color: "#fff",
  },

  text: {
    fontSize: 16,
    lineHeight: 1.5,
    fontFamily: "Inter, sans-serif",
    color: "rgba(255,255,255,0.85)",
  },
};
