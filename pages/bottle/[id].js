import { doc, getDoc } from "firebase/firestore";
import db from "../../lib/firebase";

export async function getServerSideProps({ params }) {
  const bottleRef = doc(db, "bottles", params.id);
  const snap = await getDoc(bottleRef);

  if (!snap.exists()) return { notFound: true };

  return {
    props: {
      id: params.id,
      bottle: snap.data(),
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

  // -----------------------------
  // POINT SYSTEM
  // -----------------------------
  const points = totalScans === 1 ? 5 : totalScans > 1 ? 1 : 0;
  const totalPoints = points;

  // -----------------------------
  // LEGACY — now ONLY date
  // -----------------------------
  const formattedDate = firstScanDate
    ? new Date(firstScanDate).toLocaleDateString("en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    : null;

  // -----------------------------
  // LEVEL SYSTEM (revised tiers)
  // -----------------------------
  let level = "Saint Initiation";
  let tierMin = 0;
  let tierMax = 24;
  let nextLevelName = "Young Saint";

  if (totalPoints >= 25 && totalPoints < 50) {
    level = "Young Saint";
    tierMin = 25;
    tierMax = 49;
    nextLevelName = "Rising Saint";
  } else if (totalPoints >= 50 && totalPoints < 100) {
    level = "Rising Saint";
    tierMin = 50;
    tierMax = 99;
    nextLevelName = "Fly High Club";
  } else if (totalPoints >= 100) {
    level = "Fly High Club";
    tierMin = 100;
    tierMax = 100; 
    nextLevelName = null;
  }

  // -----------------------------
  // PROGRESS BAR CALCULATION
  // -----------------------------
  const squares = 5;

  let tierProgress =
    tierMax === tierMin
      ? 1
      : (totalPoints - tierMin) / (tierMax - tierMin);

  tierProgress = Math.max(0, Math.min(1, tierProgress));

  const filledSquares = Math.round(tierProgress * squares);

  const squareElements = Array.from({ length: squares }).map((_, i) => (
    <div
      key={i}
      style={{
        width: 22,
        height: 22,
        margin: "0 4px",
        borderRadius: 4,
        backgroundColor:
          i < filledSquares ? pink : "rgba(255,255,255,0.18)",
      }}
    />
  ));

  return (
    <div style={styles.page}>
      {/* LOGO */}
      <img src="/images/le-saint-logo.png" style={styles.logo} />

      {/* Bottle Number */}
      <h1 style={styles.bottleNumber}>Bottle Nº {id}</h1>

      <div style={styles.separator}></div>

      {/* Bottle Song */}
      <Section title="Bottle Song">
        <a href={songURL} target="_blank" rel="noopener noreferrer" style={styles.spotifyButton}>
          Play on Spotify
        </a>
      </Section>

      <div style={styles.separator}></div>

      {/* Legacy */}
      <Section title="Bottle Legacy">
        {formattedDate && (
          <p style={styles.textSmall}>First scanned on {formattedDate}</p>
        )}
      </Section>

      <div style={styles.separator}></div>

      {/* Reward */}
      <Section title="Reward">
        <p style={styles.rewardText}>{points} Saint Points</p>
      </Section>

      <div style={styles.separator}></div>

      {/* STATUS */}
      <Section title="YOUR STATUS">
        <p style={styles.text}>
          {level} · {totalPoints} points
        </p>
        <div style={styles.progressRow}>{squareElements}</div>

        {nextLevelName && (
          <p style={styles.nextLevelText}>
            {tierMax - totalPoints + 1} points to reach {nextLevelName}
          </p>
        )}
      </Section>

      <div style={styles.separator}></div>

      {/* Fly High Club */}
      <Section title="Fly High Club">
        <p style={styles.textSmall}>Unlock at 100 points.</p>
      </Section>
    </div>
  );
}

// -------------------------------------------
// REUSABLE SECTION COMPONENT
// -------------------------------------------
function Section({ title, children }) {
  return (
    <div style={styles.section}>
      <h2 style={styles.sectionTitle}>{title}</h2>
      {children}
    </div>
  );
}

// -------------------------------------------
// STYLES
// -------------------------------------------
const pink = "rgb(255, 0, 190)";

const styles = {
  page: {
    minHeight: "100vh",
    background: "linear-gradient(to bottom, #000000, #0a0006, #14000C)",
    color: "#fff",
    padding: "40px 20px",
    textAlign: "center",
    fontFamily: "Playfair Display, serif",
  },

  logo: {
    width: 160,
    margin: "0 auto 20px auto",
    opacity: 0.9,
  },

  bottleNumber: {
    fontSize: 36,
    marginBottom: 20,
    fontFamily: "Inter, sans-serif",
    fontWeight: 700,
  },

  separator: {
    height: 1,
    width: "70%",
    maxWidth: "260px",
    background: "rgba(255,255,255,0.18)",
    margin: "30px auto",
  },

  section: {
    marginBottom: 35,
  },

  sectionTitle: {
    fontSize: 26,
    marginBottom: 10,
    fontWeight: 700,
  },

  text: {
    fontSize: 18,
    opacity: 0.85,
    fontFamily: "Inter, sans-serif",
  },

  textSmall: {
    fontSize: 14,
    opacity: 0.7,
    fontFamily: "Inter, sans-serif",
  },

  rewardText: {
    fontSize: 20,
    color: pink,
    fontWeight: 600,
    fontFamily: "Inter, sans-serif",
  },

  spotifyButton: {
    display: "inline-block",
    padding: "10px 22px",
    borderRadius: "25px",
    border: `2px solid ${pink}`,
    color: pink,
    textDecoration: "none",
    fontSize: 18,
    marginTop: 6,
    fontFamily: "Inter, sans-serif",
  },

  progressRow: {
    marginTop: 12,
    display: "flex",
    justifyContent: "center",
  },

  nextLevelText: {
    marginTop: 10,
    fontSize: 14,
    opacity: 0.8,
    fontFamily: "Inter, sans-serif",
  },
};
