const User = require("../models/User");

const checkBlocked = async (req, res, next) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const user = await User.findById(req.user.id).select("status");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.status === "BLOCKED") {
      return res.status(403).json({ message: "User is blocked" });
    }

    next();
  } catch (error) {
    console.error("checkBlocked error:", error.message);
    return res.status(500).json({ message: "Server error" });
  }
};

module.exports = checkBlocked;