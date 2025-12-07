import React from "react";

const pink = "rgb(255, 0, 190)";

export default function InstructionsModal({ onClose }) {
  const isMobile =
    typeof window !== "undefined" && window.innerWidth < 480;

  return (
    <div style={styles.overlay(isMobile)}>
      {/* CLOSE BUTTON */}
      <div style={styles.closeButton(isMobile)} onClick={onClose}>
        ✕
      </div>

      {/* LOGO */}
      <img
        src="/images/le-saint-logo.png"
        style={styles.logo(isMobile)}
        alt="Le Saint"
      />

      <div style={styles.inner}>
        {/* TITLE */}
        <h1 style={styles.title(isMobile)}>The Le Saint Game</h1>

        <p style={styles.textGrey(isMobile)}>
          Every bottle carries a story.
          <br />
          Scan bottles, earn Saint Points and unlock status.
          <br />
          Le Saint rewards the loyal.
        </p>

        {/* SAINT POINTS */}
        <h2 style={styles.sectionTitle(isMobile)}>Saint Points</h2>
        <p style={styles.textGrey(isMobile)}>
          Be the first scan of the bottle: +5 points.
          <br />
          Every new bottle already scanned by others: +1 point.
        </p>

        {/* LEVELS */}
        <h2 style={styles.sectionTitle(isMobile)}>Levels</h2>
        <p style={styles.textGrey(isMobile)}>
          Saint Initiation → Young Saint → Rising Saint → The Le Saint Club
        </p>

        {/* CLUB */}
        <h2 style={styles.sectionTitle(isMobile)}>The Le Saint Club</h2>
        <p style={styles.textGrey(isMobile)}>
          Unlocks at 100 points.
          <br />
          Enter your email to receive exclusive access,
          releases and experiences.
        </p>
      </div>
    </div>
  );
}

/* -------------------------------------------------- */
/* STYLES (with mobile scaling + logo added)          */
/* -------------------------------------------------- */
const styles = {
  overlay: (isMobile) => ({
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    maxWidth: "100%",
    height: "100vh",
    overflowY: "auto",
    WebkitOverflowScrolling: "touch",
    background: `
      radial-gradient(circle at top center,
      rgba(255,0,190,0.12),
      rgba(0,0,0,1) 55%)
    `,
    padding: isMobile ? "30px 18px" : "40px 20px",
    boxSizing: "border-box",
    color: "#fff",
    textAlign: "center",
    zIndex: 9999,
  }),

  inner: {
    width: "100%",
    maxWidth: 480,
    margin: "0 auto",
    marginTop: 10,
  },

  logo: (isMobile) => ({
    width: isMobile ? 130 : 150,
    margin: "0 auto 30px auto",
    display: "block",
    opacity: 0.9,
  }),

  closeButton: (isMobile) => ({
    position: "fixed",
    top: isMobile ? 15 : 20,
    right: isMobile ? 15 : 20,
    width: isMobile ? 40 : 46,
    height: isMobile ? 40 : 46,
    borderRadius: 12,
    border: `2px solid ${pink}`,
    color: pink,
    background: "rgba(0,0,0,0.4)",
    fontSize: isMobile ? 20 : 24,
    fontFamily: "Inter, sans-serif",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    zIndex: 10000,
  }),

  title: (isMobile) => ({
    fontSize: isMobile ? 26 : 34,
    fontFamily: "Playfair Display, serif",
    marginBottom: isMobile ? 18 : 25,
  }),

  sectionTitle: (isMobile) => ({
    fontSize: isMobile ? 20 : 26,
    marginTop: isMobile ? 28 : 40,
    marginBottom: isMobile ? 8 : 12,
    fontFamily: "Playfair Display, serif",
  }),

  textGrey: (isMobile) => ({
    fontSize: isMobile ? 14.5 : 17,
    opacity: 0.75,
    fontFamily: "Inter, sans-serif",
    lineHeight: isMobile ? "22px" : "26px",
  }),
};
