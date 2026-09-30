const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const secretJWT = process.env.JWT_SECRET;


module.exports = (db) => async (req, res) => {
  try {
    const { telephone_user, mot_de_passe_user } = req.body;
    // scope null mot de passe
    const user = await db.User.scope(null).findOne({
      where: { telephone_user }
    });

    if (!user) {
      console.log("Numéro introuvable : ", telephone_user);
      return res.status(404).json({
        statut: false,
        result: "Numéro ou mot de passe incorrect"
      });
    }

    const ok = await bcrypt.compare(mot_de_passe_user, user.mot_de_passe_user);
    if (!ok) {
      console.log("Mot de passe incorrect");
      return res.status(401).json({
        statut: false,
        result: "Numéro ou mot de passe incorrect"
      });
    }
    // token
    const token = jwt.sign(
      {
        id_user: user.id_user,
        nom_user: user.nom_user,
        role: user.role
      }, secretJWT,
      { expiresIn: "1h" }
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: false,// en test
      sameSite: "lax",
      maxAge: 3600000, // 1h
      path: "/"
    });

    return res.json({
      statut: true,
      result: "connecté"
    });
  }
  catch (err) {
    console.log(err.message);
    return res.status(500).json({
      statut: false,
      result: "Erreur serveur"
    })
  }
};
