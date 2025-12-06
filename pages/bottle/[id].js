import { useEffect, useState } from "react";
import db from "../../lib/firebase";
import {
  doc,
  getDoc,
  updateDoc,
  setDoc,
  serverTimestamp,
} from "firebase/firestore";

// ---------------------------------------------------------
// Generate persistent device-based ID (no login)
// ---------------------------------------------------------
function getOrCreateDeviceId() {
  try {
    let id = localStorage.getItem("leSaintDeviceId");
    if (!id) {
      id = crypto.randomUUID();
      localStorage.setItem("leSaintDeviceId", id);
    }
    return id;
  } catch {
    return "anonymous-device";
  }
}

// ---------------------------------------------------------
// Main Component
// ---------------------------------------------------------
export default function BottlePage() {
  const [loading, setLoading] = useState(true);
  const [bottle, setBottle] = useState(null);
  const [user, setUser] = useState(null);
  const [rewardText, setRewardText] = useState("");
  const [totalPoints, setTotalPoints] = useState(0);

  // Extract bottle ID from URL
  const id =
    typeof window !== "undefined"
      ? window.location.pathname.split("/").pop()
      : null;

  // -----------------------------------------------------
  // Load bottle + user, then apply scan logic
  // -----------------------------------------------------
  useEffect(() => {
    if (!id) return;
    async function run() {
      const deviceId = getOrCreateDeviceId();
      const userRef = doc(db, "users", deviceId);
      const bottleRef = doc(db, "bottles", id);

      // Fetch bottle
      const bottleSnap = await getDoc(bottleRef);
      if (!bottleSnap.exists()) {
        setBottle(null);
        setLoading(false);
        return;
      }
      const bottleData = bottleSnap.data();

      // Fetch or create user
      let userSnap = await getDoc(userRef);
      if (!userSnap.exists()) {
        await setDoc(userRef, {
          points: 0,
          scans: [],
          displayName: "",
          level: "Saint Initiation",
          createdAt: serverTimestamp(),
        });
        userSnap = await getDoc(userRef);
      }
      const userData = userSnap.data();

      // Apply Option B logic
      const hasUserScanned = userData.scans?.includes(id);

      let pointsToAward = 0;
      let updatedBottle = { ...bottleData };

      if (hasUserScanned) {
        // Already scanned by this user → 0 points
        setRewardText("Bottle already scanned · no points awarded");
      } else {
        // New scan for this user
        const isFirstEverScan = (bottleData.totalScans || 0) === 0;

        if (isFirstEverScan) {
          pointsToAward = 5;
          updatedBottle.firstScanDate = serverTimestamp();
        } else {
          pointsToAward = 1;
        }

        updatedBottle.totalScans = (bottleData.totalScans || 0) + 1;

        // Update bottle in Firestore
        await updateDoc(bottleRef, updatedBottle);

        // Update user in Firestore
        const newPoints = (userData.points || 0) + pointsToAward;
        await updateDoc(userRef, {
          points: newPoints,
          scans: [...(userData.scans || []), id],
        });

        setRewardText(
          pointsToAward === 5 ? "5 Saint Points" : "1 Saint Point"
        );

        userData.points = newPoints;
        userData.scans = [...(userData.scans || []), id];
      }

      setBottle(updatedBottle);
      setUser(userData);
      setTotalPoints(userData.points || 0);
      setLoading(false);
    }

    run();
  }, [id]);

  if (loading || !bottle || !user) {
    return (
      <div
        style={{
          minHeight: "100vh",
          background:
            "radial-gradient(circle at top center, rgba(255,0,190,0.10), rgba(0,0,0,1) 45%)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "white",
          fontSize: 22,
          fontFamily: "Playfair Display, serif",
        }}
      >
        Loading…
      </div>
    );
  }

  // ---------------------------------------
  // Bottle fields
  // ---------------------------------------
  const {
    firstScanDate,
    isPrizeBottle,
    prizeType,
    songURL,
    totalScans = 0,
  } = bottle;

  // ---------------------------------------
  // Format first scan date
  // ---------------------------------------
  let formattedDate = null;
  if (firstScanDate?.seconds) {
    formattedDate = new Date(
      firstScanDate.seconds * 1000
    ).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  }

  // ---------------------------------------
  // LEVEL SYSTEM (same as your UI)
  // ---------------------------------------
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

  const squares = 5;
  let tierProgress =
    tierMax === tierMin ? 1 : (totalPoints - tierMin) / (tierMax - tierMin);
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

  // ---------------------------------------------------------
  // UI BELOW THIS POINT REMAINS EXACTLY AS YOU DESIGNED IT
  // ---------------------------------------------------------

  return (
    <div style={styles.page}>
      <img src="/images/le-saint-logo.png" style={styles.logo} />

      <h1 style={styles.bottleNumber}>Bottle Nº {id}</h1>

      <div style={styles.separator}></div>

      <Section title="Bottle Song">
        <a
          href={songURL}
          target="_blank"
          rel="noopener noreferrer"
          style={styles.spotifyButton}
        >
          Play on Spotify
        </a>
      </Section>

      <div style={styles.separator}></div>

      <Section title="Bottle Legacy">
        {formattedDate && (
          <p style={styles.textSmall}>First scanned on {formattedDate}</p>
        )}
      </Section>

      <div style={styles.separator}></div>

      <Section title="Reward">
        <p style={styles.rewardText}>{rewardText}</p>
      </Section>

      <div style={styles.separator}></div>

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

      <Section title="Fly High Club">
        <p style={styles.textSmall}>Unlock at 100 points.</p>
      </Section>
    </div>
  );
}

// -------------------------------------------------
// SECTION COMPONENT (unchanged)
// -------------------------------------------------
function Section({ title, children }) {
  return (
    <div style={styles.section}>
      <h2 style={styles.sectionTitle}>{title}</h2>
      {children}
    </div>
  );
}

// -------------------------------------------------
// STYLING (UNCHANGED)
// -------------------------------------------------
const pink = "rgb(255, 0, 190)";

const styles = {
  page: {
    minHeight: "100vh",
    background:
      "radial-gradient(circle at top center, rgba(255,0,190,0.10), rgba(0,0,0,1) 45%)",
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
    fontSize: 18,
    color: pink,
    fontWeight: 500,
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
