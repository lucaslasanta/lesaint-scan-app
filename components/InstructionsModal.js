import React from "react";

const pink = "rgb(255, 0, 190)";

export default function InstructionsModal({ onClose }) {
  return (
    <div style={styles.overlay}>
      <div style={styles.inner}>

        {/* CLOSE BUTTON */}
        <button style={styles.closeButton} onClick={onClose}>
          ✕
        </button>

        <h1 style={styles.title}>The Le Saint Game</h1>

        <p style={styles.textGrey}>
          Every bottle carries a story.<br />
          Scan bottles, earn Saint Points and unlock status.<br />
          Le Saint rewards the loyal.
        </p>

        <h2 style={styles.sectionTitle}>Saint Points</h2>
        <p style={styles.textGrey}>
          First scan of a bottle: +5 points.<br />
          Bottle scanned before: +1 point.
        </p>

        <h2 style={styles.sectionTitle}>Levels</h2>
        <p style={styles.textGrey}>
          Saint Initiation → Young Saint → Rising Saint → The Le Saint Club
        </p>

        <h2 style={styles.sectionTitle}>The Le Saint Club</h2>
        <p style={styles.textGrey}>
          Unlocks at 100 points.<br />
          Enter your email to receive exclusive access, releases and experiences.
        </p>

      </div>
    </div>
  );
}

const styles = {
  /* FULL SCREEN FIX — prevents zoom + right shift */
  overlay: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    maxWidth: "100%",
    height: "100vh",
    overflowY: "auto",
    WebkitOverflowScrolling: "touch", // smooth iOS scrolling
    background: `
      radial-gradient(circle at top center,
      rgba(255,0,190,0.12),
      rgba(0,0,0,1) 55%)
    `,
    padding: "40px 20px",
    boxSizing: "border-box",
    color: "#fff",
    textAlign: "center",
    zIndex: 9999,
  },

  /* CONTENT */
  inner: {
    width: "100%",
    maxWidth: 480,
    margin: "0 auto",
  },

  /* FIXED CLOSE BUTTON — visible on all iPhones */
  closeButton: {
    position: "fixed",
    top: 20,
    right: 20,
    width: 46,
    height: 46,
    borderRadius: 12,
    border: `2px solid ${pink}`,
    color: pink,
    background: "rgba(0,0,0,0.4)",
    fontSize: 24,
    fontFamily: "Inter, sans-serif",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    zIndex: 10000,
  },

  title: {
    fontSize: 34,
    fontFamily: "Playfair Display, serif",
    marginBottom: 25,
  },

  sectionTitle: {
    fontSize: 26,
    marginTop: 40,
    marginBottom: 12,
    fontFamily: "Playfair Display, serif",
  },

  textGrey: {
    fontSize: 17,
    opacity: 0.75,
    fontFamily: "Inter, sans-serif",
    lineHeight: "26px",
  },
};
