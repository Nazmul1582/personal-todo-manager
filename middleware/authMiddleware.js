const { getUserById } = require("../utils/fileUtil");

module.exports = async (req, res, next) => {
  try {
    const userId = req.signedCookies.userId || req.cookies.userId;
    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const user = await getUserById(userId);
    if (!user) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error("Auth middleware error", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};
