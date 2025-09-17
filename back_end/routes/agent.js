const express = require('express');
const router = express.Router();
const db = require('../config/db');
const bcrypt = require('bcrypt');

// Route de connexion agent
router.post('/login', (req, res) => {
  const { email, motDePasse } = req.body;

  db.query('SELECT * FROM Utilisateurs WHERE email = ? AND role = "agent"', [email], (err, results) => {
    if (err) return res.status(500).send(err);
    if (results.length === 0) return res.status(401).send('Agent non trouvé');

    const agent = results[0];
    bcrypt.compare(motDePasse, agent.mot_de_passe, (err, match) => {
      if (match) {
        res.json({ success: true, agentId: agent.id });
      } else {
        res.status(401).send('Mot de passe incorrect');
      }
    });
  });
});

module.exports = router;
