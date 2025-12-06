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

function Section({ title, children }) {
  return (
    <div style={styles.section}>
      <h3 style={styles.sectionTitle}>{title}</h3>
      <div>{children}</div>
      <div style={styles.sectionDivider}></div>
    </div>
  );
}

export default function BottlePage({ id, bottle }) {

  // ---- Points ----
  const totalPoints = bottle.totalScans ?? 0;

  // ---- Level Logic ----
  let level = "Saint Initiation";
  let nextLevel = 25;

  if (totalPoints >= 100) {
    level = "Fly High Club";
    nextLevel = 0;
  } else if (totalPoints >= 25) {
    level = "Rising Saint";
    nextLevel = 100;
  }

  const progress =
    nextLevel === 0 ? 100 : Math.min(100, (totalPoints / nextLevel) * 100);

  // ---- Legacy Text ----
  const legacyText =
    totalPoints === 0 ? "First Saint Scan" : `${totalPoints} Saints before`;

  // ---- Spotify ----
  const spotifyURL = bottle.songURL || "#";

  return (
    <div style={styles.page}>

      <img src="/images/le-saint-logo.png" alt="Le Saint" style={styles.logo} />

      <h2 style={styles.bottleNumber}>Bottle Nº {id}</h2>

      <Section title="Your Bottle Song">
        <a
          href={spotifyURL}
          target="_blank"
          rel="noopener noreferrer"
          style={styles.link}
        >
          Play on Spotify ↗
        </a>
      </Section>

      <Section title="Bottle Legacy">
        <p style={styles.text}>{legacyText}</p>
      </Section>

      <Section title="Your Reward">
        <p style={styles.reward}>◆ {totalPoints} Saint Points</p>
      </Section>

      <Section title="Your Status">
        <p style={styles.text}>{level} · {totalPoints} points</p>

        {nextLevel > 0 && (
          <>
            <p style={styles.progressLabel}>
              Progress to next level ({totalPoints}/{nextLevel})
            </p>

            <div style={styles.progressTrack}>
              <div style={{ ...styles.progressFill, width: `${progress}%` }}></div>
            </div>
          </>
        )}
      </Section>

      <Section title="Fly High Club">
        <p style={styles.text}>Unlock exclusive benefits at 100 points.</p>
      </Section>

    </div>
  );
}

/* -------------------------------------- */
/* STYLES                                 */
/* -------------------------------------- */

const pink = "rgb(255, 0, 190)"; // C0 M94 Y0 K0

const styles = {
  page: {
    minHeight: "100vh",
    background: "#000",
    padding: "42px 24px",
    color: "#fff",
    fontFamily: "Playfair Display, serif",
    textAlign: "center",
  },

  logo: {
    width: "230px",
    margin: "0 auto 24px auto",
    opacity: 0.9,
  },

  bottleNumber: {
    fontFamily: "Inter, sans-serif",
    fontWeight: 700,
    letterSpacing: "1.4px",
    marginBottom: "50px",
    fontSize: "28px",
  },

  section: {
    marginBottom: "40px",
  },

  sectionTitle: {
    fontWeight: "700",
    fontSize: "19px",
    marginBottom: "10px",
    fontFamily: "Inter, sans-serif",
  },

  text: {
    opacity: 0.85,
    fontSize: "15px",
  },

  reward: {
    color: pink,
    fontSize: "17px",
  },

  link: {
    color: pink,
    textDecoration: "none",
    fontSize: "15px",
    fontWeight: 500,
  },

  sectionDivider: {
    width: "60px",
    height: "1px",
    background: "rgba(255,255,255,0.18)",
    margin: "28px auto 0 auto",
  },

  progressLabel: {
    fontSize: "13px",
    opacity: 0.7,
    marginTop: "12px",
  },

  progressTrack: {
    width: "75%",
    margin: "10px auto",
    height: "5px",
    background: "rgba(255,255,255,0.15)",
    borderRadius: "4px",
  },

  progressFill: {
    height: "5px",
    background: pink,
    borderRadius: "4px",
    transition: "width 0.9s ease",
  },
};
