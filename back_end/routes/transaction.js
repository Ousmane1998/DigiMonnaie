const express = require('express');
const router = express.Router();
const { pool, promisePool } = require('../config/db');
;

// Annuler une transaction
  router.post('/annuler', async (req, res) => {
  const { numeroTransaction, motif } = req.body;
  const utilisateurId = req.session?.userId;
    console.log('📡 Session userId:', req.session?.userId);
  if (!utilisateurId) {
    return res.status(401).json({ error: 'Utilisateur non connecté' });
  }


  try {
    // 1. Récupérer la transaction par son numéro
    const [txRows] = await promisePool.query(
      'SELECT * FROM Transactions WHERE numero_transaction = ? AND statut != "annuler"',
      [numeroTransaction]
    );

    if (!txRows.length) {
      return res.status(404).json({ error: 'Transaction introuvable ou déjà annulée' });
    }

    const transaction = txRows[0];

    // 2. Vérifier que l’utilisateur est agent ou distributeur
    const [userRows] = await promisePool.query(
      'SELECT role FROM Utilisateurs WHERE id = ?',
      [utilisateurId]
    );

    const role = userRows[0]?.role;
    if (role !== 'agent' && role !== 'distributeur') {
      return res.status(403).json({ error: 'Seul un agent ou distributeur peut annuler une transaction' });
    }

    // 3. Remboursement si nécessaire
    if (transaction.type === 'retrait' || transaction.type === 'transfert') {
      const montantARembourser = transaction.montant + transaction.frais;

      await promisePool.query(
        'UPDATE Compte SET solde = solde + ? WHERE id = ?',
        [montantARembourser, transaction.compte_id]
      );
    }

    // 4. Mettre à jour le statut de la transaction
    await promisePool.query(
      `UPDATE Transactions 
       SET statut = 'annuler', annule_par = ?, motif_annulation = ? 
       WHERE numero_transaction = ?`,
      [utilisateurId, motif, numeroTransaction]
    );

    res.json({ success: true, message: '✅ Transaction annulée avec succès' });
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
    const numeroTransaction = 'TXN' + Date.now(); // ou uuid().slice(0, 8).toUpperCase()


    try {
      await conn.query(
  `INSERT INTO Transactions (numero_transaction, type, montant, frais, compte_id, utilisateur_id, statut)
   VALUES (?, ?, ?, ?, ?, ?, ?)`,
  [numeroTransaction, type, montant, frais, destinataireId, distributeurUtilisateurId, 'en_attente']
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


router.get('/historique-distributeur', async (req, res) => {
  const utilisateurId = req.session?.userId;
console.log('📡 Session userId:', utilisateurId);
  if (!utilisateurId) {
    return res.status(401).json({ error: 'Utilisateur non connecté' });
  }

  try {
    const [rows] = await promisePool.query(
      `SELECT T.id, T.numero_transaction, T.date_transaction, T.type, T.montant, T.frais, T.statut,
              U.telephone AS client_telephone
       FROM Transactions T
       JOIN Utilisateurs U ON T.compte_id = (
         SELECT id FROM Compte WHERE utilisateur_id = U.id LIMIT 1
       )
       WHERE T.utilisateur_id = ? 
       ORDER BY T.date_transaction DESC`,
      [utilisateurId]
    );

    res.json({ success: true, historique: rows });
  } catch (err) {
    console.error('❌ Erreur historique distributeur :', err);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});


module.exports = router;

