import { useEffect, useState } from "react";
import { db } from "../../lib/firebase";
import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  arrayUnion,
  serverTimestamp,
} from "firebase/firestore";

import Onboarding from "../../components/Onboarding";

const pink = "rgb(255, 0, 190)";

/* -------------------------------------------------- */
/* DEVICE ID HELPER                                    */
/* -------------------------------------------------- */
function getOrCreateDeviceId() {
  let id = localStorage.getItem("leSaintDeviceId");
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem("leSaintDeviceId", id);
  }
  return id;
}

/* -------------------------------------------------- */
/* SERVER SIDE FETCH BOTTLE DATA                       */
/* -------------------------------------------------- */
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

/* -------------------------------------------------- */
/* MAIN PAGE                                           */
/* -------------------------------------------------- */
export default function BottlePage({ id, bottle }) {
  const {
    totalScans = 0,
    firstScanDate,
    isPrizeBottle,
    prizeType,
    prizeCode,
    prizeClaimed,
    songURL,
  } = bottle;

  const [user, setUser] = useState(null);
  const [displayName, setDisplayName] = useState(null);
  const [showOnboarding, setShowOnboarding] = useState(false);

  const [pointsAwarded, setPointsAwarded] = useState(0);
  const [updatedTotalPoints, setUpdatedTotalPoints] = useState(0);

  /* -------------------------------------------------- */
  /* 1 — LOAD USER OR CREATE NEW ONE                    */
  /* -------------------------------------------------- */
  useEffect(() => {
    const initUser = async () => {
      const deviceId = getOrCreateDeviceId();
      const userRef = doc(db, "users", deviceId);
      const userSnap = await getDoc(userRef);

      if (!userSnap.exists()) {
        // Create new user with no name yet
        await setDoc(userRef, {
          points: 0,
          scans: [],
          displayName: null,
        });
        setShowOnboarding(true);
        setUser({ id: deviceId, points: 0, scans: [], displayName: null });
        return;
      }

      const userData = userSnap.data();
      setUser({ id: deviceId, ...userData });
      setDisplayName(userData.displayName);

      if (!userData.displayName) {
        setShowOnboarding(true);
      }
    };

    initUser();
  }, []);

  /* -------------------------------------------------- */
  /* 2 — PROCESS SCAN ON LOAD                           */
  /* -------------------------------------------------- */
  useEffect(() => {
    if (!user) return;

    const processScan = async () => {
      const bottleRef = doc(db, "bottles", id);
      const userRef = doc(db, "users", user.id);

      let awarded = 0;

      const userHasScanned = user.scans?.includes(id);
      const isFirstBottleScan = !firstScanDate;

      if (userHasScanned) {
        awarded = 0;
      } else if (isFirstBottleScan) {
        awarded = 5;
      } else {
        awarded = 1;
      }

      try {
        // Update user
        await updateDoc(userRef, {
          points: (user.points || 0) + awarded,
          scans: arrayUnion(id),
        });

        setUpdatedTotalPoints((user.points || 0) + awarded);
        setPointsAwarded(awarded);

        // Update bottle
        if (isFirstBottleScan) {
          await updateDoc(bottleRef, {
            firstScanDate: serverTimestamp(),
            totalScans: totalScans + 1,
          });
        } else if (!userHasScanned) {
          await updateDoc(bottleRef, {
            totalScans: totalScans + 1,
          });
        }
      } catch (err) {
        console.error("Error updating scan:", err);
      }
    };

    processScan();
  }, [user]);

  /* -------------------------------------------------- */
  /* LEVEL SYSTEM USING USER TOTAL POINTS               */
  /* -------------------------------------------------- */
  const totalPoints = updatedTotalPoints;
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

  /* Progress bar calculation */
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
        backgroundColor: i < filledSquares ? pink : "rgba(255,255,255,0.18)",
      }}
    />
  ));

  /* Format first scan date */
  let formattedDate = null;
  if (firstScanDate?.seconds) {
    formattedDate = new Date(firstScanDate.seconds * 1000).toLocaleDateString(
      "en-GB",
      { day: "numeric", month: "long", year: "numeric" }
    );
  }

  /* -------------------------------------------------- */
  /*  ONBOARDING SCREEN GATING                           */
  /* -------------------------------------------------- */
  if (showOnboarding && user) {
    return (
      <Onboarding
        userId={user.id}
        onComplete={() => {
          setShowOnboarding(false);
          setDisplayName(localStorage.getItem("leSaintDisplayName"));
        }}
      />
    );
  }

  if (!user) return null;

  /* -------------------------------------------------- */
  /*                MAIN UI OUTPUT                       */
  /* -------------------------------------------------- */
  return (
    <div style={styles.page}>
      <img src="/images/le-saint-logo.png" style={styles.logo} />

      <h1 style={styles.bottleNumber}>Bottle Nº {id}</h1>

      {displayName && (
        <p style={styles.username}>{displayName}</p>
      )}

      <div style={styles.separator}></div>

      <Section title="Bottle Song">
        <a href={songURL} target="_blank" rel="noopener noreferrer" style={styles.spotifyButton}>
          Play on Spotify
        </a>
      </Section>

      <div style={styles.separator}></div>

      <Section title="Bottle Legacy">
       {formattedDate ? (
          <p style={styles.textSmall}>First scanned on {formattedDate}</p>
        ) : (
          <p style={styles.textSmall}>Never scanned before</p>
        )}
      </Section>

      <div style={styles.separator}></div>

      <Section title="Reward">
        <p style={styles.rewardText}>
          {pointsAwarded === 0 ? "Bottle already scanned" : `${pointsAwarded} Saint Points`}
        </p>
      </Section>

      <div style={styles.separator}></div>

      <Section title="Your Status">
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

      <Section title="The Le Saint Club">
        <p style={styles.textSmall}>Unlock at 100 points.</p>
      </Section>
    </div>
  );
}

/* -------------------------------------------------- */
/* SECTION COMPONENT                                  */
/* -------------------------------------------------- */
function Section({ title, children }) {
  return (
    <div style={styles.section}>
      <h2 style={styles.sectionTitle}>{title}</h2>
      {children}
    </div>
  );
}

/* -------------------------------------------------- */
/* STYLES                                              */
/* -------------------------------------------------- */
const styles = {
  page: {
    minHeight: "100vh",
    background: `
      radial-gradient(circle at top center,
       rgba(255,0,190,0.10),
       rgba(0,0,0,1) 45%)
    `,
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
    marginBottom: 8,
    fontFamily: "Inter, sans-serif",
    fontWeight: 700,
  },

  username: {
    fontSize: 16,
    color: pink,
    fontFamily: "Inter, sans-serif",
    marginBottom: 20,
    opacity: 0.9,
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
