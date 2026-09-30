const jwt = require("jsonwebtoken");
const secretJWT = process.env.JWT_SECRET;
const connected = require("./connected.js")
function auth(roles = []) {
  return (req, res, next) => {
    const token = req.cookies["token"];
    if (!token) {
      console.log("token absent")
      return res.status(401).json({ 
      statut: false, 
      result: "Non connecté" 
    });
    }
    
    jwt.verify(token, secretJWT, (err, decoded) => {
      if (err) return res.status(401).json({ 
        statut: false, 
        result: "Token invalide" 
      });

      if (roles.length && !roles.includes(decoded.role)) {
        return res.status(403).json({ 
          statut: false, 
          result: "Accès interdit" 
        });
      }
      req.user = decoded;
      next();
    });
  }
}
module.exports = {auth, connected};