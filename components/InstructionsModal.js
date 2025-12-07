import { useEffect, useState } from "react";

const pink = "rgb(255, 0, 190)";

export default function InstructionsModal({ onClose }) {
  const [responsiveStyles, setResponsiveStyles] = useState({});

  /* -------------------------------------------------- */
  /* RESPONSIVE TUNING (same logic as Onboarding)        */
  /* -------------------------------------------------- */
  useEffect(() => {
    const isSmall = window.matchMedia("(max-height: 750px)").matches;

    if (isSmall) {
      setResponsiveStyles({
        title: { fontSize: 28 },
        sectionTitle: { fontSize: 22 },
        text: { fontSize: 14, lineHeight: "20px" },
      });
    }
  }, []);

  return (
    <div style={styles.overlay}>
      <div style={styles.closeButton} onClick={onClose}>
        ✕
      </div>

      <div style={styles.container}>
        <h1 style={{ ...styles.title, ...responsiveStyles.title }}>
          The Le Saint Game
        </h1>

        <p style={{ ...styles.text, ...responsiveStyles.text, marginBottom: 35 }}>
          Every bottle carries a story.
          <br />
          Scan bottles, earn Saint Points and unlock status.
          <br />
          Le Saint rewards the loyal.
        </p>

        <h2 style={{ ...styles.sectionTitle, ...responsiveStyles.sectionTitle }}>
          Saint Points
        </h2>
        <p style={{ ...styles.text, ...responsiveStyles.text }}>
          First scan of a bottle: +5 points.
          <br />
          Bottle scanned before: +1 point.
        </p>

        <h2
          style={{
            ...styles.sectionTitle,
            ...responsiveStyles.sectionTitle,
            marginTop: 40,
          }}
        >
          Levels
        </h2>
        <p style={{ ...styles.text, ...responsiveStyles.text }}>
          Saint Initiation → Young Saint → Rising Saint → The Le Saint Club
        </p>

        <h2
          style={{
            ...styles.sectionTitle,
            ...responsiveStyles.sectionTitle,
            marginTop: 40,
          }}
        >
          The Le Saint Club
        </h2>
        <p style={{ ...styles.text, ...responsiveStyles.text }}>
          Unlocks at 100 points.
          <br />
          Enter your email to receive exclusive access, releases and experiences.
        </p>
      </div>
    </div>
  );
}

/* -------------------------------------------------- */
/* STYLES                                              */
/* -------------------------------------------------- */
const styles = {
  overlay: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100vw",
    height: "100vh",
    zIndex: 9999,
    background: `
      radial-gradient(circle at top center,
      rgba(255,0,190,0.12),
      rgba(0,0,0,1) 55%)
    `,
    color: "#fff",
    display: "flex",
    justifyContent: "center",
    overflowY: "auto",
    padding: "40px 20px",
  },

  closeButton: {
    position: "absolute",
    top: "18px",
    right: "18px",
    width: 40,
    height: 40,
    borderRadius: 8,
    border: `2px solid ${pink}`,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: pink,
    fontSize: 24,
    fontWeight: "bold",
    cursor: "pointer",
    background: "rgba(0,0,0,0.4)",
    zIndex: 10000,
  },

  container: {
    maxWidth: 500,
    textAlign: "center",
    marginTop: 60,
    fontFamily: "Inter, sans-serif",
  },

  title: {
    fontSize: 34,
    fontFamily: "Playfair Display, serif",
    marginBottom: 25,
  },

  sectionTitle: {
    fontSize: 26,
    fontWeight: 700,
    fontFamily: "Playfair Display, serif",
    marginBottom: 10,
    marginTop: 30,
  },

  text: {
    fontSize: 16,
    opacity: 0.8,
    lineHeight: "24px",
    marginBottom: 20,
    fontFamily: "Inter, sans-serif",
  },
};
