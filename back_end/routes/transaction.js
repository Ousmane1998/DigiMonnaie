const express = require('express');
const router = express.Router();
const { pool, promisePool } = require('../config/db');


// Annuler une transaction
router.post('/annuler', async (req, res) => {
  const { numeroTransaction, motif } = req.body;

  try {
    // Vérifier si la transaction existe
    const [rows] = await db.promise().query(
      'SELECT * FROM Transaction WHERE numero = ?',
      [numeroTransaction]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: 'Transaction introuvable' });
    }

    // Mettre à jour le statut
    await db.promise().query(
      'UPDATE Transaction SET statut = ?, motif_annulation = ? WHERE numero = ?',
      ['Annulée', motif, numeroTransaction]
    );

    res.json({ success: true, message: 'Transaction annulée avec succès' });
  } catch (err) {
    console.error('❌ Erreur annulation :', err);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});




router.post('/depot-retrait', async (req, res) => {
  const { type, montant, destinataireCompteId, distributeurUtilisateurId } = req.body;

  if (!['depot', 'retrait'].includes(type)) {
    return res.status(400).json({ error: 'Type invalide' });
  }

  try {
    const [rows] = await promisePool.query(
      'SELECT id FROM Compte WHERE utilisateur_id = ? AND type = "distributeur"',
      [distributeurUtilisateurId]
    );
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Compte distributeur introuvable' });
    }
    const distributeurCompteId = rows[0].id;

    const [compteRows] = await promisePool.query(
      'SELECT id FROM Compte WHERE numeroCompte = ?',
      [destinataireCompteId]
    );
    if (compteRows.length === 0) {
      return res.status(404).json({ error: 'Compte destinataire introuvable' });
    }
    const destinataireId = compteRows[0].id;

    const frais = montant * 0.01;
    const commission = frais;

    const conn = await promisePool.getConnection();

    await conn.beginTransaction();

    try {
      await conn.query(
        `INSERT INTO Transactions (type, montant, frais, compte_id, utilisateur_id, statut)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [type, montant, frais, destinataireId, distributeurUtilisateurId, 'en_attente']
      );

      if (type === 'depot') {
        await conn.query(`UPDATE Compte SET solde = solde + ? WHERE id = ?`, [montant, destinataireId]);
        await conn.query(`UPDATE Compte SET solde = solde + ? WHERE id = ?`, [commission, distributeurCompteId]);
        await conn.query(`UPDATE Distributeur SET commission = commission + ? WHERE id = ?`, [commission, distributeurUtilisateurId]);
      } else {
        await conn.query(`UPDATE Compte SET solde = solde - ? WHERE id = ?`, [montant + frais, destinataireId]);
        await conn.query(`UPDATE Compte SET solde = solde + ? WHERE id = ?`, [commission, distributeurCompteId]);
        await conn.query(`UPDATE Distributeur SET commission = commission + ? WHERE id = ?`, [commission, distributeurUtilisateurId]);
      }

      await conn.commit();
      conn.release();

      res.json({
        success: true,
        message: `✅ ${type === 'depot' ? 'Dépôt' : 'Retrait'} effectué avec succès`,
        frais,
        commission
      });
    } catch (err) {
      await conn.rollback();
      conn.release();
      console.error('❌ Erreur transaction :', err.message);
      res.status(500).json({ error: 'Erreur serveur' });
    }
  } catch (err) {
    console.error('❌ Erreur initiale :', err.message);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});




module.exports = router;

