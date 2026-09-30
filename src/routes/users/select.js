const all = (db) => async (req, res) => {
    try {
        const users = await db.User.findAll();
        return res.json({ statut: true, 
            data: users 
        });
        
    }
    catch(err){ 
        console.log(err.message)
        return res.status(500).json({ 
            statut: false,
            result: "Erreur serveur"
        })
    }
};

const one = (db) => async (req, res) => {
  try {
    const id = req.params.id;
    const role = req.user.role; 
    const id_connect = req.user.id_user; 

    if (role === "gerant" && id !== id_connect) {
        console.log("Accès interdit, gérant ne peut voir que son propre profil")
        return res.status(403).json({ 
            statut: false, 
            result: "Accès interdit" 
        });
    }

    const user = await db.User.findByPk(id);
    if (!user) return res.status(404).json({ 
        statut: false, 
        result: "User non trouvé" 
    });

    return res.json({ 
        statut: true, 
        result: "User trouvé",
        data: user 
    });

  } catch (err) {
    console.log(err.message);
    return res.status(500).json({ 
        statut: false, 
        result: "Erreur serveur" 
    });
  }
};

module.exports = { all, one };