const express = require('express');
const router = express.Router();
const { pool, promisePool } = require('../config/db');

// Liste des comptes
router.get('/', async (req, res) => {
  try {
    const [comptes] = await promisePool.query(
      `SELECT u.nom, c.numeroCompte, c.id, c.etat
       FROM Compte c
       JOIN Utilisateurs u ON c.utilisateur_id = u.id`
    );
    res.json({ comptes });
  } catch (err) {
    console.error('Erreur chargement comptes :', err);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// Supprimer un compte
router.delete('/:id', async (req, res) => {
  try {
    await promisePool.query('DELETE FROM Compte WHERE id = ?', [req.params.id]);
    res.json({ success: true, message: 'Compte supprimé' });
  } catch (err) {
    res.status(500).json({ error: 'Erreur suppression' });
  }
});

// Bloquer un compte
router.put('/bloquer/:id', async (req, res) => {
  try {
    await promisePool.query('UPDATE Compte SET etat = "bloqué" WHERE id = ?', [req.params.id]);
    res.json({ success: true, message: 'Compte bloqué' });
  } catch (err) {
    res.status(500).json({ error: 'Erreur blocage' });
  }
});

// Modifier un compte
router.put('/modifier/:id', async (req, res) => {
  const { nom } = req.body;
  try {
    await promisePool.query(
      `UPDATE Utilisateurs 
       SET nom = ? 
       WHERE id = (SELECT utilisateur_id FROM Compte WHERE id = ?)`,
      [nom, req.params.id]
    );
    res.json({ success: true, message: 'Compte modifié' });
  } catch (err) {
    res.status(500).json({ error: 'Erreur modification' });
  }
});

module.exports = router;
