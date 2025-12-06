import { doc, getDoc } from "firebase/firestore";
import db from "../../lib/firebase";

// ------------------------------
// CONSTANTS
// ------------------------------
const pink = "rgb(255, 0, 190)";

// ------------------------------
// SERVER SIDE FETCH
// ------------------------------
export async function getServerSideProps({ params }) {
  const bottleRef = doc(db, "bottles", params.id);
  const bottleSnap = await getDoc(bottleRef);

  if (!bottleSnap.exists()) {
    return { notFound: true };
  }

  const bottle = bottleSnap.data();

  // IMPORTANT SAFETY:
  // Convert Firestore Timestamp to string BEFORE sending to client
  return {
    props: {
      id: params.id,
      bottle: {
        ...bottle,
        firstScanDate: bottle.firstScanDate
          ? bottle.firstScanDate.toMillis()
          : null,
      },
    },
  };
}

// ------------------------------
// MAIN PAGE COMPONENT
// ------------------------------
export default function BottlePage({ id, bottle }) {
  if (!bottle) return <div>Error loading bottle.</div>;

  const {
    totalScans = 0,
    firstScanDate,
    isPrizeBottle,
    prizeType,
    songURL,
  } = bottle;

  // ----------------------------------------
  // POINT SYSTEM
  // ----------------------------------------
  const points = totalScans === 1 ? 5 : totalScans > 1 ? 1 : 0;

  // ----------------------------------------
  // FORMAT DATE SAFELY
  // ----------------------------------------
  let formattedDate = null;
  if (firstScanDate) {
    try {
      formattedDate = new Date(firstScanDate).toLocaleDateString("en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric",
      });
    } catch (err) {
      formattedDate = null;
    }
  }

  // ----------------------------------------
  // LEVEL SYSTEM
  // ----------------------------------------
  let level = "";
  let nextLevelAt = 0;

  if (points >= 100) {
    level = "Fly High Club";
    nextLevelAt = 0;
  } else if (points >= 50) {
    level = "Rising Saint";
    nextLevelAt = 100;
  } else if (points >= 25) {
    level = "Young Saint";
    nextLevelAt = 50;
  } else {
    level = "Saint Initiation";
    nextLevelAt = 25;
  }

  // ----------------------------------------
  // PROGRESS BAR (5 squares)
  // ----------------------------------------
  const squares = 5;
  const ratio = nextLevelAt ? Math.min(1, points / nextLevelAt) : 1;
  const filled = Math.round(ratio * squares);

  const progressSquares = Array.from({ length: squares }).map((_, i) => (
    <div
      key={i}
      style={{
        width: 22,
        height: 22,
        margin: "0 4px",
        borderRadius: 4,
        backgroundColor: i < filled ? pink : "rgba(255,255,255,0.15)",
      }}
    />
  ));

  return (
    <div style={styles.page}>
      <img src="/images/le-saint-logo.png" style={styles.logo} />

      <h2 style={styles.bottleNumber}>Bottle Nº {id}</h2>

      {/* SONG */}
      <Section title="Bottle Song">
        <a href={songURL} target="_blank" rel="noopener noreferrer" style={styles.spotifyButton}>
          Play on Spotify
        </a>
      </Section>

      {/* LEGACY */}
      <Section title="Bottle Legacy">
        {formattedDate && (
          <p style={styles.subText}>First scanned on {formattedDate}</p>
        )}
      </Section>

      {/* PRIZE */}
      {isPrizeBottle && (
        <Section title="Prize Bottle">
          <p style={styles.prizeText}>Reward available — {prizeType}</p>
        </Section>
      )}

      {/* REWARD */}
      <Section title="Reward">
        <p style={styles.rewardText}>{points} Saint Points</p>
      </Section>

      {/* STATUS */}
      <Section title="Status">
        <p style={styles.subText}>{level} · {points} points</p>
        <div style={styles.progressRow}>{progressSquares}</div>

        {nextLevelAt > 0 && (
          <p style={styles.nextLevelText}>
            {nextLevelAt - points} points until {
              level === "Saint Initiation"
                ? "Young Saint"
                : level === "Young Saint"
                ? "Rising Saint"
                : "Fly High Club"
            }
          </p>
        )}
      </Section>

      {/* FLY HIGH */}
      <Section title="Fly High Club">
        <p style={styles.subText}>Unlock at 100 points</p>
      </Section>
    </div>
  );
}

// ------------------------------
// SECTION COMPONENT
// ------------------------------
function Section({ title, children }) {
  return (
    <div style={styles.section}>
      <h3 style={styles.sectionTitle}>{title}</h3>
      {children}
      <div style={styles.separator} />
    </div>
  );
}

// ------------------------------
// STYLES
// ------------------------------
const styles = {
  page: {
    minHeight: "100vh",
    background: "linear-gradient(to bottom, #0a0007, #000)",
    color: "#fff",
    padding: "40px 20px",
    textAlign: "center",
    fontFamily: "Playfair Display, serif",
  },
  logo: { width: 200, margin: "0 auto 25px" },
  bottleNumber: { fontSize: 42, marginBottom: 35, fontFamily: "Inter, sans-serif" },
  section: { margin: "40px 0" },
  sectionTitle: { fontSize: 28, marginBottom: 10, fontWeight: "700" },
  subText: { fontSize: 18, opacity: 0.85, fontFamily: "Inter, sans-serif" },
  rewardText: { fontSize: 22, color: pink, fontFamily: "Inter, sans-serif" },
  prizeText: { fontSize: 20, color: pink, fontWeight: "600" },
  spotifyButton: {
    padding: "12px 28px",
    borderRadius: "30px",
    border: `2px solid ${pink}`,
    color: pink,
    textDecoration: "none",
    fontSize: 18,
    fontFamily: "Inter, sans-serif",
  },
  separator: {
    height: 1,
    background: "rgba(255,255,255,0.15)",
    marginTop: 25,
  },
  progressRow: {
    display: "flex",
    justifyContent: "center",
    marginTop: 14,
  },
  nextLevelText: {
    marginTop: 10,
    opacity: 0.75,
    fontSize: 16,
    fontFamily: "Inter, sans-serif",
  },
};
