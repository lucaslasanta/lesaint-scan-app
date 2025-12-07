"use client";

import React from "react";

const pink = "rgb(255,0,190)";

export default function InstructionsModal({ onClose }) {
  return (
    <div style={styles.page}>
      <button onClick={onClose} style={styles.closeButton}>✕</button>

      <h1 style={styles.title}>The Le Saint Game</h1>

      <div style={styles.section}>
        <h2 style={styles.sectionTitle}>Every bottle carries a story.</h2>
        <p style={styles.textGray}>
          Scan bottles, earn Saint Points and unlock status.<br />
          Le Saint rewards the loyal.
        </p>
      </div>

      <div style={styles.section}>
        <h2 style={styles.sectionTitle}>Saint Points</h2>
        <p style={styles.textGray}>
          First scan of a bottle: +5 points.<br />
          Bottle scanned before: +1 point.
        </p>
      </div>

      <div style={styles.section}>
        <h2 style={styles.sectionTitle}>Levels</h2>
        <p style={styles.textGray}>
          Saint Initiation → Young Saint → Rising Saint → The Le Saint Club
        </p>
      </div>

      <div style={styles.section}>
        <h2 style={styles.sectionTitle}>The Le Saint Club</h2>
        <p style={styles.textGray}>
          Unlocks at 100 points.<br />
          Enter your email to receive exclusive access,<br />
          releases and experiences.
        </p>
      </div>
    </div>
  );
}

const styles = {
  page: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100vw",
    height: "100vh",
    background: `
      radial-gradient(circle at top center,
       rgba(255,0,190,0.12),
       rgba(0,0,0,1) 55%)
    `,
    zIndex: 9999,
    padding: "40px 20px",
    overflowY: "auto",
    textAlign: "center",
    color: "#fff",
    fontFamily: "Playfair Display, serif",
  },

  closeButton: {
    position: "absolute",
    top: 20,
    right: 20,
    background: "transparent",
    border: `2px solid ${pink}`,
    color: pink,
    width: 36,
    height: 36,
    borderRadius: 6,
    fontSize: 20,
    cursor: "pointer",
  },

  title: {
    fontSize: 32,
    marginBottom: 40,
  },

  section: {
    marginBottom: 35,
  },

  sectionTitle: {
    fontSize: 24,
    marginBottom: 8,
  },

  textGray: {
    fontSize: 15,
    opacity: 0.75,
    lineHeight: 1.4,
    fontFamily: "Inter, sans-serif",
  },
};
