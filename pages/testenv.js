export default function TestEnv() {
  return (
    <pre style={{ padding: 40, fontSize: 20 }}>
      {JSON.stringify(
        {
          apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY ? "OK" : "MISSING",
          projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ? "OK" : "MISSING",
        },
        null,
        2
      )}
    </pre>
  );
}
