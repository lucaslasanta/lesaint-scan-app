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
  const {
    totalScans = 0,
    firstScanDate,
    isPrizeBottle,
    prizeType,
    songURL,
  } = bottle;

  // ---------------------------
  // POINT SYSTEM
  // ---------------------------
  const points = totalScans === 1 ? 5 : totalScans > 1 ? 1 : 0;

  // ---------------------------
  // LEGACY
  // ---------------------------
  let legacyText = "";
  if (totalScans <= 1) {
    legacyText = "First Saint Scan";
  } else {
    legacyText = `${totalScans - 1} Saint(s) before`;
  }

  // Fix Firestore timestamp → JS date
  const formattedDate = firstScanDate
    ? new Date(firstScanDate.seconds * 1000).toLocaleDateString("en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    : null;

  // ---------------------------
  // LEVEL SYSTEM
  // ---------------------------
  const totalPoints = points;

  let level = "Saint Initiation";
  let nextLevelPoints = 25;
  let nextLevelName = "Rising Saint";

  if (totalPoints >= 100) {
    level = "Fly High Club";
    nextLevelPoints = 0;
    nextLevelName = "";
  } else if (totalPoints >= 25) {
    level = "Rising Saint";
    nextLevelPoints = 100;
    nextLevelName = "Fly High Club";
  }

  // Sentence under progress bar
  let nextLevelSentence = "";
  if (nextLevelPoints > 0) {
    nextLevelSentence = `${nextLevelPoints - totalPoints} points until ${nextLevelName}`;
  }

  // ---------------------------
  // 5-SQUARE PROGRESS BAR
  // ---------------------------
  const pink = "rgb(255, 0, 190)";
  const squares = 5;
  const filledSquares = Math.round(
    Math.min(1, totalPoints / nextLevelPoints) * squares
  );

  const squareElements = Array.from({ length: squares }).map((_, i) => (
    <div
      key={i}
      style={{
        width: 22,
        height: 22,
        margin: "0 4px",
        borderRadius: 4,
        backgroundColor: i < filledSquares ? pink : "rgba(255,255,255,0.15)",
      }}
    />
  ));

  return (
    <div style={styles.page}>
      {/* Logo */}
      <img src="/images/le-saint-logo.png" alt="Le Saint Logo" style={styles.logo} />

      {/* Bottle number */}
      <h2 style={styles.bottleNumber}>Bottle Nº {id}</h2>

      {/* Spotify */}
      <Section title="Your Bottle Song">
        <a href={songURL} target="_blank" rel="noopener noreferrer" style={styles.link}>
          Play on Spotify
        </a>
      </Section>

      {/* Legacy */}
      <Section title="Bottle Legacy">
        <p style={styles.smallText}>{legacyText}</p>
        {formattedDate && (
          <p style={styles.dateText}>First scanned on {formattedDate}</p>
        )}
      </Section>

      {/* Prize Bottle */}
      {isPrizeBottle && (
        <Section title="Prize Bottle">
          <p style={styles.prizeText}>Reward available — {prizeType}</p>
        </Section>
      )}

      {/* Reward */}
      <Section title="Your Reward">
        <p style={styles.rewardText}>{points} Saint Points</p>
      </Section>

      {/* Status */}
      <Section title="Your Status">
        <p style={styles.smallText}>{level} · {totalPoints} points</p>

        <div style={styles.progressRow}>{squareElements}</div>

        {nextLevelSentence && (
          <p style={styles.nextLevelText}>{nextLevelSentence}</p>
        )}
      </Section>

      {/* Fly High */}
      <Section title="Fly High Club">
        <p style={styles.smallText}>Unlock exclusive benefits at 100 points.</p>
      </Section>
    </div>
  );
}

// ---------------------------------------------------------------------
// SECTION COMPONENT
// ---------------------------------------------------------------------
function Section({ title, children }) {
  return (
    <div style={styles.section}>
      <h3 style={styles.sectionTitle}>{title}</h3>
      {children}
    </div>
  );
}

// ---------------------------------------------------------------------
// STYLES
// ---------------------------------------------------------------------
const pink = "rgb(255, 0, 190)";

const styles = {
  page: {
    minHeight: "100vh",
    background: "#000",
    color: "#fff",
    padding: "40px 20px",
    textAlign: "center",
    fontFamily: "Playfair Display, serif",
  },
  logo: { width: 200, margin: "0 auto 20px auto" },

  bottleNumber: {
    fontFamily: "Inter, sans-serif",
    fontSize: 36,
    marginBottom: 40,
    fontWeight: 700,
  },

  section: { marginBottom: 45 },

  sectionTitle: {
    fontSize: 26,
    marginBottom: 10,
    fontWeight: 700,
  },

  smallText: {
    fontFamily: "Inter, sans-serif",
    fontSize: 18,
    opacity: 0.85,
  },

  dateText: {
    fontFamily: "Inter, sans-serif",
    fontSize: 15,
    opacity: 0.65,
    marginTop: 4,
  },

  link: {
    color: pink,
    fontFamily: "Inter, sans-serif",
    fontSize: 18,
    textDecoration: "none",
  },

  rewardText: {
    fontSize: 20,
    color: pink,
    fontFamily: "Inter, sans-serif",
  },

  prizeText: {
    color: pink,
    fontSize: 18,
    fontFamily: "Inter, sans-serif",
    fontWeight: 600,
  },

  progressRow: {
    marginTop: 14,
    display: "flex",
    justifyContent: "center",
  },

  nextLevelText: {
    marginTop: 10,
    fontSize: 15,
    fontFamily: "Inter, sans-serif",
    opacity: 0.7,
  },
};
