const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  const token = req.cookies?.token || req.headers.authorization?.split(" ")[1];

  if (!token) {
    return next(); // pas connecté
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // déjà connecté
    return res.status(403).json({
      statut: false,
      result: "Vous êtes déjà connecté"
    });
  } catch (err) {
    // token expiré ou invalide
    res.clearCookie("token");
    return next();
  }
};