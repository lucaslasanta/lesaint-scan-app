import { doc, getDoc } from "firebase/firestore";
import db from "../../lib/firebase";

// --------------------------------------------------
// SERVER-SIDE FETCH
// --------------------------------------------------
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

// --------------------------------------------------
// PAGE COMPONENT
// --------------------------------------------------
export default function BottlePage({ id, bottle }) {
  const {
    totalScans = 0,
    firstScanDate,
    isPrizeBottle,
    prizeType,
    songURL,
  } = bottle;

  // --------------------------------------------------
  // POINT SYSTEM
  // --------------------------------------------------
  const points = totalScans === 1 ? 5 : totalScans > 1 ? 1 : 0;
  const totalPoints = points; // placeholder until user accounts exist

  // --------------------------------------------------
  // BOTTLE LEGACY (PREMIUM SIMPLIFIED VERSION)
  // --------------------------------------------------
  const formattedDate = firstScanDate
    ? new Date(firstScanDate.toMillis()).toLocaleDateString("en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    : null;

  // --------------------------------------------------
  // LEVEL SYSTEM (FINAL VERSION)
  // --------------------------------------------------
  let level = "Saint Initiation";
  let nextLevelPoints = 25;

  if (totalPoints >= 100) {
    level = "Fly High Club";
    nextLevelPoints = 0;
  } else if (totalPoints >= 50) {
    level = "Rising Saint";
    nextLevelPoints = 100;
  } else if (totalPoints >= 25) {
    level = "Young Saint";
    nextLevelPoints = 50;
  }

  // Next-level text
  const nextLevelText =
    level === "Saint Initiation"
      ? `${25 - totalPoints} points until Young Saint`
      : level === "Young Saint"
      ? `${50 - totalPoints} points until Rising Saint`
      : level === "Rising Saint"
      ? `${100 - totalPoints} points until Fly High Club`
      : null;

  // --------------------------------------------------
  // PROGRESS BAR (5 SQUARES)
  // --------------------------------------------------
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

  // --------------------------------------------------
  // RENDER
  // --------------------------------------------------
  return (
    <div style={styles.page}>
      {/* LOGO */}
      <img src="/images/le-saint-logo.png" alt="Le Saint Logo" style={styles.logo} />

      {/* Bottle Number */}
      <h2 style={styles.bottleNumber}>Bottle Nº {id}</h2>

      {/* Bottle Song */}
      <Section title="Bottle Song">
        <a href={songURL} target="_blank" rel="noopener noreferrer" style={styles.button}>
          Play on Spotify
        </a>
      </Section>

      {/* Bottle Legacy */}
      <Section title="Bottle Legacy">
        {formattedDate && <p style={styles.textSmall}>First scanned on {formattedDate}</p>}
      </Section>

      {/* Prize Bottle */}
      {isPrizeBottle && (
        <Section title="PRIZE BOTTLE">
          <p style={styles.prizeText}>Reward available — {prizeType}</p>
        </Section>
      )}

      {/* Reward */}
      <Section title="Reward">
        <p style={styles.rewardText}>{points} Saint Points</p>
      </Section>

      {/* Status */}
      <Section title="Your Status">
        <p style={styles.text}>{level} · {totalPoints} points</p>
        <div style={styles.progressRow}>{squareElements}</div>
        {nextLevelText && <p style={styles.nextLevelText}>{nextLevelText}</p>}
      </Section>

      {/* Fly High Club */}
      <Section title="Fly High Club">
        <p style={styles.flyHighText}>Unlock at 100 points.</p>
      </Section>
    </div>
  );
}

// --------------------------------------------------
// Reusable Section Component
// --------------------------------------------------
function Section({ title, children }) {
  return (
    <div style={styles.section}>
      <h3 style={styles.sectionTitle}>{title}</h3>
      {children}
      <div style={styles.separator}></div>
    </div>
  );
}

// --------------------------------------------------
// STYLES
// --------------------------------------------------
const pink = "rgb(255, 0, 190)";

const styles = {
  page: {
    minHeight: "100vh",
    background: "linear-gradient(to bottom, #0a0008, #000)",
    color: "#fff",
    padding: "40px 14px 60px 14px",
    textAlign: "center",
    fontFamily: "Playfair Display, serif",
  },

  logo: {
    width: 210,
    opacity: 0.95,
    margin: "0 auto 20px auto",
  },

  bottleNumber: {
    fontSize: 40,
    marginBottom: 35,
    fontFamily: "Inter, sans-serif",
    fontWeight: "700",
  },

  section: {
    marginBottom: 48,
  },

  sectionTitle: {
    fontSize: 26,
    fontWeight: "700",
    marginBottom: 12,
  },

  text: { fontSize: 18, opacity: 0.9 },
  textSmall: { fontSize: 16, opacity: 0.7 },

  rewardText: { fontSize: 22, color: pink, fontWeight: "600" },
  prizeText: { fontSize: 18, color: pink, fontWeight: "600" },

  flyHighText: { fontSize: 18, opacity: 0.85 },

  nextLevelText: {
    marginTop: 10,
    fontSize: 15,
    opacity: 0.75,
  },

  button: {
    display: "inline-block",
    padding: "12px 26px",
    borderRadius: 30,
    border: `1px solid ${pink}`,
    color: pink,
    fontSize: 18,
    textDecoration: "none",
    fontFamily: "Inter, sans-serif",
    transition: "0.2s",
  },

  progressRow: {
    marginTop: 14,
    display: "flex",
    justifyContent: "center",
  },

  separator: {
    marginTop: 28,
    height: 1,
    width: "80%",
    background: "rgba(255,255,255,0.08)",
    marginLeft: "auto",
    marginRight: "auto",
  },
};
