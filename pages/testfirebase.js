import { db } from "../lib/firebase";
import { collection, getDocs } from "firebase/firestore";

export default function TestFirebase({ ok, error }) {
  return (
    <div style={{ padding: 40, fontSize: 24 }}>
      <h1>Firebase Test</h1>
      {ok ? (
        <p style={{ color: "green" }}>🔥 SUCCESS — Firestore connected</p>
      ) : (
        <p style={{ color: "red" }}>❌ ERROR: {error}</p>
      )}
    </div>
  );
}

export async function getServerSideProps() {
  try {
    // Try reading the bottles collection
    const snap = await getDocs(collection(db, "bottles"));

    return { props: { ok: true } };
  } catch (err) {
    return { props: { ok: false, error: err.message } };
  }
}
