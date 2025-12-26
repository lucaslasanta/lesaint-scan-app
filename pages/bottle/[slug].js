import { useEffect, useState } from "react";
import Head from "next/head";
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
import ClubJoinModal from "../../components/ClubJoinModal";
import InstructionsModal from "../../components/InstructionsModal";


const pink = "rgb(255, 0, 190)";

/* -------------------------------------------------- */
/* DEVICE ID HELPER                                    */
/* -------------------------------------------------- */
function getOrCreateDeviceId() {
  let slug = localStorage.getItem("leSaintDeviceId");

  if (!slug) {
    slug = crypto.randomUUID();
    localStorage.setItem("leSaintDeviceId", slug);
  }

  return slug;
}

/* -------------------------------------------------- */
/* SERVER SIDE FETCH BOTTLE DATA                       */
/* -------------------------------------------------- */
export async function getServerSideProps({ params }) {
  const bottleRef = doc(db, "bottles", params.slug);
  const snap = await getDoc(bottleRef);

  if (!snap.exists()) return { notFound: true };

  return {
    props: {
      slug: params.slug,
      bottle: snap.data(),
    },
  };
}

/* -------------------------------------------------- */
/* MAIN PAGE                                           */
/* -------------------------------------------------- */
export default function BottlePage({ slug, bottle }) {
  const {
    totalScans = 0,
    firstScanDate,
    songURL,
  } = bottle;

  const [user, setUser] = useState(null);
  const [displayName, setDisplayName] = useState(null);

  const [showOnboarding, setShowOnboarding] = useState(false);
  const [showClubModal, setShowClubModal] = useState(false);

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
        await setDoc(userRef, {
          points: 0,
          scans: [],
          displayName: null,
          isLeSaintClubMember: false,
          email: null,
        });
        setShowOnboarding(true);
        setUser({
          slug: deviceId,
          points: 0,
          scans: [],
          displayName: null,
          isLeSaintClubMember: false,
        });
        return;
      }

      const userData = userSnap.data();
      setUser({ slug: deviceId, ...userData });
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
      const bottleRef = doc(db, "bottles", slug);
      const userRef = doc(db, "users", user.slug);

      let awarded = 0;

      const userHasScanned = user.scans?.includes(slug);
      const isFirstBottleScan = !firstScanDate;

      if (userHasScanned) {
        awarded = 0;
      } else if (isFirstBottleScan) {
        awarded = 5;
      } else {
        awarded = 1;
      }

      try {
        await updateDoc(userRef, {
          points: (user.points || 0) + awarded,
          scans: arrayUnion(slug),
        });

        setUpdatedTotalPoints((user.points || 0) + awarded);
        setPointsAwarded(awarded);

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
    nextLevelName = "The Le Saint Club";
  } else if (totalPoints >= 100) {
    level = "The Le Saint Club";
    tierMin = 100;
    tierMax = 100;
    nextLevelName = null;
  }

  /* -------------------------------------------------- */
  /* CLUB MEMBERSHIP TRIGGER                            */
  /* -------------------------------------------------- */
  useEffect(() => {
    if (!user) return;
    if (user.isLeSaintClubMember) return;
    if (totalPoints < 100) return;

    // block page, show full-screen modal
    setShowClubModal(true);
  }, [user, totalPoints]);

  /* -------------------------------------------------- */
  /* PROGRESS BAR OR CLUB DIAMONDS                      */
  /* -------------------------------------------------- */
  let visualElements;

  if (totalPoints >= 100 && user?.isLeSaintClubMember) {
    // Diamonds ★ ★ ★ ★ ★ (always pink)
    visualElements = (
      <div style={styles.progressRow}>
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} style={styles.diamond}>✦</div>
        ))}
      </div>
    );
  } else {
    const squares = 5;
    let tierProgress =
      tierMax === tierMin ? 1 : (totalPoints - tierMin) / (tierMax - tierMin);
    tierProgress = Math.max(0, Math.min(1, tierProgress));
    const filledSquares = Math.round(tierProgress * squares);

    visualElements = (
      <div style={styles.progressRow}>
        {Array.from({ length: squares }).map((_, i) => (
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
        ))}
      </div>
    );
  }

  /* Format first scan date */
  let formattedDate = null;
  if (firstScanDate?.seconds) {
    formattedDate = new Date(firstScanDate.seconds * 1000).toLocaleDateString(
      "en-GB",
      { day: "numeric", month: "long", year: "numeric" }
    );
  }

  /* -------------------------------------------------- */
  /* ONBOARDING GATE                                     */
  /* -------------------------------------------------- */
  if (showOnboarding && user) {
    return (
      <Onboarding
        userId={user.slug}
        onComplete={() => {
          setShowOnboarding(false);
          setDisplayName(localStorage.getItem("leSaintDisplayName"));
        }}
      />
    );
  }

// --- INSTRUCTIONS MODAL STATE ---
const [showInstructions, setShowInstructions] = useState(false);

if (showInstructions) {
  return <InstructionsModal onClose={() => setShowInstructions(false)} />;
}


  /* -------------------------------------------------- */
  /* CLUB EMAIL MODAL BLOCKS PAGE UNTIL COMPLETED       */
  /* -------------------------------------------------- */
  if (showClubModal && user) {
    return (
      <ClubJoinModal
        user={user}
        totalPoints={totalPoints}
        onComplete={() => {
          setShowClubModal(false);
          // refresh user membership flag
          setUser({ ...user, isLeSaintClubMember: true });
        }}
      />
    );
  }

  if (!user) return null;

  /* -------------------------------------------------- */
  /* MAIN UI                                            */
  /* -------------------------------------------------- */
  return (
    <>
      <Head>
          <meta name="color-scheme" content="light dark" />
      </Head>
    
  
      <div style={styles.page}>
  
        {/* TOP RIGHT HELP BUTTON */}
        <button
          onClick={() => setShowInstructions(true)}
          style={styles.helpButton}
        >
          ?
        </button>
  
        <img src="/images/le-saint-logo.png" style={styles.logo} />
  
        <h1 style={styles.bottleNumber}>Bottle Nº {slug}</h1>
  
        {displayName && <p style={styles.username}>{displayName}</p>}
  
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
          {formattedDate ? (
            <p style={styles.textSmall}>First scanned on {formattedDate}</p>
          ) : (
            <p style={styles.textSmall}>Never scanned before</p>
          )}
        </Section>
  
        <div style={styles.separator}></div>
  
        {/* --- BOTTLE PRIZE SECTION --- */}
        <Section title="Bottle Prize">
          {bottle.isPrizeBottle ? (
            <>
              <p style={styles.textSmall}>
                {bottle.prizeType === "25" && "25% Discount Code"}
                {bottle.prizeType === "50" && "50% Discount Code"}
              </p>
        
              <p style={styles.prizeCode}>
                {bottle.prizeCode || "No code assigned"}
              </p>
            </>
          ) : (
            <p style={styles.textSmall}>No prize this time. Keep scanning.</p>
          )}
        </Section>
        
        <div style={styles.separator}></div>
  
        <Section title="Reward">
          <p style={styles.rewardText}>
            {pointsAwarded === 0
              ? "Bottle already scanned"
              : `${pointsAwarded} Saint Points`}
          </p>
        </Section>
  
        <div style={styles.separator}></div>
  
        <Section title="Your Status">
          <p style={styles.text}>
            {level} · {totalPoints} points
          </p>
  
          {visualElements}
  
          {nextLevelName && !(user.isLeSaintClubMember && totalPoints >= 100) && (
            <p style={styles.nextLevelText}>
              {tierMax - totalPoints + 1} points to reach {nextLevelName}
            </p>
          )}
        </Section>
  
        <div style={styles.separator}></div>
  
        <Section title="The Le Saint Club">
          {!user.isLeSaintClubMember ? (
            <p style={styles.textSmall}>Unlock at 100 points.</p>
          ) : (
            <p style={styles.textSmall}>Membership unlocked. Stay tuned.</p>
          )}
        </Section>
      </div>
    </>
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
/* STYLES (UNCHANGED UI)                               */
/* -------------------------------------------------- */
const styles = {
  page: {
    minHeight: "100vh",
  
    backgroundColor: "#000000",
  
    backgroundImage: `
      radial-gradient(circle at top center,
       rgba(255,0,190,0.10),
       rgba(0,0,0,1) 45%)
    `,
  
    color: "#ffffff",
  
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

  helpButton: {
    position: "absolute",
    top: 20,
    right: 20,
    background: "transparent",
    border: `2px solid ${pink}`,
    color: pink,
    borderRadius: 6,
    padding: "4px 10px",
    fontSize: 20,
    cursor: "pointer",
    fontFamily: "Inter, sans-serif",
    zIndex: 10,
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

  prizeCode: {
    fontSize: 20,
    color: pink,
    fontFamily: "Inter, sans-serif",
    marginTop: 6,
    fontWeight: 600,
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

  diamond: {
    fontSize: 26,
    margin: "0 4px",
    color: pink,
  },

  nextLevelText: {
    marginTop: 10,
    fontSize: 14,
    opacity: 0.8,
    fontFamily: "Inter, sans-serif",
  },
};
