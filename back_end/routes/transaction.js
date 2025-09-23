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


// ✅ Vérification du délai d’annulation
const dateTx = new Date(transaction.date_transaction);
const maintenant = new Date();
const diffMinutes = (maintenant - dateTx) / (1000 * 60);

if (diffMinutes > 30) {
  return res.status(403).json({ error: '⏱️ Délai d’annulation dépassé (30 minutes max)' });
}

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

    
await promisePool.query(
  `INSERT INTO Historique (montant, solde_avant, solde_apres, compteID, utilisateurID, transactionID)
   VALUES (?, ?, ?, ?, ?, ?)`,
  [
    transaction.montant,
    null, // ou calculer soldeAvant si tu veux
    null, // ou récupérer soldeApres si tu veux
    transaction.compte_id,
    utilisateurId,
    transaction.id
  ]
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
    // 🔍 Vérifier que le distributeur a assez de solde
const montantTotal = type === 'retrait' ? montant + frais : montant;

const [soldeDistRows] = await promisePool.query(
  'SELECT solde FROM Compte WHERE id = ?',
  [distributeurCompteId]
);
const soldeDistributeur = soldeDistRows[0].solde;

if (soldeDistributeur < montantTotal) {
  return res.status(400).json({
    error: `❌ Solde distributeur insuffisant. Il faut au moins ${montantTotal} XOF pour cette opération.`
  });
}


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
  [numeroTransaction, type, montant, frais, destinataireId, distributeurUtilisateurId, 'valide']
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

// 1. Récupérer l’ID de la transaction
const [txRows] = await conn.query(
  'SELECT id FROM Transactions WHERE numero_transaction = ?',
  [numeroTransaction]
);
const transactionId = txRows[0].id;

// 2. Récupérer le solde actuel du compte destinataire
const [soldeRows] = await conn.query(
  'SELECT solde FROM Compte WHERE id = ?',
  [destinataireId]
);
const soldeApres = soldeRows[0].solde;

// 3. Calculer le solde avant
const soldeAvant = type === 'depot'
  ? soldeApres - montant
  : soldeApres + montant + frais;

// 4. Insérer dans Historique
await conn.query(
  `INSERT INTO Historique (montant, solde_avant, solde_apres, compteID, utilisateurID, transactionID)
   VALUES (?, ?, ?, ?, ?, ?)`,
  [montant, soldeAvant, soldeApres, destinataireId, distributeurUtilisateurId, transactionId]
);


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

router.get('/historique-client', async (req, res) => {
  const utilisateurId = req.session?.userId;
  console.log('📡 Session client ID:', utilisateurId);

  if (!utilisateurId) {
    return res.status(401).json({ error: 'Utilisateur non connecté' });
  }
const [compteRows] = await promisePool.query(
  'SELECT numeroCompte FROM Compte WHERE utilisateur_id = ? AND type = "client"',
  [utilisateurId]
);

if (!compteRows.length) {
  return res.status(404).json({ error: 'Compte client introuvable' });
}

const numeroCompte = compteRows[0].numeroCompte;
  try {
    const [rows] = await promisePool.query(
     `SELECT H.id, H.dateHeure AS dateTransaction, H.montant, T.type, T.numero_transaction
   FROM Historique H
   JOIN Transactions T ON H.transactionID = T.id
   JOIN Compte C ON H.compteID = C.id
   WHERE C.numeroCompte = ?
   ORDER BY H.dateHeure DESC`,
  [numeroCompte]
    );

    res.json({ success: true, transactions: rows });
  } catch (err) {
    console.error('❌ Erreur historique client :', err);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

module.exports = router;

