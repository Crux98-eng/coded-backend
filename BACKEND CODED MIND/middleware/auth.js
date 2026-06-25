// const admin = require('firebase-admin');

// // Initialize Firebase Admin (assuming service account key is in .env or file)
// if (!admin.apps.length) {
//   // Download service account key from Firebase Console > Project Settings > Service Accounts
//   // Set GOOGLE_APPLICATION_CREDENTIALS=path/to/key.json or initialize with cert
//   // For simplicity, using default credentials or add service account path
//   // In production, use process.env.GOOGLE_APPLICATION_CREDENTIALS or initialize with key
//   admin.initializeApp({
//     credential: admin.credential.applicationDefault(), // or cert(require('./path/to/serviceAccountKey.json'))
//     projectId: process.env.PROJECT_ID
//   });
// }

// const authenticate = async (req, res, next) => {
//   const authHeader = req.headers.authorization;
//   if (!authHeader || !authHeader.startsWith('Bearer ')) {
//     return res.status(401).json({ error: 'Unauthorized' });
//   }

//   const idToken = authHeader.split('Bearer ')[1];
//   try {
//     const decodedToken = await admin.auth().verifyIdToken(idToken);
//     req.user = decodedToken;
   
//     next();
//   } catch (error) {
//    // console.error('Token verification error:', error.message);
//     res.status(401).json({ error: 'Invalid token' });
//   }
// };

// module.exports = { authenticate };
const admin = require("firebase-admin");

// Initialize Firebase Admin
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.applicationDefault(),
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

    return res.status(401).json({ error: "Invalid or expired token" });
  }
};

module.exports = { authenticate };