import { doc, getDoc } from "firebase/firestore";
import db from "../../lib/firebase";

// ------------------------------------------------------------
// Load bottle data server-side
// ------------------------------------------------------------
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

// ------------------------------------------------------------
// Helper: safely convert Firestore timestamps OR plain objects
// ------------------------------------------------------------
function safeTimestampToDate(ts) {
  if (!ts) return null;

  // Real Firestore Timestamp
  if (typeof ts.toMillis === "function") {
    return new Date(ts.toMillis());
  }

  // Serialized timestamp {seconds, nanoseconds}
  if (typeof ts.seconds === "number") {
    return new Date(ts.seconds * 1000);
  }

  return null;
}

// ------------------------------------------------------------
// MAIN COMPONENT
// ------------------------------------------------------------
export default function BottlePage({ id, bottle }) {
  const { totalScans = 0, firstScanDate, songURL } = bottle;

  // ------------------------------------------------------------
  // POINTS
  // ------------------------------------------------------------
  const points = totalScans === 1 ? 5 : totalScans > 1 ? 1 : 0;

  // ------------------------------------------------------------
  // LEGACY (ONLY DATE)
  // ------------------------------------------------------------
  const dateObj = safeTimestampToDate(firstScanDate);

  const formattedDate = dateObj
    ? dateObj.toLocaleDateString("en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    : null;

  // ------------------------------------------------------------
  // LEVEL SYSTEM
  // ------------------------------------------------------------
  const totalPoints = points;

  let level = "Saint Initiation";
  let nextLevel = "Young Saint";
  let needed = 25 - totalPoints;

  if (totalPoints >= 25 && totalPoints < 50) {
    level = "Young Saint";
    nextLevel = "Rising Saint";
    needed = 50 - totalPoints;
  } else if (totalPoints >= 50 && totalPoints < 100) {
    level = "Rising Saint";
    nextLevel = "Fly High Club";
    needed = 100 - totalPoints;
  } else if (totalPoints >= 100) {
    level = "Fly High Club";
    nextLevel = null;
    needed = 0;
  }

  // Progress squares
  const squares = 5;
  const progressPercentage = Math.min(1, totalPoints / 100);
  const filledSquares = Math.round(progressPercentage * squares);

  const squareElements = Array.from({ length: squares }).map((_, i) => (
    <div
      key={i}
      style={{
        width: 22,
        height: 22,
        margin: "0 4px",
        borderRadius: 4,
        backgroundColor: i < filledSquares ? pink : "rgba(255,255,255,0.18)",
      }}
    />
  ));

  return (
    <div style={styles.page}>
      {/* LOGO */}
      <img src="/images/le-saint-logo.png" style={styles.logo} />

      {/* Bottle Number */}
      <h2 style={styles.bottleNumber}>Bottle Nº {id}</h2>

      {/* SEPARATOR */}
      <div style={styles.separator} />

      {/* Bottle Song */}
      <Section title="Bottle Song">
        <a href={songURL} target="_blank" style={styles.spotifyButton}>
          Play on Spotify
        </a>
      </Section>

      <div style={styles.separator} />

      {/* Legacy */}
      <Section title="Bottle Legacy">
        {formattedDate && (
          <p style={styles.text}>First scanned on {formattedDate}</p>
        )}
      </Section>

      <div style={styles.separator} />

      {/* Reward */}
      <Section title="Reward">
        <p style={styles.rewardText}>{points} Saint Points</p>
      </Section>

      <div style={styles.separator} />

      {/* Status */}
      <Section title="YOUR STATUS">
        <p style={styles.text}>
          {level} · {totalPoints} points
        </p>

        <div style={styles.progressRow}>{squareElements}</div>

        {nextLevel && (
          <p style={styles.nextLevel}>
            {needed} points to reach {nextLevel}
          </p>
        )}
      </Section>

      <div style={styles.separator} />

      {/* Fly High Club */}
      <Section title="Fly High Club">
        <p style={styles.text}>Unlock at 100 points.</p>
      </Section>
    </div>
  );
}

// ------------------------------------------------------------
// SECTION COMPONENT
// ------------------------------------------------------------
function Section({ title, children }) {
  return (
    <div style={styles.section}>
      <h3 style={styles.sectionTitle}>{title}</h3>
      {children}
    </div>
  );
}

// ------------------------------------------------------------
// STYLES
// ------------------------------------------------------------
const pink = "rgb(255, 0, 190)";

const styles = {
  page: {
    minHeight: "100vh",
    padding: "40px 18px 80px 18px",
    textAlign: "center",
    color: "#fff",
    background: "linear-gradient(to bottom, #0a0a0a, #000000, #000000)",
    fontFamily: "Playfair Display, serif",
  },

  logo: {
    width: 160,
    margin: "0 auto 30px auto",
  },

  bottleNumber: {
    fontSize: 38,
    fontFamily: "Inter, sans-serif",
    fontWeight: "700",
    marginBottom: 18,
  },

  separator: {
    height: 1,
    width: "68%",
    background: "rgba(255,255,255,0.18)",
    margin: "25px auto",
  },

  section: {
    marginBottom: 30,
  },

  sectionTitle: {
    fontSize: 26,
    fontWeight: "700",
    marginBottom: 12,
  },

  text: {
    fontSize: 18,
    opacity: 0.85,
    fontFamily: "Inter, sans-serif",
  },

  rewardText: {
    fontSize: 20,
    color: pink,
    fontFamily: "Inter, sans-serif",
  },

  spotifyButton: {
    display: "inline-block",
    color: pink,
    border: `2px solid ${pink}`,
    padding: "10px 26px",
    borderRadius: 30,
    fontSize: 18,
    fontFamily: "Inter, sans-serif",
    textDecoration: "none",
  },

  progressRow: {
    marginTop: 14,
    display: "flex",
    justifyContent: "center",
  },

  nextLevel: {
    marginTop: 8,
    fontSize: 16,
    opacity: 0.7,
    fontFamily: "Inter, sans-serif",
  },
};

