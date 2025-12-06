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
    songURL,
    isPrizeBottle,
    prizeType,
  } = bottle;

  // -----------------------------------------------
  // POINTS
  // -----------------------------------------------
  const points = totalScans === 1 ? 5 : totalScans > 1 ? 1 : 0;
  const totalPoints = points;

  // -----------------------------------------------
  // DATE FORMAT
  // -----------------------------------------------
  const formattedDate = firstScanDate
    ? new Date(firstScanDate.toMillis()).toLocaleDateString("en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    : null;

  // -----------------------------------------------
  // LEVEL SYSTEM
  // -----------------------------------------------
  let level = "Saint Initiation";
  let nextLevelAt = 25;

  if (totalPoints >= 100) {
    level = "Fly High Club";
    nextLevelAt = 0;
  } else if (totalPoints >= 50) {
    level = "Rising Saint";
    nextLevelAt = 100;
  } else if (totalPoints >= 25) {
    level = "Young Saint";
    nextLevelAt = 50;
  }

  const pink = "rgb(255, 0, 190)";

  // -----------------------------------------------
  // PROGRESS BAR
  // -----------------------------------------------
  const squares = 5;
  const progress =
    nextLevelAt === 0 ? 1 : Math.min(1, totalPoints / nextLevelAt);
  const filled = Math.round(progress * squares);

  const progressSquares = Array.from({ length: squares }).map((_, i) => (
    <div
      key={i}
      style={{
        width: 22,
        height: 22,
        borderRadius: 4,
        margin: "0 4px",
        backgroundColor: i < filled ? pink : "rgba(255,255,255,0.18)",
      }}
    />
  ));

  return (
    <div style={styles.page}>
      {/* Logo */}
      <img src="/images/le-saint-logo.png" style={styles.logo} />

      {/* Bottle Number */}
      <h2 style={styles.bottleNumber}>Bottle Nº {id}</h2>

      {/* Separator */}
      <div style={styles.separator} />

      {/* Bottle Song */}
      <h3 style={styles.sectionTitle}>Bottle Song</h3>
      <a href={songURL} target="_blank" rel="noopener noreferrer" style={styles.spotifyButton}>
        Play on Spotify
      </a>

      <div style={styles.separator} />

      {/* Bottle Legacy */}
      <h3 style={styles.sectionTitle}>Bottle Legacy</h3>
      {formattedDate && (
        <p style={styles.regularText}>First scanned on {formattedDate}</p>
      )}

      <div style={styles.separator} />

      {/* Reward */}
      <h3 style={styles.sectionTitle}>Reward</h3>
      <p style={styles.rewardText}>{points} Saint Points</p>

      <div style={styles.separator} />

      {/* Status */}
      <h3 style={styles.sectionTitle}>Your Status</h3>
      <p style={styles.regularText}>{level} · {totalPoints} points</p>

      <div style={styles.progressRow}>{progressSquares}</div>

      {nextLevelAt > totalPoints && (
        <p style={styles.nextLevelText}>
          {nextLevelAt - totalPoints} points to reach{" "}
          {level === "Saint Initiation"
            ? "Young Saint"
            : level === "Young Saint"
            ? "Rising Saint"
            : "Fly High Club"}
        </p>
      )}

      <div style={styles.separator} />

      {/* Fly High Club */}
      <h3 style={styles.sectionTitle}>Fly High Club</h3>
      <p style={styles.regularText}>Unlock at 100 points.</p>
    </div>
  );
}

// -----------------------------------------------------------
// STYLES
// -----------------------------------------------------------
const pink = "rgb(255, 0, 190)";

const styles = {
  page: {
    minHeight: "100vh",
    padding: "40px 20px",
    textAlign: "center",
    background: "linear-gradient(to bottom, #000000 0%, #120012 60%, #000000 100%)", // restored beautiful gradient
    color: "#fff",
    fontFamily: "Playfair Display, serif",
  },
  logo: {
    width: 180,
    margin: "0 auto 20px",
  },
  bottleNumber: {
    fontSize: 38,
    fontWeight: "700",
    marginBottom: 20,
    fontFamily: "Inter, sans-serif",
  },
  separator: {
    height: 1,
    background: "rgba(255,255,255,0.13)",
    margin: "30px auto",
    maxWidth: "60%", // fixed so they look elegant again
  },
  sectionTitle: {
    fontSize: 28,
    fontWeight: "700",
    marginBottom: 10,
  },
  regularText: {
    fontSize: 18,
    opacity: 0.85,
  },
  rewardText: {
    fontSize: 22,
    color: pink,
    fontWeight: "600",
  },
  spotifyButton: {
    display: "inline-block",
    border: `2px solid ${pink}`,
    color: pink,
    padding: "12px 28px",
    borderRadius: 30,
    marginTop: 8, // fixed spacing
    textDecoration: "none",
    fontFamily: "Inter, sans-serif",
    fontSize: 18,
  },
  progressRow: {
    display: "flex",
    justifyContent: "center",
    marginTop: 14,
    marginBottom: 6,
  },
  nextLevelText: {
    fontSize: 14,
    opacity: 0.75,
    marginTop: 4,
  },
};
