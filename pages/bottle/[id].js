import { doc, getDoc } from "firebase/firestore";
import db from "../../lib/firebase";

/* -------------------------------------------------------------------------- */
/*                               SERVER SIDE DATA                              */
/* -------------------------------------------------------------------------- */

export async function getServerSideProps({ params }) {
  const bottleRef = doc(db, "bottles", params.id);
  const bottleSnap = await getDoc(bottleRef);

  if (!bottleSnap.exists()) {
    return { notFound: true };
  }

  const data = bottleSnap.data();

  // Ensure scans always exists (prevents 500)
  if (!data.scans || !Array.isArray(data.scans)) {
    data.scans = [];
  }

  return {
    props: {
      id: params.id,
      bottle: data,
    },
  };
}

/* -------------------------------------------------------------------------- */
/*                                   PAGE UI                                   */
/* -------------------------------------------------------------------------- */

export default function BottlePage({ id, bottle }) {
  const scans = bottle.scans;
  const totalPoints = scans.length;

  /* ------------------------------ LEVEL LOGIC ------------------------------ */
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

  /* ----------------------------- FIRST SCAN TEXT ---------------------------- */
  const legacyText =
    scans.length <= 1
      ? "First Saint Scan"
      : `Discovered by ${scans.length - 1} Saints before`;

  return (
    <div style={styles.page}>
      {/* Logo */}
      <img
        src="/images/le-saint-logo.png"
        alt="Le Saint Logo"
        style={styles.logo}
      />

      {/* Bottle Number */}
      <h2 style={styles.bottleNumber}>Bottle Nº {id}</h2>

      {/* Song */}
      <Section title="Your Bottle Song">
        <a
          href={bottle.songUrl}
          target="_blank"
          rel="noopener noreferrer"
          style={styles.link}
        >
          Play on Spotify →
        </a>
      </Section>

      {/* Legacy */}
      <Section title="Bottle Legacy">
        <p style={styles.text}>{legacyText}</p>
      </Section>

      {/* Reward */}
      <Section title="Your Reward">
        <p style={styles.textDiamond}>◆ {totalPoints} Saint Points</p>
      </Section>

      {/* Status */}
      <Section title="Your Status">
        <p style={styles.text}>
          {level} · {totalPoints} points
        </p>

        {nextLevelPoints > 0 && (
          <>
            <p style={styles.progressLabel}>
              Progress to next level ({totalPoints}/{nextLevelPoints})
            </p>
            <div style={styles.progressOuter}>
              <div
                style={{ ...styles.progressInner, width: `${progress}%` }}
              ></div>
            </div>
          </>
        )}
      </Section>

      {/* High Club */}
      <Section title="Fly High Club">
        <p style={styles.text}>Unlock exclusive benefits at 100 points.</p>
      </Section>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*                            REUSABLE SECTION BOX                            */
/* -------------------------------------------------------------------------- */

function Section({ title, children }) {
  return (
    <div style={styles.section}>
      <h3 style={styles.sectionTitle}>{title}</h3>
      {children}
      <div style={styles.divider}></div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*                                    STYLES                                   */
/* -------------------------------------------------------------------------- */

const pink = "rgb(255, 0, 190)"; // C0 M94 Y0 K0

const styles = {
  page: {
    minHeight: "100vh",
    background: "#000",
    color: "#fff",
    padding: "40px 20px",
    textAlign: "center",
    fontFamily: "Playfair Display, serif",
    animation: "fadeIn 1s ease",
  },

  logo: {
    width: "260px",
    margin: "0 auto 20px auto",
    opacity: 0.9,
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
    fontWeight: "500",
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
