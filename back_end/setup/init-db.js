// fichier: models/initDB.js
const { pool } = require('../config/db');

// ================== TABLE Utilisateurs ==================
pool.query(`
CREATE TABLE IF NOT EXISTS Utilisateurs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    prenom VARCHAR(100) NOT NULL,
    nom VARCHAR(100) NOT NULL,
    adresse VARCHAR(255),
    email VARCHAR(150) UNIQUE,
    telephone VARCHAR(20) UNIQUE,
    photo LONGBLOB,
    date_naissance DATE,
    carte_identite VARCHAR(50),
    role ENUM('client','agent','distributeur') NOT NULL
) ENGINE=InnoDB;
`, (err) => {
  if (err) throw err;
  console.log('✅ Table "Utilisateurs" créée');
});

// ================== TABLE Compte ==================
pool.query(`
CREATE TABLE IF NOT EXISTS Compte (
    id INT AUTO_INCREMENT PRIMARY KEY,
    numeroCompte VARCHAR(50) UNIQUE NOT NULL,
    solde FLOAT DEFAULT 0,
    etat ENUM('active','bloque') DEFAULT 'active',
    type ENUM('client','distributeur') NOT NULL,
    date_creation DATETIME DEFAULT CURRENT_TIMESTAMP,
    utilisateur_id INT,
    FOREIGN KEY (utilisateur_id) REFERENCES Utilisateurs(id) ON DELETE CASCADE
) ENGINE=InnoDB;
`, (err) => {
  if (err) throw err;
  console.log('✅ Table "Compte" créée');
});

// ================== TABLE Client ==================
pool.query(`
CREATE TABLE IF NOT EXISTS Client (
    id INT PRIMARY KEY,
    FOREIGN KEY (id) REFERENCES Utilisateurs(id) ON DELETE CASCADE
) ENGINE=InnoDB;
`, (err) => {
  if (err) throw err;
  console.log('✅ Table "Client" créée');
});

// ================== TABLE Distributeur ==================
pool.query(`
CREATE TABLE IF NOT EXISTS Distributeur (
    id INT PRIMARY KEY,
    commission FLOAT DEFAULT 0,
    FOREIGN KEY (id) REFERENCES Utilisateurs(id) ON DELETE CASCADE
) ENGINE=InnoDB;
`, (err) => {
  if (err) throw err;
  console.log('✅ Table "Distributeur" créée');
});

// ================== TABLE Agent ==================
pool.query(`
CREATE TABLE IF NOT EXISTS Agent (
    id INT PRIMARY KEY,
    FOREIGN KEY (id) REFERENCES Utilisateurs(id) ON DELETE CASCADE
) ENGINE=InnoDB;
`, (err) => {
  if (err) throw err;
  console.log('✅ Table "Agent" créée');
});

// ================== TABLE Transactions ==================
pool.query(`
CREATE TABLE IF NOT EXISTS Transactions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    date_transaction DATETIME DEFAULT CURRENT_TIMESTAMP,
    type ENUM('depot','retrait','transfert') NOT NULL,
    montant FLOAT NOT NULL,
    frais FLOAT DEFAULT 0,
    statut ENUM('en_attente','valide','annuler') DEFAULT 'en_attente',
    compte_id INT,
    utilisateur_id INT,
    FOREIGN KEY (compte_id) REFERENCES Compte(id) ON DELETE CASCADE,
    FOREIGN KEY (utilisateur_id) REFERENCES Utilisateurs(id) ON DELETE CASCADE
) ENGINE=InnoDB;
`, (err) => {
  if (err) throw err;
  console.log('✅ Table "Transactions" créée');
});

// ================== TABLE Historique ==================
pool.query(`
CREATE TABLE IF NOT EXISTS Historique (
    id INT AUTO_INCREMENT PRIMARY KEY,
    dateHeure DATETIME DEFAULT CURRENT_TIMESTAMP,
    montant FLOAT,
    solde_avant FLOAT,
    solde_apres FLOAT,
    compteID INT NOT NULL,
    utilisateurID INT NOT NULL,
    transactionID INT NOT NULL,
    FOREIGN KEY (compteID) REFERENCES Compte(id) ON DELETE CASCADE,
    FOREIGN KEY (utilisateurID) REFERENCES Utilisateurs(id) ON DELETE CASCADE,
    FOREIGN KEY (transactionID) REFERENCES Transactions(id) ON DELETE CASCADE
) ENGINE=InnoDB;
`, (err) => {
  if (err) throw err;
  console.log('✅ Table "Historique" créée');
});
