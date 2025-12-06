import { db } from "../../lib/firebase";
import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  arrayUnion,
  increment,
  collection,
  addDoc
} from "firebase/firestore";
import { v4 as uuidv4 } from "uuid";

export default async function handler(req, res) {
  try {
    const { bottleId } = req.query;
    if (!bottleId) return res.status(400).json({ error: "Missing bottle ID" });

    // Read or create anonymous user
    let userId = req.cookies.ls_user;
    if (!userId) {
      userId = uuidv4();
      res.setHeader("Set-Cookie", `ls_user=${userId}; Path=/; HttpOnly; Max-Age=31536000`);
    }

    // Fetch bottle
    const bottleRef = doc(db, "bottles", bottleId);
    const bottleSnap = await getDoc(bottleRef);

    if (!bottleSnap.exists()) {
      return res.status(404).json({ error: "Bottle not found" });
    }

    const bottleData = bottleSnap.data();

    // Fetch user
    const userRef = doc(db, "users", userId);
    let userSnap = await getDoc(userRef);

    // Create user if not exist
    if (!userSnap.exists()) {
      await setDoc(userRef, {
        createdAt: new Date(),
        displayName: "Saint",
        level: "Saint Initiation",
        points: 0,
        scans: []
      });
      userSnap = await getDoc(userRef);
    }

    let userData = userSnap.data();

    const alreadyScanned = userData.scans.includes(bottleId);

    // POINT LOGIC
    let pointsAwarded = 0;
    if (!alreadyScanned) pointsAwarded = 1;

    // Update user points + scan history
    if (!alreadyScanned) {
      await updateDoc(userRef, {
        points: increment(pointsAwarded),
        scans: arrayUnion(bottleId)
      });
    }

    // Update bottle legacy
    if (!alreadyScanned) {
      await updateDoc(bottleRef, {
        totalScans: increment(1)
      });
    }

    // Log scan event
    await addDoc(collection(db, "scans"), {
      bottleId,
      userId,
      timestamp: new Date(),
      pointsAwarded
    });

    // Return response UI needs
    return res.status(200).json({
      bottle: {
        songURL: bottleData.songURL,
        isPrizeBottle: bottleData.isPrizeBottle,
        totalScans: (bottleData.totalScans || 0) + (!alreadyScanned ? 1 : 0)
      },
      user: {
        points: userData.points + pointsAwarded,
        displayName: userData.displayName,
        level: userData.level
      },
      awarded: pointsAwarded,
      alreadyScanned
    });
  } catch (err) {
    console.error("Scan API error:", err);
    return res.status(500).json({ error: err.message });
  }
}
