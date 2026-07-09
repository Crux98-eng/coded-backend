

// module.exports = { authenticate };
const admin = require("firebase-admin");

// Initialize Firebase Admin
if (!admin.apps.length) {
  //  const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
   const serviceAccount = require('../coded-mind-inc-firebase-adminsdk-fbsvc-c51f0265e5.json');
  admin.initializeApp({
    // credential: admin.credential.applicationDefault(),
     credential: admin.credential.cert(serviceAccount),
    projectId: process.env.PROJECT_ID,
  });
}

const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const token = authHeader.split(" ")[1];

    if (!token) {
      return res.status(401).json({ error: "Token missing" });
    }

    // 🔥 IMPORTANT: true = checks token revocation (session invalidation support)
    const decodedToken = await admin.auth().verifyIdToken(token, true);

    req.user = decodedToken;

    next();
  } catch (error) {
    console.error("Auth error:", error.message);

    return res.status(401).json({ error: "TOKEN_EXPIRED" });
  }
};

module.exports = { authenticate };