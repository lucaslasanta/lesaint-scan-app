import { useEffect } from "react";
import { useRouter } from "next/router";
import { doc, getDoc } from "firebase/firestore";
import db from "../../lib/firebase";

export async function getServerSideProps({ params }) {
  const bottleRef = doc(db, "bottles", params.id);
  const bottleSnap = await getDoc(bottleRef);

  if (!bottleSnap.exists()) {
    return { notFound: true };
  }

  return {
    props: {
      id: params.id,
      bottle: bottleSnap.data(),
    },
  };
}

export default function BottlePage({ id, bottle }) {
  const scans = bottle.scans || [];
  const totalPoints = scans.length; // 1 scan = 1 point

  // LEVEL LOGIC -------------
  let level = "Saint Initiation";
  let nextLevelPoints = 25;

  if (totalPoints >= 100) {
    level = "Fly High Club";
    nextLevelPoints = 0;
  } else if (totalPoints >= 25) {
    level = "Rising Saint";
    nextLevelPoints = 100;
  }

  const progress =
    nextLevelPoints === 0
      ? 100
      : Math.min(100, Math.round((totalPoints / nextLevelPoints) * 100));

  // FIRST SCAN LOGIC --------
  const legacyText =
    scans.length === 0
      ? "First Saint Scan"
      : `Discovered by ${scans.length} Saints before`;

  return (
    <div style={styles.page}>
      {/* LOGO */}
      <img src="/images/le-saint-logo.png" alt="Le Saint Logo" style={styles.logo} />

      {/* Bottle Number */}
      <h2 style={styles.bottleNumber}>Bottle Nº {id}</h2>

      {/* SECTIONS */}
      <Section title="Your Bottle Song">
        <a href={bottle.songUrl} target="_blank" rel="noopener noreferrer" style={styles.link}>
          Play on Spotify →
        </a>
      </Section>

      <Section title="Bottle Legacy">
        <p style={styles.text}>{legacyText}</p>
      </Section>

      <Section title="Your Reward">
        <p style={styles.textDiamond}>◆ {totalPoints} Saint Point awarded</p>
      </Section>

      <Section title="Your Status">
        <p style={styles.text}>{level} · {totalPoints} points</p>

        {/* Progress Bar */}
        {nextLevelPoints > 0 && (
          <>
            <p style={styles.progressLabel}>
              Progress to next level ({totalPoints}/{nextLevelPoints})
            </p>
            <div style={styles.progressOuter}>
              <div style={{ ...styles.progressInner, width: `${progress}%` }}></div>
            </div>
          </>
        )}
      </Section>

      <Section title="Fly High Club">
        <p style={styles.text}>Unlock exclusive benefits at 100 points.</p>
      </Section>
    </div>
  );
}

/* -------------------------- */
/* SECTION COMPONENT           */
/* -------------------------- */

function Section({ title, children }) {
  return (
    <div style={styles.section}>
      <h3 style={styles.sectionTitle}>{title}</h3>
      {children}
      <div style={styles.divider}></div>
    </div>
  );
}

/* -------------------------- */
/* STYLES                      */
/* -------------------------- */

const pink = "rgb(255, 0, 190)"; // C0 M94 Y0 K0 converted to RGB

const styles = {
  page: {
    minHeight: "100vh",
    background: "#000",
    color: "#fff",
    padding: "40px 20px",
    textAlign: "center",
    fontFamily: "serif",
    animation: "fadeIn 1s ease",
  },
  logo: {
    width: "260px",
    margin: "0 auto 20px auto",
    opacity: 0.85,
  },
  bottleNumber: {
    fontSize: "26px",
    marginBottom: "40px",
    letterSpacing: "1px",
  },
  section: {
    marginBottom: "32px",
  },
  sectionTitle: {
    fontSize: "20px",
    marginBottom: "6px",
    fontWeight: "500",
  },
  text: {
    fontSize: "16px",
    opacity: 0.85,
  },
  textDiamond: {
    fontSize: "16px",
    color: pink,
  },
  divider: {
    width: "100%",
    height: "1px",
    background: "rgba(255,255,255,0.15)",
    marginTop: "20px",
  },
  link: {
    color: pink,
    textDecoration: "none",
    fontSize: "16px",
  },
  progressLabel: {
    marginTop: "10px",
    fontSize: "14px",
    opacity: 0.8,
  },
  progressOuter: {
    width: "80%",
    height: "6px",
    background: "rgba(255,255,255,0.15)",
    margin: "8px auto",
    borderRadius: "4px",
  },
  progressInner: {
    height: "6px",
    background: pink,
    borderRadius: "4px",
    transition: "width 1s ease",
  },
};
