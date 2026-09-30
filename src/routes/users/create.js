const bcrypt = require("bcrypt");
module.exports = (db) => async (req, res) => {
  const { nom_user, role, telephone_user, mot_de_passe_user } = req.body;
  const User = db.User;

  if(!nom_user || !role || !telephone_user || !mot_de_passe_user){
    return res.status(400).json({
        statut: false, 
        result: "Données manquantes" 
    });
  }

  try {
    const hash_password = await bcrypt.hash(mot_de_passe_user, 10);
    const id_user = 'U' + Date.now().toString().slice(-9); // id
    const result = await User.create({ 
      id_user, 
      nom_user, 
      role, 
      telephone_user, 
      mot_de_passe_user: hash_password 
    });
    
    return res.status(201).json({ 
        statut: true, 
        result: `Utilisateur ${result.nom_user} créé`, 
    });
  } catch (err) {
    console.log(err.errors[0].message);
    if (err.name === 'SequelizeUniqueConstraintError') {
      return res.status(200).json({
        statut: false,
        result: "Impossible de créer le compte. Veuillez réessayer ou contacter le support."
      });
    }
    return res.status(500).json({ 
        statut: false, 
        result: "Erreur serveur",
      message: err
    });
  }
};