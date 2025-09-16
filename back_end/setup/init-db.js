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

//table compte
db.query(`
CREATE TABLE Compte (
    id INT AUTO_INCREMENT PRIMARY KEY,
    numeroCompte VARCHAR(50) UNIQUE NOT NULL,
    solde FLOAT DEFAULT 0,
    etat ENUM('active','bloque') DEFAULT 'active',
    type ENUM('client','distributeur','literal') NOT NULL,
    date_creation DATETIME DEFAULT CURRENT_TIMESTAMP,
    utilisateur_id INT,
    FOREIGN KEY (utilisateur_id) REFERENCES Utilisateurs(id)
);

`, (err) => {
  if (err) throw err;
  console.log('✅ Table "utilisateurs" créée');
});

//table client
db.query(`
    CREATE TABLE Client (
    id INT PRIMARY KEY,
    FOREIGN KEY (id) REFERENCES Utilisateurs(id)
);
    `, (err) => {
  if (err) throw err;
  console.log('✅ Table "utilisateurs" créée');
});

//table distributeur
db.query(`
    CREATE TABLE Distributeur (
    id INT PRIMARY KEY,
    commission FLOAT DEFAULT 0,
    FOREIGN KEY (id) REFERENCES Utilisateurs(id)
);
    `, (err) => {
  if (err) throw err;
  console.log('✅ Table "utilisateurs" créée');
});
 
//table Agent
db.query(`
    CREATE TABLE Agent (
    id INT PRIMARY KEY,
    FOREIGN KEY (id) REFERENCES Utilisateurs(id)
);
    `, (err) => {
  if (err) throw err;
  console.log('✅ Table "utilisateurs" créée');
});

//table agent
db.query(`
CREATE TABLE Transactions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    date_transaction DATETIME DEFAULT CURRENT_TIMESTAMP,
    type ENUM('depot','retrait','transfert') NOT NULL,
    montant FLOAT NOT NULL,
    frais FLOAT DEFAULT 0,
    statut ENUM('en_attente','valide','annuler') DEFAULT 'en_attente',
    compte_id INT,
    agent_id INT,
    FOREIGN KEY (compte_id) REFERENCES Compte(id),
    FOREIGN KEY (agent_id) REFERENCES Agent(id)
);
`, (err) => {
  if (err) throw err;
  console.log('✅ Table "utilisateurs" créée');
});

//table historique
db.query(`
CREATE TABLE Historique (
    id INT AUTO_INCREMENT PRIMARY KEY,
    dateHeure DATETIME DEFAULT CURRENT_TIMESTAMP,
    montant FLOAT,
    solde_avant FLOAT,
    solde_apres FLOAT,
    compteID INT,
    utilisateurID INT,
    transactionID INT,
    FOREIGN KEY (compteID) REFERENCES Compte(id),
    FOREIGN KEY (utilisateurID) REFERENCES Utilisateurs(id),
    FOREIGN KEY (transactionID) REFERENCES Transactions(id)
);

`, (err) => {
  if (err) throw err;
  console.log('✅ Table "utilisateurs" créée');
});
