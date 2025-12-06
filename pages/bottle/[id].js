import { useEffect, useState } from "react";
import { useRouter } from "next/router";

export default function BottlePage() {
  const router = useRouter();
  const { id } = router.query;

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    async function scanBottle() {
      const res = await fetch(`/api/scanBottle?bottleId=${id}`);
      const json = await res.json();
      setData(json);
      setLoading(false);
    }

    scanBottle();
  }, [id]);

  if (loading) {
    return (
      <div style={styles.loading}>
        <h2 style={{ color: "white" }}>Scanning bottle...</h2>
      </div>
    );
  }

  if (data.error) {
    return (
      <div style={styles.page}>
        <h1 style={styles.title}>LE SAINT</h1>
        <p style={styles.error}>{data.error}</p>
      </div>
    );
  }

  const { bottle, user, awarded, alreadyScanned } = data;

  return (
    <div style={styles.page}>
      <h1 style={styles.title}>LE SAINT</h1>

      <h2 style={styles.bottleNumber}>Bottle Nº {id}</h2>

      {/* Song Section */}
      <div style={styles.section}>
        <h3 style={styles.sectionTitle}>Your Bottle Song</h3>
        <a style={styles.songLink} href={bottle.songURL} target="_blank">
          Play on Spotify →
        </a>
      </div>

      {/* Legacy */}
      <div style={styles.section}>
        <h3 style={styles.sectionTitle}>Bottle Legacy</h3>
        <p style={styles.legacyText}>
          Discovered by {bottle.totalScans} Saints before
        </p>
      </div>

      {/* Reward */}
      <div style={styles.section}>
        <h3 style={styles.sectionTitle}>Your Reward</h3>
        {alreadyScanned ? (
          <p style={styles.infoText}>You have already scanned this bottle.</p>
        ) : (
          <p style={styles.rewardText}>✨ +{awarded} Saint Point awarded</p>
        )}
      </div>

      {/* User Status */}
      <div style={styles.section}>
        <h3 style={styles.sectionTitle}>Your Status</h3>
        <p style={styles.infoText}>
          {user.level} · {user.points} points
        </p>
      </div>

      {/* Fly High Teaser */}
      <div style={styles.section}>
        <h3 style={styles.sectionTitle}>FLY HIGH CLUB</h3>
        <p style={styles.subtleText}>Unlock exclusive benefits at 100 points.</p>
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    backgroundColor: "black",
    color: "white",
    padding: "40px 24px",
    fontFamily: "Inter, sans-serif"
  },
  loading: {
    minHeight: "100vh",
    background: "black",
    display: "flex",
    justifyContent: "center",
    alignItems: "center"
  },
  title: {
    textAlign: "center",
    fontFamily: "Playfair Display",
    fontSize: "32px",
    letterSpacing: "2px",
    marginBottom: "40px"
  },
  bottleNumber: {
    textAlign: "center",
    fontSize: "22px",
    marginBottom: "32px"
  },
  section: {
    marginBottom: "32px"
  },
  sectionTitle: {
    fontFamily: "Playfair Display",
    fontSize: "18px",
    marginBottom: "8px"
  },
  songLink: {
    color: "#FF1BAA",
    textDecoration: "underline",
    fontSize: "16px"
  },
  legacyText: {
    color: "rgba(255,255,255,0.8)"
  },
  rewardText: {
    color: "#FF1BAA",
    fontSize: "18px"
  },
  infoText: {
    color: "white"
  },
  subtleText: {
    color: "rgba(255,255,255,0.6)"
  },
  error: {
    color: "red",
    marginTop: "20px"
  }
};
