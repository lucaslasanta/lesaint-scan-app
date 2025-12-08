import { useState, useEffect } from "react";
import { db } from "../lib/firebase";
import { doc, updateDoc, setDoc, serverTimestamp } from "firebase/firestore";

const pink = "rgb(255, 0, 190)";

export default function ClubJoinModal({ user, totalPoints, onComplete }) {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");

  // Mobile responsive overrides
  const [responsiveStyles, setResponsiveStyles] = useState({});

  // Lock scroll when modal is open
  useEffect(() => {
    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = original;
    };
  }, []);

  // Small-screen adjustments
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

  const submit = async () => {
    if (!email.trim() || !email.includes("@")) {
      setError("Please enter a valid email.");
      return;
    }

    try {
      // Update user profile
      await updateDoc(doc(db, "users", user.id), {
        email,
        isLeSaintClubMember: true,
      });

      // Add member to club
      await setDoc(doc(db, "leSaintClubMembers", user.id), {
        userId: user.id,
        email,
        displayName: user.displayName,
        totalPoints,
        joinedAt: serverTimestamp(),
      });

      onComplete();
    } catch (err) {
      console.error("Error saving club membership:", err);
      setError("Something went wrong. Try again.");
    }
  };

  return (
    <div style={wrapper}>
      <div style={{ ...styles.page, ...responsiveStyles.page }}>
        <img
          src="/images/le-saint-logo.png"
          style={{ ...styles.logo, ...responsiveStyles.logo }}
        />

        <h1 style={{ ...styles.title, ...responsiveStyles.title }}>
          The Le Saint Club
        </h1>

        <p style={styles.subtitle}>
          Welcome to The Le Saint Club. Enter your email to receive exclusive
          access, releases and experiences.
        </p>

        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email address"
          style={{ ...styles.input, ...responsiveStyles.input }}
        />

        {error && <p style={styles.error}>{error}</p>}

        <button
          onClick={submit}
          style={{ ...styles.button, ...responsiveStyles.button }}
        >
          Continue
        </button>
      </div>
    </div>
  );
}

/* -------------------------------------------------- */
/* FULLSCREEN SAFE-AREA WRAPPER (iPhone FIX)          */
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

  subtitle: {
    fontSize: 16,
    lineHeight: "22px",
    opacity: 0.85,
    fontFamily: "Inter, sans-serif",
    marginBottom: 30,
    padding: "0 10px",
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

  error: {
    color: "salmon",
    fontSize: 14,
    marginTop: -20,
    marginBottom: 20,
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
