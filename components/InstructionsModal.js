import React, { useEffect } from "react";

const pink = "rgb(255, 0, 190)";

export default function InstructionsModal({ onClose }) {
  const isMobile =
    typeof window !== "undefined" && window.innerWidth < 480;

  /* ----------------------------------------------- */
  /* FREEZE BACKGROUND WHEN MODAL IS OPEN            */
  /* ----------------------------------------------- */
  useEffect(() => {
    document.body.style.overflow = "hidden"; // freeze background
    return () => {
      document.body.style.overflow = "auto"; // restore scroll
    };
  }, []);

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
        </p>

        {/* PRIZES */}
        <h2 style={styles.sectionTitle(isMobile)}>Prizes</h2>
        <p style={styles.textGrey(isMobile)}>
          Some bottles contain unique prizes. Look for them!
        </p>

        {/* SAINT POINTS */}
        <h2 style={styles.sectionTitle(isMobile)}>Saint Points</h2>
        <p style={styles.textGrey(isMobile)}>
          First scan of the bottle: +5 points.
          <br />
          Bottle already scanned by others: +1 point.
        </p>

        {/* LEVELS */}
        <h2 style={styles.sectionTitle(isMobile)}>Levels</h2>
        <p style={styles.textGrey(isMobile)}>
          The Le Saint Club
          <br />
          ↑
          <br />
          Rising Saint
          <br />
          ↑
          <br />
          Young Saint
          <br />
          ↑
          <br />
          Saint Initiation
        </p>

        {/* CLUB */}
        <h2 style={styles.sectionTitle(isMobile)}>The Le Saint Club</h2>
        <p style={styles.textGrey(isMobile)}>
          Unlocks at 100 points.
          <br />
          Exclusive access, releases and experiences.
        </p>
      </div>
    </div>
  );
}

/* -------------------------------------------------- */
/*                     STYLES                         */
/* -------------------------------------------------- */
const styles = {
  overlay: (isMobile) => ({
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100vh",

    /* KEY FIXES FOR iPHONE */
    overflowY: "auto",
    WebkitOverflowScrolling: "touch",
    overscrollBehaviorY: "contain",

    /* REMOVE touchAction:none — it breaks scrolling */
    // touchAction: "none",

    background: `
      radial-gradient(circle at top center,
      rgba(255,0,190,0.12),
      rgba(0,0,0,1) 55%)
    `,

    padding: isMobile ? "26px 16px" : "40px 20px",
    boxSizing: "border-box",
    color: "#fff",
    textAlign: "center",
    zIndex: 9999,

    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  }),

  inner: {
    width: "100%",
    maxWidth: 480,
    margin: "0 auto",
    paddingBottom: 40,
  },

  logo: (isMobile) => ({
    width: isMobile ? 120 : 150,
    marginTop: isMobile ? 5 : 10,
    marginBottom: isMobile ? 20 : 30,
    display: "block",
    opacity: 0.9,
  }),

  closeButton: (isMobile) => ({
    position: "fixed",
    top: isMobile ? 14 : 20,
    right: isMobile ? 14 : 20,
    width: isMobile ? 38 : 46,
    height: isMobile ? 38 : 46,
    borderRadius: 12,
    border: `2px solid ${pink}`,
    color: pink,
    background: "rgba(0,0,0,0.45)",
    fontSize: isMobile ? 18 : 24,
    fontFamily: "Inter, sans-serif",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    zIndex: 10000,
  }),

  title: (isMobile) => ({
    fontSize: isMobile ? 24 : 34,
    fontFamily: "Playfair Display, serif",
    marginBottom: isMobile ? 16 : 24,
  }),

  sectionTitle: (isMobile) => ({
    fontSize: isMobile ? 19 : 26,
    marginTop: isMobile ? 26 : 40,
    marginBottom: isMobile ? 8 : 12,
    fontFamily: "Playfair Display, serif",
  }),

  textGrey: (isMobile) => ({
    fontSize: isMobile ? 14 : 17,
    opacity: 0.75,
    fontFamily: "Inter, sans-serif",
    lineHeight: isMobile ? "21px" : "26px",
  }),
};
