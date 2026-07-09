const admin = require("firebase-admin");

async function getUserRole({token}) {
  try {
    const decodedToken = await admin.auth().verifyIdToken(token);
   console.log("it runs here",token);
    return {
      success: true,
      role: decodedToken.admin ? "admin" : "user",
      user: decodedToken,
    };
  } catch (error) {
    return {
      success: false,
      role: null,
      error: error.message,
    };
  }
}

module.exports = getUserRole;