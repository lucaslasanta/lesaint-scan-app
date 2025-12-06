// components/Onboarding.js
import { useState } from "react";
import { db } from "../lib/firebase";
import { doc, updateDoc } from "firebase/firestore";

const pink = "rgb(255, 0, 190)";

export default function Onboarding({ userId, onComplete }) {
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    if (!name.trim()) return;

    setLoading(true);

    try {
      await updateDoc(doc(db, "users", userId), {
        displayName: name.trim(), // NO formatting (F1)
      });

      // Store locally so onboarding never shows again
      localStorage.setItem("leSaintDisplayName", name.trim());

      onComplete();
    } catch (err) {
      console.error("Error saving name:", err);
    }

    setLoading(false);
  };

  return (
    <div style={styles.overlay}>
      <div style={styles.container}>
        
        {/* Small logo (L3) */}
        <img 
          src="/images/le-saint-logo.png" 
          style={styles.logo} 
          alt="Le Saint Logo"
        />

        {/* Title */}
        <h1 style={styles.title}>Choose your Saint Name</h1>

        {/* Input */}
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter your Saint Name"
          style={styles.input}
        />

        {/* Continue Button — BTN-A */}
        <button 
          onClick={handleSave} 
          disabled={loading}
          style={styles.continueButton}
        >
          {loading ? "Saving..." : "Continue"}
        </button>

      </div>
    </div>
  );
}

/* -------------------------- */
/*       STYLES               */
/* -------------------------- */

const styles = {
  overlay: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100vw",
    height: "100vh",
    background: `
      radial-gradient(circle at top center,
      rgba(255,0,190,0.10),
      rgba(0,0,0,1) 45%)
    `,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 9999,
    padding: "20px",
  },

  container: {
    width: "100%",
    maxWidth: "380px",
    textAlign: "center",
  },

  logo: {
    width: "140px",
    opacity: 0.85,
    marginBottom: "30px",
  },

  title: {
    fontSize: "28px",
    fontFamily: "Playfair Display, serif",
    fontWeight: 600,
    marginBottom: "25px",
    color: "#fff",
  },

  input: {
    width: "100%",
    padding: "12px 14px",
    fontSize: "16px",
    borderRadius: "6px",
    border: `1px solid rgba(255,255,255,0.25)`,
    background: "rgba(255,255,255,0.06)",
    color: "#fff",
    outline: "none",
    marginBottom: "25px",
  },

  continueButton: {
    padding: "10px 22px",
    fontSize: "18px",
    borderRadius: "25px",
    border: `2px solid ${pink}`,
    background: "transparent",
    color: pink,
    fontFamily: "Inter, sans-serif",
    cursor: "pointer",
    marginTop: "10px",
  },
};
