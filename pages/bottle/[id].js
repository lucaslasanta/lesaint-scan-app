import { useRouter } from "next/router";

export default function BottlePage() {
  const router = useRouter();
  const { id } = router.query;

  if (!id) return <p>Loading...</p>;

  return (
    <div style={{
      fontFamily: "sans-serif",
      padding: "40px",
      textAlign: "center"
    }}>
      <h1>🍸 Le Saint Bottle #{id}</h1>

      <p>This is a placeholder page showing dynamic routing works.</p>
      <p>Your QR code is now alive.</p>

      <hr style={{ margin: "40px 0" }} />

      <h3>Next Steps:</h3>
      <ul style={{ textAlign: "left", maxWidth: 400, margin: "0 auto" }}>
        <li>Connect to Firebase</li>
        <li>Fetch bottle info</li>
        <li>Detect first scan</li>
        <li>Award points</li>
        <li>Show song</li>
        <li>Check if bottle is a prize bottle</li>
      </ul>
    </div>
  );
}
