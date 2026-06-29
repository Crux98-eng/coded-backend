const admin = require("firebase-admin");

//admin configuration TO MAKE USER ADMIN
const serviceAccount = require("../coded-mind-inc-firebase-adminsdk-fbsvc-c51f0265e5.json");

const uid = "kIrftO4Ct2SXeiRpSpaMLE6Pzfj2";

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

async function makeAdmin() {
  try {
    await admin.auth().setCustomUserClaims(uid, {
      admin: true,
    });

    console.log("✅ User is now admin");
  } catch (err) {
    console.error("❌ Error:", err);
  }
}

makeAdmin();