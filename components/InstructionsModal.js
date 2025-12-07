// components/InstructionsModal.js
export default function InstructionsModal({ onClose }) {
  return (
    <div style={styles.overlay}>
      <div style={styles.inner}>
        
        {/* Close Button */}
        <button onClick={onClose} style={styles.closeButton}>✕</button>

        <h1 style={styles.title}>The Le Saint Game</h1>

        <p style={styles.text}>
          Every bottle carries a story.<br />
          Scan bottles, earn Saint Points and unlock status.<br />
          Le Saint rewards the loyal.
        </p>

        <h2 style={styles.sectionTitle}>Saint Points</h2>
        <p style={styles.text}>
          Be the first scan of the bottle: +5 points.<br />
          Every new bottle already scanned by others: +1 point.
        </p>

        <h2 style={styles.sectionTitle}>Levels</h2>
        <p style={styles.text}>
          Saint Initiation → Young Saint → Rising Saint → The Le Saint Club
        </p>

        <h2 style={styles.sectionTitle}>The Le Saint Club</h2>
        <p style={styles.text}>
          Unlocks at 100 points.<br />
          Enter your email to receive exclusive access,<br />
          releases and experiences.
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
    maxWidth: "100%",
    overflowX: "hidden",
    overflowY: "auto",
    background: `
      radial-gradient(circle at top center,
      rgba(255,0,190,0.12),
      rgba(0,0,0,1) 55%)
    `,
    color: "#fff",
    padding: "40px 20px",
    zIndex: 9999,
    textAlign: "center",
    touchAction: "none",            // ⭐ PREVENT iOS ZOOM
  },

  inner: {
    maxWidth: 480,
    margin: "0 auto",
  },

  closeButton: {
    position: "fixed",
    top: "20px",
    right: "20px",
    fontSize: 26,
    padding: "4px 14px",
    borderRadius: 14,
    border: "2px solid rgb(255,0,190)",
    background: "transparent",
    color: "rgb(255,0,190)",
    cursor: "pointer",
    zIndex: 10000,
  },

  title: {
    fontSize: 32,
    marginBottom: 25,
    fontFamily: "Playfair Display, serif",
  },

  sectionTitle: {
    fontSize: 26,
    marginTop: 40,
    marginBottom: 12,
    fontFamily: "Playfair Display, serif",
  },

  text: {
    fontSize: 17,                     // ⭐ MUST BE AT LEAST 16px
    opacity: 0.75,
    fontFamily: "Inter, sans-serif",
    lineHeight: 1.5,
  },
};
