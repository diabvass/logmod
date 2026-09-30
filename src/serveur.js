const express = require("express");
require("dotenv").config();
const cookieParser = require("cookie-parser");
const serveur = express();
const routes = require("./routes");
const port = process.env.PORT || 8000;
const hostname = process.env.HOSTNAME || "127.0.0.1";
const cors = require("cors");
serveur.use(express.static('/sdcard/dev/mylog/'));
serveur.use(cors({ 
  origin: true, 
  credentials: true 
}));
serveur.use(express.json());
serveur.use(cookieParser());

serveur.get("/", (__req, res) => {
  res.json({message: "Fekir developper hh"});
})

// routes principal
serveur.use("/api", routes);

// Erreur route inexistante
serveur.use((req, res) => {
  res.status(404).json({ 
    statut: false, 
    result: `Cette page n'existe pas` 
  });
});

// Erreur serveur
serveur.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ 
    statut: false, 
    result: "Erreur du serveur" 
  });
});

serveur.listen(port, hostname, () => {
  console.log(`Serveur lancé sur ${hostname}:${port}`);
})