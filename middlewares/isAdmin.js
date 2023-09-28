const User = require("../models/user");

const isAdmin = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ message: "Unauthorized" });
  const tokenParts = authHeader.split(" ");
  if (tokenParts.length !== 2 || tokenParts[0] !== "Bearer")
    return res.status(401).json({ message: "Unauthorized" });
  const token = tokenParts[1];
  const user = await User.findOne({ token });
  if (user && user.role === "admin") {
    next();
  } else {
    res.status(403).json({ message: "No access" });
  }
};

module.exports = isAdmin;
