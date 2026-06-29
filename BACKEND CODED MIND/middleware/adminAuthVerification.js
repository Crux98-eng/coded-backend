

const admin = require("firebase-admin");

const verifyFirebaseToken = async (req, res, next) => {
  // console.log("===== VERIFY MIDDLEWARE =====");

  try {
    const authHeader = req.headers.authorization;

    // console.log("Authorization Header:", authHeader);

    if (!authHeader?.startsWith("Bearer ")) {
      console.log("No Bearer token");
      return res.status(401).json({
        message: "No token provided",
      });
    }

    const token = authHeader.split(" ")[1];

    // console.log("Token received:", token.substring(0, 30) + "...");

    const decodedToken = await admin.auth().verifyIdToken(token);

    // console.log("Decoded Token:", decodedToken);

    req.user = decodedToken;

    next();
  } catch (error) {
    console.log("VERIFY ERROR:");
    // console.log(error);

    return res.status(401).json({
      message: "Invalid token",
      error: error.message,
    });
  }
};

module.exports = verifyFirebaseToken;