const db = require('../config/db');
db.query(`
 CREATE TABLE Utilisateurs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    prenom VARCHAR(100),
    nom VARCHAR(100),
    adresse VARCHAR(255),
    email VARCHAR(150) UNIQUE,
    telephone VARCHAR(20) UNIQUE,
    photo LONGBLOB,
    date_naissance DATE,
    carte_identite VARCHAR(50),
    role ENUM('client','agent','distributeur') NOT NULL
);

`, (err) => {
  if (err) throw err;
  console.log('✅ Table "utilisateurs" créée');
});