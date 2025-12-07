"use client";

import { useEffect, useState } from "react";

const pink = "rgb(255, 0, 190)";

export default function InstructionsModal({ onClose }) {
  const [responsiveStyles, setResponsiveStyles] = useState({});

  useEffect(() => {
    const isSmall = window.matchMedia("(max-height: 750px)").matches;
    if (isSmall) {
      setResponsiveStyles({
        title: { fontSize: 26 },
        sectionTitle: { fontSize: 22 },
        paragraph: { fontSize: 15 },
      });
    }
  }, []);

  return (
    <div style={styles.overlay}>
      <div style={styles.modal}>
        {/* CLOSE BUTTON */}
        <button onClick={onClose} style={styles.closeButton}>✕</button>

        <h1 style={{ ...styles.title, ...responsiveStyles.title }}>
          The Le Saint Game
        </h1>

        <p style={{ ...styles.paragraph, ...responsiveStyles.paragraph }}>
          Every bottle carries a story. Scan bottles, earn Saint Points and unlock status.
          Le Saint rewards the loyal.
        </p>

        <h2 style={{ ...styles.sectionTitle, ...responsiveStyles.sectionTitle }}>
          Saint Points
        </h2>
        <p style={{ ...styles.paragraph, ...responsiveStyles.paragraph }}>
          Be the first scan of the bottle: <span style={styles.pink}>+5 points</span>.<br />
          Every new bottle already scanned by others: <span style={styles.pink}>+1 point</span>.
        </p>

        <h2 style={{ ...styles.sectionTitle, ...responsiveStyles.sectionTitle }}>
          Levels
        </h2>
        <p style={{ ...styles.paragraph, ...responsiveStyles.paragraph }}>
          Saint Initiation → Young Saint → Rising Saint → The Le Saint Club
        </p>

        <h2 style={{ ...styles.sectionTitle, ...responsiveStyles.sectionTitle }}>
          The Le Saint Club
        </h2>
        <p style={{ ...styles.paragraph, ...responsiveStyles.paragraph }}>
          Unlocks at 100 points.<br />
          Enter your email to receive exclusive access, releases and experiences.
        </p>
      </div>
    </div>
  );
}

/* ------------------------- */
/* STYLES                    */
/* ------------------------- */

const styles = {
  overlay: {
    position: "fixed",
    top: 0,
    left: 0,
    height: "100vh",
    width: "100vw",
    background: `
      radial-gradient(circle at top center,
       rgba(255,0,190,0.12),
       rgba(0,0,0,1) 55%)
    `,
    zIndex: 9999,
    display: "flex",
    justifyContent: "center",
    overflowY: "auto",
    padding: "40px 20px",
  },

  modal: {
    width: "100%",
    maxWidth: "600px",
    textAlign: "center",
    color: "#fff",
    fontFamily: "Playfair Display, serif",
    paddingBottom: "60px",
  },

  closeButton: {
    position: "fixed",
    top: 20,
    right: 20,
    background: "transparent",
    border: `2px solid ${pink}`,
    borderRadius: 6,
    color: pink,
    padding: "6px 14px",
    fontSize: 20,
    cursor: "pointer",
    fontFamily: "Inter, sans-serif",
  },

  title: {
    fontSize: 32,
    marginBottom: 20,
  },

  sectionTitle: {
    fontSize: 24,
    marginTop: 35,
    marginBottom: 10,
    fontWeight: 700,
  },

  paragraph: {
    fontSize: 16,
    opacity: 0.8,
    fontFamily: "Inter, sans-serif",
    lineHeight: 1.5,
  },

  pink: {
    color: pink,
    fontWeight: 600,
  },
};
