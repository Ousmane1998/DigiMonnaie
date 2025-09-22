const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const { pool, promisePool } = require('../config/db');  // ✅

router.post('/activation/:numeroCompte', async (req, res) => {
  try {
    const { mot_de_passe } = req.body;
    const { numeroCompte } = req.params;

    if (!mot_de_passe || mot_de_passe.length < 4) {
      return res.status(400).json({ error: 'Mot de passe invalide ou trop court' });
    }

    // 🔍 Trouver l'utilisateur lié au compte
    const [rows] = await promisePool.query(
      `SELECT u.id FROM Utilisateurs u
       JOIN Compte c ON u.id = c.utilisateur_id
       WHERE c.numeroCompte = ?`,
      [numeroCompte]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: 'Compte introuvable' });
    }

    const utilisateurId = rows[0].id;
    const hash = await bcrypt.hash(mot_de_passe, 10);

    // 🔐 Mettre à jour le mot de passe
    await promisePool.query(
      'UPDATE Utilisateurs SET mot_de_passe = ? WHERE id = ?',
      [hash, utilisateurId]
    );

    res.status(200).json({ message: 'Mot de passe créé avec succès' });
  } catch (err) {
    console.error('❌ Erreur serveur :', err);
    res.status(500).json({ error: 'Erreur serveur lors de l’activation' });
  }
});

module.exports = router;
