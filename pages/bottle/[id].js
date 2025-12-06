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

  // ---------------------------------------------------
  // POINT SYSTEM
  // ---------------------------------------------------
  const points = totalScans === 1 ? 5 : totalScans > 1 ? 1 : 0;

  // ---------------------------------------------------
  // BOTTLE LEGACY DISPLAY
  // ---------------------------------------------------
  let legacyText = "";
  if (totalScans <= 1) {
    legacyText = "First Saint Scan";
  } else {
    legacyText = `${totalScans - 1} Saint(s) before`;
  }

  const formattedDate = firstScanDate
    ? new Date(firstScanDate.toMillis()).toLocaleDateString("en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    : null;

  // ---------------------------------------------------
  // LEVEL SYSTEM
  // ---------------------------------------------------
  const totalPoints = points; // placeholder until user accounts exist

  let level = "Saint Initiation";
  let nextLevelPoints = 25;

  if (totalPoints >= 100) {
    level = "Fly High Club";
    nextLevelPoints = 0;
  } else if (totalPoints >= 25) {
    level = "Rising Saint";
    nextLevelPoints = 100;
  }

  // ----------------------------------
  // PROGRESS BAR (5 squares)
  // ----------------------------------
  const squares = 5;
  const progressPercentage = nextLevelPoints
    ? Math.min(1, totalPoints / nextLevelPoints)
    : 1;
  const filledSquares = Math.round(progressPercentage * squares);

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
      {/* LOGO */}
      <img src="/images/le-saint-logo.png" alt="Le Saint Logo" style={styles.logo} />

      {/* Bottle Number */}
      <h2 style={styles.bottleNumber}>Bottle Nº {id}</h2>

      {/* Spotify */}
      <Section title="Your Bottle Song">
        <a href={songURL} target="_blank" rel="noopener noreferrer" style={styles.link}>
          Play on Spotify ↗
        </a>
      </Section>

      {/* Bottle Legacy */}
      <Section title="Bottle Legacy">
        <p style={styles.text}>{legacyText}</p>
        {formattedDate && (
          <p style={styles.textSmall}>First scanned on {formattedDate}</p>
        )}
      </Section>

      {/* Prize Bottle */}
      {isPrizeBottle && (
        <Section title="PRIZE BOTTLE">
          <p style={styles.prizeText}>Reward available — {prizeType}</p>
        </Section>
      )}

      {/* Reward */}
      <Section title="Your Reward">
        <p style={styles.rewardText}>{points} Saint Points</p>
      </Section>

      {/* Status */}
      <Section title="Your Status">
        <p style={styles.text}>{level} · {totalPoints} points</p>
        <div style={styles.progressRow}>{squareElements}</div>
      </Section>

      {/* Fly High Club */}
      <Section title="Fly High Club">
        <p style={styles.text}>Unlock exclusive benefits at 100 points.</p>
      </Section>
    </div>
  );
}

// ----------------------------
// Reusable Section Component
// ----------------------------
function Section({ title, children }) {
  return (
    <div style={styles.section}>
      <h3 style={styles.sectionTitle}>{title}</h3>
      {children}
    </div>
  );
}

// ----------------------------
// STYLES
// ----------------------------
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
  logo: {
    width: 200,
    margin: "0 auto 20px auto",
  },
  bottleNumber: {
    fontSize: 36,
    marginBottom: 40,
    fontWeight: "600",
    fontFamily: "Inter, sans-serif",
  },
  section: {
    marginBottom: 45,
  },
  sectionTitle: {
    fontSize: 26,
    marginBottom: 10,
    fontWeight: "700",
  },
  text: { fontSize: 18, opacity: 0.85 },
  textSmall: { fontSize: 14, opacity: 0.65 },
  rewardText: { fontSize: 20, color: pink },
  prizeText: { fontSize: 18, color: pink, fontWeight: "600" },
  link: {
    color: pink,
    textDecoration: "none",
    fontSize: 18,
  },
  progressRow: {
    marginTop: 14,
    display: "flex",
    justifyContent: "center",
  },
};
