const { Sequelize, DataTypes } = require("sequelize");
const DB_NAME = process.env.DB_NAME;
const DB_USER = process.env.DB_USER;
const DB_HOST = process.env.DB_HOST;
const DB_PASSWORD = process.env.DB_PASSWORD;

const sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASSWORD, { 
  host: DB_HOST, 
  dialect: 'mysql',
  logging: false 
});

const User = sequelize.define('User', {
  id_user: { type: DataTypes.STRING(10), primaryKey: true },
  nom_user: { type: DataTypes.STRING(20), allowNull: false },
  role: { type: DataTypes.STRING(10), allowNull: false },
  telephone_user: { type: DataTypes.STRING(15), allowNull: false, unique: true },
  mot_de_passe_user: { type: DataTypes.STRING(255), allowNull: false },
}, {
  tableName: 'users', 
  timestamps: false,
  defaultScope: {
    attributes: { exclude: ['mot_de_passe_user'] }
  }
});

const Balle = sequelize.define('Balle', {
  id_balle: { type: DataTypes.STRING(30), primaryKey: true },
  designation: { type: DataTypes.STRING(100), allowNull: false },
  date_update: DataTypes.DATE
}, { tableName: 'balle', timestamps: false });

const Registre = sequelize.define('Registre', {
  id_registre: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  date_registre: { type: DataTypes.DATE, allowNull: false },
  solde_initial: DataTypes.INTEGER,
  solde_vente: DataTypes.INTEGER,
  solde_total: DataTypes.INTEGER,
  statut: { type: DataTypes.STRING(15), allowNull: false },
}, { tableName: 'registre_journalier', timestamps: false });

const Reservation = sequelize.define('Reservation', {
  id_reservation: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  nom_client: DataTypes.STRING(20),
  telephone: { type: DataTypes.STRING(15), allowNull: false },
  designation: DataTypes.STRING(100),
  montant: { type: DataTypes.INTEGER, allowNull: false },
  avance: DataTypes.INTEGER,
  statut: { type: DataTypes.STRING(15), allowNull: false },
  date_reservation: DataTypes.DATE
}, { tableName: 'reservation', timestamps: false });

const Vente = sequelize.define('Vente', {
  id_vente: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  description_vente: DataTypes.STRING(100),
  montant_vente: { type: DataTypes.INTEGER, allowNull: false },
  date_vente: DataTypes.DATE
}, { tableName: 'vente_detail', timestamps: false });

const Flux = sequelize.define('Flux', {
  id_flux: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  type_flux: { type: DataTypes.STRING(10), allowNull: false },
  nombre_balle: { type: DataTypes.INTEGER, allowNull: false },
  date_flux: { type: DataTypes.DATE, allowNull: false },
  id_balle: { type: DataTypes.STRING(30), allowNull: false }
}, { tableName: 'flux_stock', timestamps: false });

const Depense = sequelize.define('Depense', {
  id_depense: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  date_depense: { type: DataTypes.DATE, allowNull: false },
  motif: { type: DataTypes.STRING(100), allowNull: false },
  montant: { type: DataTypes.INTEGER, allowNull: false },
}, { tableName: 'depense', timestamps: false });

const SaisirDepense = sequelize.define('SaisirDepense', {
  id_user: { type: DataTypes.STRING(10), primaryKey: true },
  id_depense: { type: DataTypes.INTEGER, primaryKey: true }
}, { tableName: 'saisir_depense', timestamps: false });

// relations
User.hasMany(Registre, { foreignKey: 'id_user' });
Registre.belongsTo(User, { foreignKey: 'id_user' });

User.hasMany(Reservation, { foreignKey: 'id_user' });
Reservation.belongsTo(User, { foreignKey: 'id_user' });

User.hasMany(Vente, { foreignKey: 'id_user' });
Vente.belongsTo(User, { foreignKey: 'id_user' });

User.hasMany(Flux, { foreignKey: 'id_user' });
Flux.belongsTo(User, { foreignKey: 'id_user' });

Balle.hasMany(Flux, { foreignKey: 'id_balle' });
Flux.belongsTo(Balle, { foreignKey: 'id_balle' });

Registre.hasMany(Vente, { foreignKey: 'id_registre' });
Vente.belongsTo(Registre, { foreignKey: 'id_registre' });

Registre.hasMany(Depense, { foreignKey: 'id_registre' });
Depense.belongsTo(Registre, { foreignKey: 'id_registre' });

User.belongsToMany(Depense, { through: SaisirDepense, foreignKey: 'id_user' });
Depense.belongsToMany(User, { through: SaisirDepense, foreignKey: 'id_depense' });

// création
//sequelize.sync({ alter: true }).then(() => console.log("tables synchronisées"));

module.exports = { sequelize, User, Balle, Registre, Reservation, Vente, Flux, Depense, SaisirDepense };

