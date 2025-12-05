import { db } from "../lib/firebase";
import { doc, setDoc } from "firebase/firestore";

export default function TestWrite({ ok, error }) {
  return (
    <div style={{ padding: 40, fontSize: 24 }}>
      <h1>Write Test</h1>
      {ok ? (
        <p style={{ color: "green" }}>🔥 SUCCESS — Write completed</p>
      ) : (
        <p style={{ color: "red" }}>❌ ERROR: {error}</p>
      )}
    </div>
  );
}

export async function getServerSideProps() {
  try {
    await setDoc(doc(db, "testCollection", "testDoc"), {
      timestamp: new Date().toISOString(),
    });
    return { props: { ok: true } };
  } catch (err) {
    return { props: { ok: false, error: err.message } };
  }
}
