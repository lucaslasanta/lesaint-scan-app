import { useState, useEffect } from "react";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../lib/firebase";

const pink = "rgb(255, 0, 190)";

export default function Onboarding({ userId, onComplete }) {
  const [name, setName] = useState("");

  // Responsive overrides
  const [responsiveStyles, setResponsiveStyles] = useState({});

  // Lock body scroll when onboarding is shown
  useEffect(() => {
    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = original;
    };
  }, []);

  useEffect(() => {
    const isSmall = window.matchMedia("(max-height: 750px)").matches;

    if (isSmall) {
      setResponsiveStyles({
        page: { paddingTop: "20px" },
        logo: { marginTop: 10, marginBottom: 30 },
        title: { fontSize: 26, marginBottom: 20 },
        input: { marginBottom: 25 },
        button: { marginTop: 10 },
      });
    }
  }, []);

  const saveName = async () => {
    if (!name.trim()) return;

    localStorage.setItem("leSaintDisplayName", name.trim());

    await updateDoc(doc(db, "users", userId), {
      displayName: name.trim(),
    });

    onComplete();
  };

  return (
    <div style={wrapper}>
      <div style={{ ...styles.page, ...responsiveStyles.page }}>
        <img
          src="/images/le-saint-logo.png"
          style={{ ...styles.logo, ...responsiveStyles.logo }}
        />

        <h1 style={{ ...styles.title, ...responsiveStyles.title }}>
          Choose your Saint Name
        </h1>

        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Saint Name"
          style={{ ...styles.input, ...responsiveStyles.input }}
        />

        <button
          onClick={saveName}
          style={{ ...styles.button, ...responsiveStyles.button }}
        >
          Continue
        </button>
      </div>
    </div>
  );
}

/* -------------------------------------------------- */
/* FULL-SCREEN SAFE-AREA WRAPPER (iPhone FIX)         */
/* -------------------------------------------------- */

const wrapper = {
  position: "fixed",
  top: 0,
  left: 0,
  width: "100vw",
  height: "100vh",
  overflowY: "auto",
  WebkitOverflowScrolling: "touch",
  paddingTop: "max(40px, env(safe-area-inset-top))",
  paddingBottom: "env(safe-area-inset-bottom)",
  paddingLeft: "env(safe-area-inset-left)",
  paddingRight: "env(safe-area-inset-right)",
  background: `
    radial-gradient(circle at top center,
      rgba(255,0,190,0.12),
      rgba(0,0,0,1) 55%)
  `,
  display: "flex",
  justifyContent: "flex-start",
  textAlign: "center",
};


/* -------------------------------------------------- */
/* ORIGINAL UI (UNCHANGED VISUALS)                    */
/* -------------------------------------------------- */

const styles = {
  page: {
    width: "100%",
    maxWidth: "420px",
    margin: "0 auto",
    minHeight: "100%",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    color: "#fff",
    textAlign: "center",
  },

  logo: {
    width: 140,
    marginTop: 40,
    marginBottom: 40,
  },

  title: {
    fontSize: 30,
    fontFamily: "Playfair Display, serif",
    marginBottom: 30,
  },

  input: {
    width: "90%",
    maxWidth: 420,
    padding: "14px 16px",
    fontSize: 18,
    borderRadius: 8,
    border: "1px solid rgba(255,255,255,0.35)",
    background: "#000",
    color: "#fff",
    marginBottom: 35,
    fontFamily: "Inter, sans-serif",
  },

  button: {
    padding: "12px 26px",
    borderRadius: 30,
    border: `2px solid ${pink}`,
    fontSize: 20,
    color: pink,
    background: "transparent",
    cursor: "pointer",
    fontFamily: "Inter, sans-serif",
  },
};
