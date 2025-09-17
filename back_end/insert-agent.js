const db = require('./config/db'); // Chemin vers ton fichier de connexion
const bcrypt = require('bcrypt');

// Données de l'agent à insérer
const agent = {
  prenom: 'Ousmane',
  nom: 'faye',
  adresse: 'Dakar',
  email: 'agent@gmail.com',
  telephone: '770000000',
  photo: null,
  date_naissance: '2000-01-01',
  carte_identite: 'SN123456789',
  motDePasse: '1234',
  role: 'agent'
};

// Hachage du mot de passe
bcrypt.hash(agent.motDePasse, 10, (err, hash) => {
  if (err) throw err;

  const sql = `
    INSERT INTO Utilisateurs 
    (prenom, nom, adresse, email, telephone, photo, date_naissance, carte_identite, mot_de_passe, role)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  const values = [
    agent.prenom,
    agent.nom,
    agent.adresse,
    agent.email,
    agent.telephone,
    agent.photo,
    agent.date_naissance,
    agent.carte_identite,
    hash,
    agent.role
  ];

  db.query(sql, values, (err, result) => {
    if (err) throw err;
    const agentId = result.insertId;

    // Insertion dans la table Agent
    db.query('INSERT INTO Agent (id) VALUES (?)', [agentId], (err2) => {
      if (err2) throw err2;
      console.log(`✅ Agent inséré avec succès (ID: ${agentId})`);
      db.end();
    });
  });
});
