const express = require('express');
const router = express.Router();
const { promisePool } = require('../config/db'); // adapte le chemin si nécessaire

router.get('/profil', async (req, res) => {
  const userId = req.session?.userId;
  if (!userId) return res.status(401).json({ error: 'Non connecté' });

  try {
    const [rows] = await promisePool.query(
      `SELECT u.id, u.nom, u.role, u.telephone, c.numeroCompte, c.solde
       FROM Utilisateurs u
       JOIN Compte c ON u.id = c.utilisateur_id
       WHERE u.id = ?`,
      [userId]
    );

    if (!rows.length) return res.status(404).json({ error: 'Utilisateur introuvable' });

    res.json({ utilisateur: rows[0] });
  } catch (err) {
    console.error('❌ Erreur SQL :', err);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

router.get('/transactions', async (req, res) => {
  const userId = req.session?.userId;
  if (!userId) return res.status(401).json({ error: 'Non connecté' });

  try {
    const [rows] = await promisePool.query(
      `SELECT type, montant, date_transaction
       FROM Transactions
       WHERE utilisateur_id = ?
       ORDER BY date_transaction DESC`,
      [userId]
    );

    res.json({ transactions: rows });
  } catch (err) {
    console.error('❌ Erreur SQL :', err);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});


module.exports = router;
