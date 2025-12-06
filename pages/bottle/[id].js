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
  // BOTTLE LEGACY (Minimal Premium Style)
  // ---------------------------------------------------
  const formattedDate = firstScanDate
    ? new Date(firstScanDate.toMillis()).toLocaleDateString("en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    : null;

  // ---------------------------------------------------
  // STATUS LEVELS
  // ---------------------------------------------------
  let status = "Saint Initiation";
  let nextLevelPoints = 25;

  if (points >= 100) {
    status = "Fly High Club";
    nextLevelPoints = 0;
  } else if (points >= 50) {
    status = "Rising Saint";
    nextLevelPoints = 100;
  } else if (points >= 25) {
    status = "Young Saint";
    nextLevelPoints = 50;
  }

  const remaining =
    nextLevelPoints > points ? nextLevelPoints - points : 0;

  // ---------------------------------------------------
  // PROGRESS BAR (Short Premium)
  // ---------------------------------------------------
  const pink = "rgb(255, 0, 190)";
  const squares = 5;

  const progressPercentage =
    nextLevelPoints > 0 ? points / nextLevelPoints : 1;

  const filledSquares = Math.round(progressPercentage * squares);

  const squareElements = Array.from({ length: squares }).map((_, i) => (
    <div
      key={i}
      style={{
        width: 24,
        height: 24,
        margin: "0 5px",
        borderRadius: 4,
        backgroundColor: i < filledSquares ? pink : "rgba(255,255,255,0.15)",
      }}
    />
  ));

  return (
    <div style={styles.page}>
      {/* Logo */}
      <img src="/images/le-saint-logo.png" alt="Le Saint Logo" style={styles.logo} />

      {/* Bottle Number */}
      <h1 style={styles.bottleNumber}>Bottle Nº {id}</h1>

      {/* Separator */}
      <div style={styles.separator} />

      {/* Bottle Song */}
      <Section title="Bottle Song">
        <button
          onClick={() => window.open(songURL, "_blank")}
          style={styles.spotifyButton}
        >
          Play on Spotify
        </button>
      </Section>

      <div style={styles.separator} />

      {/* Bottle Legacy */}
      <Section title="Bottle Legacy">
        {formattedDate && (
          <p style={styles.text}>First scanned on {formattedDate}</p>
        )}
      </Section>

      <div style={styles.separator} />

      {/* Reward */}
      <Section title="Reward">
        <p style={styles.reward}>{points} Saint Points</p>
      </Section>

      <div style={styles.separator} />

      {/* Status */}
      <Section title="Your Status">
        <p style={styles.text}>{status} · {points} points</p>

        <div style={styles.progressRow}>{squareElements}</div>

        {remaining > 0 && status !== "Fly High Club" && (
          <p style={styles.progressNote}>
            {remaining} points to reach {nextStatusName(points)}
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

function nextStatusName(points) {
  if (points < 25) return "Young Saint";
  if (points < 50) return "Rising Saint";
  if (points < 100) return "Fly High Club";
  return "Fly High Club";
}

// ----------------------------
// Reusable Section Component
// ----------------------------
function Section({ title, children }) {
  return (
    <div style={styles.section}>
      <h2 style={styles.sectionTitle}>{title}</h2>
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
    padding: "40px 20px",
    background: "linear-gradient(to bottom, #0a0a0a, #000000)",
    color: "#fff",
    textAlign: "center",
    fontFamily: "Playfair Display, serif",
  },
  logo: {
    width: 180,
    marginBottom: 20,
  },
  bottleNumber: {
    fontSize: 40,
    fontWeight: "700",
    marginBottom: 30,
    fontFamily: "Inter, sans-serif",
  },
  separator: {
    width: 180,
    height: 1,
    backgroundColor: "rgba(255,255,255,0.25)",
    margin: "25px auto",
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 28,
    fontWeight: "700",
    marginBottom: 12,
  },
  text: {
    fontSize: 18,
    opacity: 0.85,
    fontFamily: "Inter, sans-serif",
  },
  reward: {
    fontSize: 22,
    color: pink,
    fontWeight: "600",
    fontFamily: "Inter, sans-serif",
  },
  spotifyButton: {
    background: "transparent",
    border: `2px solid ${pink}`,
    color: pink,
    padding: "10px 22px",
    fontSize: 18,
    borderRadius: 30,
    cursor: "pointer",
    fontFamily: "Inter, sans-serif",
  },
  progressRow: {
    display: "flex",
    justifyContent: "center",
    marginTop: 12,
  },
  progressNote: {
    fontSize: 16,
    marginTop: 8,
    opacity: 0.75,
    fontFamily: "Inter, sans-serif",
  },
};
