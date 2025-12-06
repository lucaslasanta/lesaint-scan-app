import { doc, getDoc } from "firebase/firestore";
import db from "../../lib/firebase";

export async function getServerSideProps({ params }) {
  const bottleRef = doc(db, "bottles", params.id);
  const bottleSnap = await getDoc(bottleRef);

  if (!bottleSnap.exists()) return { notFound: true };

  return {
    props: {
      id: params.id,
      bottle: bottleSnap.data(),
    },
  };
}

export default function BottlePage({ id, bottle }) {
  const scans = bottle.scans || [];
  const totalPoints = scans.length;

  // ---------------------------
  // FIXED BOTTLE LEGACY LOGIC
  // ---------------------------
  let legacyText = "";
  if (totalPoints === 0) legacyText = "First Saint Scan";
  else if (totalPoints === 1) legacyText = "1 Saint before";
  else legacyText = `${totalPoints} Saints before`;

  // ---------------------------
  // LEVEL LOGIC
  // ---------------------------
  let level = "Saint Initiation";
  let nextLevelPoints = 25;

  if (totalPoints >= 100) {
    level = "Fly High Club";
    nextLevelPoints = 0;
  } else if (totalPoints >= 25) {
    level = "Rising Saint";
    nextLevelPoints = 100;
  }

  // ---------------------------
  // 5-SQUARE PROGRESS BAR
  // ---------------------------
  const totalSquares = 5;
  const progressRatio =
    nextLevelPoints === 0 ? 1 : totalPoints / nextLevelPoints;

  const filledSquares = Math.min(
    totalSquares,
    Math.floor(progressRatio * totalSquares)
  );

  const squares = Array.from({ length: totalSquares }, (_, i) => i < filledSquares);

  const pink = "rgb(255,0,190)"; // C0 M94 Y0 K0

  // ---------------------------
  // PRIZE BOTTLE BLOCK
  // ---------------------------
  const isPrizeBottle = bottle.isPrizeBottle === true;

  return (
    <div style={styles.page}>
      {/* LOGO */}
      <img
        src="/images/le-saint-logo.png"
        alt="Le Saint Logo"
        style={styles.logo}
      />

      {/* Bottle Number */}
      <h2 style={styles.bottleNumber}>Bottle Nº {id}</h2>

      {/* Prize Bottle Announcement */}
      {isPrizeBottle && (
        <div style={styles.prizeBox}>
          <h3 style={styles.sectionTitle}>🎁 Prize Bottle</h3>
          <p style={styles.text}>
            This bottle unlocks an exclusive Le Saint reward.
          </p>
        </div>
      )}

      {/* Bottle Song */}
      <Section title="Your Bottle Song">
        <a
          href={bottle.songURL}
          target="_blank"
          rel="noopener noreferrer"
          style={styles.link}
        >
          Play on Spotify ↗
        </a>
      </Section>

      {/* Bottle Legacy */}
      <Section title="Bottle Legacy">
        <p style={styles.text}>{legacyText}</p>
      </Section>

      {/* Reward */}
      <Section title="Your Reward">
        <p style={styles.reward}>
          ❧ {totalPoints} Saint Points
        </p>
      </Section>

      {/* Status */}
      <Section title="Your Status">
        <p style={styles.text}>
          {level} · {totalPoints} points
        </p>

        {/* Progress Bar Only if not max level */}
        {nextLevelPoints > 0 && (
          <div style={styles.progressContainer}>
            {squares.map((filled, i) => (
              <div
                key={i}
                style={{
                  ...styles.square,
                  backgroundColor: filled ? pink : "rgba(255,255,255,0.15)",
                }}
              />
            ))}
          </div>
        )}
      </Section>

      {/* Fly High Club */}
      <Section title="Fly High Club">
        <p style={styles.text}>
          Unlock exclusive benefits at 100 points.
        </p>
      </Section>
    </div>
  );
}

/* -------------------------- */
/* SECTION COMPONENT          */
/* -------------------------- */

function Section({ title, children }) {
  return (
    <div style={styles.section}>
      <h3 style={styles.sectionTitle}>{title}</h3>
      {children}
    </div>
  );
}

/* -------------------------- */
/* STYLES                     */
/* -------------------------- */

const pink = "rgb(255,0,190)";

const styles = {
  page: {
    minHeight: "100vh",
    background: "#000",
    color: "#fff",
    padding: "40px 20px",
    textAlign: "center",
    fontFamily: "Inter, sans-serif",
  },
  logo: {
    width: "200px",
    margin: "0 auto 30px auto",
    opacity: 0.9,
  },
  bottleNumber: {
    fontFamily: "Inter",
    fontSize: "28px",
    marginBottom: "40px",
    fontWeight: "700",
    letterSpacing: "0.5px",
  },
  section: {
    marginBottom: "48px",
  },
  sectionTitle: {
    fontFamily: "Playfair Display",
    fontSize: "22px",
    fontWeight: "700",
    marginBottom: "10px",
  },
  text: {
    fontSize: "16px",
    opacity: 0.85,
  },
  reward: {
    fontSize: "16px",
    color: pink,
    fontWeight: "600",
    letterSpacing: "0.3px",
  },
  link: {
    color: pink,
    textDecoration: "none",
    fontSize: "16px",
    fontWeight: "600",
  },

  /* 5-square progress */
  progressContainer: {
    marginTop: "18px",
    display: "flex",
    justifyContent: "center",
    gap: "8px",
  },
  square: {
    width: "22px",
    height: "22px",
    borderRadius: "4px",
    transition: "0.4s",
  },

  /* Prize Box */
  prizeBox: {
    background: "rgba(255,255,255,0.05)",
    padding: "20px",
    borderRadius: "10px",
    marginBottom: "40px",
    border: `1px solid ${pink}`,
  },
};
