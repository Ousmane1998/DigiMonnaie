const express = require('express');
const router = express.Router();
const { promisePool } = require('../config/db'); // ✅ utilisation du pool en promesse

// POST /api/client/transfert
router.post('/transfert', async (req, res) => {
  const { destinataire, montant, frais } = req.body;
  const utilisateurId = req.session?.userId;

  if (!utilisateurId) {
    return res.status(401).json({ error: 'Utilisateur non connecté' });
  }

  try {
    // 1. Récupérer le compte du client connecté
    const [clientCompte] = await promisePool.query(
      'SELECT * FROM Compte WHERE utilisateur_id = ? AND type = "client"',
      [utilisateurId]
    );
    if (!clientCompte.length) {
      return res.status(404).json({ error: 'Compte client introuvable' });
    }

    const compteClient = clientCompte[0];
    const total = parseFloat(montant) + parseFloat(frais);

    // 2. Vérifier solde suffisant
    if (compteClient.solde < total) {
      return res.status(400).json({ error: 'Solde insuffisant' });
    }

    // 3. Récupérer le compte destinataire
    const [destinataireCompte] = await promisePool.query(
      `SELECT * FROM Compte 
       WHERE numeroCompte = ? 
       OR utilisateur_id IN (SELECT id FROM Utilisateurs WHERE telephone = ?)`,
      [destinataire, destinataire]
    );
    if (!destinataireCompte.length) {
      return res.status(404).json({ error: 'Destinataire introuvable' });
    }

    const compteDestinataire = destinataireCompte[0];

    // 4. Enregistrer la transaction
    await promisePool.query(
      `INSERT INTO Transactions (type, montant, frais, compte_id, utilisateur_id, statut)
       VALUES (?, ?, ?, ?, ?, ?)`,
      ['transfert', montant, frais, compteDestinataire.id, utilisateurId, 'valide']
    );

    // 5. Mettre à jour les soldes
    await promisePool.query(
      'UPDATE Compte SET solde = solde - ? WHERE id = ?',
      [total, compteClient.id]
    );

    await promisePool.query(
      'UPDATE Compte SET solde = solde + ? WHERE id = ?',
      [montant, compteDestinataire.id]
    );
// 6. Récupérer l’ID de la transaction
const [txRows] = await promisePool.query(
  'SELECT id FROM Transactions WHERE compte_id = ? AND utilisateur_id = ? ORDER BY id DESC LIMIT 1',
  [compteDestinataire.id, utilisateurId]
);
const transactionId = txRows[0].id;

// 7. Récupérer le solde actuel du client
const [soldeRows] = await promisePool.query(
  'SELECT solde FROM Compte WHERE id = ?',
  [compteClient.id]
);
const soldeApres = soldeRows[0].solde;
const soldeAvant = soldeApres + total;

// 8. Insérer dans Historique
await promisePool.query(
  `INSERT INTO Historique (montant, solde_avant, solde_apres, compteID, utilisateurID, transactionID)
   VALUES (?, ?, ?, ?, ?, ?)`,
  [montant, soldeAvant, soldeApres, compteClient.id, utilisateurId, transactionId]
);

    res.json({ success: true, message: 'Transfert effectué avec succès' });
  } catch (err) {
    console.error('❌ Erreur transfert :', err);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

module.exports = router;
