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
  // BOTTLE LEGACY
  // ---------------------------------------------------
  let legacyText = totalScans <= 1 
    ? "First Saint Scan"
    : `${totalScans - 1} Saint(s) before`;

  const formattedDate =
    firstScanDate?.toMillis
      ? new Date(firstScanDate.toMillis()).toLocaleDateString("en-GB", {
          day: "numeric",
          month: "short",
          year: "numeric",
        })
      : null;

  // ---------------------------------------------------
  // LEVEL SYSTEM
  // ---------------------------------------------------
  const totalPoints = points;
  let level = "Saint Initiation";
  let nextLevelPoints = 25;

  if (totalPoints >= 100) {
    level = "Fly High Club";
    nextLevelPoints = 0;
  } else if (totalPoints >= 25) {
    level = "Rising Saint";
    nextLevelPoints = 100;
  }

  // ---------------------------------------------------
  // PROGRESS SQUARES
  // ---------------------------------------------------
  const squares = 5;
  const progressPercentage = nextLevelPoints
    ? Math.min(1, totalPoints / nextLevelPoints)
    : 1;

  const filledSquares = Math.round(progressPercentage * squares);

  const squareElements = Array.from({ length: squares }).map((_, i) => (
    <div
      key={i}
      style={{
        width: 24,
        height: 24,
        margin: "0 5px",
        backgroundColor:
          i < filledSquares ? "rgb(255, 0, 190)" : "rgba(255,255,255,0.1)",
        borderRadius: 4,
        transition: "0.3s ease",
      }}
    />
  ));

  // ---------------------------------------------------
  // UI
  // ---------------------------------------------------

  return (
    <div style={styles.page}>
      {/* LOGO */}
      <img src="/images/le-saint-logo.png" alt="Le Saint Logo" style={styles.logo} />

      {/* Bottle Number */}
      <h2 style={styles.bottleNumber}>Bottle Nº {id}</h2>

      <Separator />

      {/* Spotify */}
      <Section title="Your Bottle Song">
        <a href={songURL} target="_blank" rel="noopener noreferrer" style={styles.spotifyButton}>
          Play on Spotify
        </a>
      </Section>

      <Separator />

      {/* Bottle Legacy */}
      <Section title="Bottle Legacy">
        <p style={styles.bodyText}>{legacyText}</p>
        {formattedDate && (
          <p style={styles.subtleText}>First scanned on {formattedDate}</p>
        )}
      </Section>

      <Separator />

      {/* Prize Bottle */}
      {isPrizeBottle && (
        <Section title="Prize Bottle">
          <p style={styles.rewardPink}>{prizeType}</p>
        </Section>
      )}

      {/* Reward */}
      <Section title="Your Reward">
        <p style={styles.rewardPink}>{points} Saint Points</p>
      </Section>

      <Separator />

      {/* Status */}
      <Section title="Your Status">
        <p style={styles.bodyText}>{level} · {totalPoints} points</p>
        <div style={styles.progressRow}>{squareElements}</div>
        {nextLevelPoints > 0 && (
          <p style={styles.subtleText}>
            {nextLevelPoints - totalPoints} points until {level === "Saint Initiation" ? "Rising Saint" : "Fly High Club"}
          </p>
        )}
      </Section>

      <Separator />

      {/* Fly High Club */}
      <Section title="Fly High Club">
        <p style={styles.bodyText}>Unlock exclusive benefits at 100 points.</p>
      </Section>
    </div>
  );
}

/* ------- UI COMPONENTS ------- */

function Section({ title, children }) {
  return (
    <div style={styles.section}>
      <h3 style={styles.sectionTitle}>{title}</h3>
      {children}
    </div>
  );
}

function Separator() {
  return <div style={styles.separator} />;
}

/* ------- STYLES ------- */

const pink = "rgb(255, 0, 190)";

const styles = {
  page: {
    minHeight: "100vh",
    background: `
      radial-gradient(circle at top center,
       rgba(255,0,190,0.10),
       rgba(0,0,0,1) 45%)
    `,
    color: "#fff",
    padding: "40px 26px",
    textAlign: "center",
    fontFamily: "Inter, sans-serif",
  },

  logo: {
    width: 200,
    margin: "0 auto 30px",
  },

  bottleNumber: {
    fontSize: 38,
    marginBottom: 10,
    fontWeight: "700",
    fontFamily: "Inter, sans-serif",
  },

  separator: {
    width: "40%",
    height: 1,
    backgroundColor: "rgba(255,255,255,0.15)",
    margin: "30px auto",
  },

  section: {
    marginBottom: 35,
  },

  sectionTitle: {
    fontFamily: "Playfair Display, serif",
    fontSize: 28,
    fontWeight: "700",
    marginBottom: 10,
  },

  spotifyButton: {
    display: "inline-block",
    padding: "10px 26px",
    border: `1px solid ${pink}`,
    borderRadius: 30,
    color: pink,
    textDecoration: "none",
    fontSize: 18,
    fontWeight: "500",
    transition: "0.3s ease",
  },

  bodyText: {
    fontSize: 20,
    opacity: 0.9,
    fontFamily: "Inter, sans-serif",
  },

  subtleText: {
    fontSize: 14,
    opacity: 0.6,
    marginTop: 6,
  },

  rewardPink: {
    fontSize: 22,
    color: pink,
    fontWeight: "600",
  },

  progressRow: {
    marginTop: 16,
    display: "flex",
    justifyContent: "center",
  },
};
