// components/ClubJoinModal.js

import { useState } from "react";
import { doc, updateDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../lib/firebase";

const pink = "rgb(255, 0, 190)";

export default function ClubJoinModal({ userId, onComplete }) {
  const [email, setEmail] = useState("");

  const saveEmail = async () => {
    if (!email.trim()) return;

    // 1 — Update user document
    const userRef = doc(db, "users", userId);
    await updateDoc(userRef, {
      isLeSaintClubMember: true,
      clubEmail: email.trim(),
      clubJoinDate: serverTimestamp(),
    });

    // 2 — Create Club Members entry
    const memberRef = doc(db, "leSaintClubMembers", userId);
    await setDoc(memberRef, {
      userId,
      email: email.trim(),
      joinDate: serverTimestamp(),
    });

    onComplete();
  };

  return (
    <div style={styles.page}>
      <img src="/images/le-saint-logo.png" style={styles.logo} />

      <h1 style={styles.title}>Enter The Le Saint Club</h1>

      <p style={styles.subtitle}>
        Welcome to The Le Saint Club. Enter your email to receive
        exclusive access, releases and experiences.
      </p>

      <input
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Your Email"
        style={styles.input}
      />

      <button onClick={saveEmail} style={styles.button}>
        Join Now
      </button>
    </div>
  );
}

/* -------------------------------------------------- */
/* STYLES — IDENTICAL STRUCTURE TO ONBOARDING         */
/* -------------------------------------------------- */

const styles = {
  page: {
    position: "fixed",
    top: 0, left: 0,
    width: "100vw",
    height: "100vh",
    zIndex: 9999,
    background: `
      radial-gradient(circle at top center,
      rgba(255,0,190,0.12),
      rgba(0,0,0,1) 55%)
    `,
    color: "#fff",
    padding: "40px 20px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "flex-start",
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
    marginBottom: 20,
  },

  subtitle: {
    fontSize: 16,
    opacity: 0.85,
    fontFamily: "Inter, sans-serif",
    marginBottom: 30,
    maxWidth: 360,
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
