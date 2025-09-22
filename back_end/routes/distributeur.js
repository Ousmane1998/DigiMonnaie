const express = require('express');
const router = express.Router();
const { promisePool } = require('../config/db'); // adapte selon ton fichier

router.get('/dashboard/:id', async (req, res) => {
  const distributeurId = req.params.id;

  try {
    // 🔹 Total du solde du distributeur (si plusieurs comptes liés)
    const [soldeResult] = await promisePool.query(
      `SELECT SUM(solde) AS soldeTotal 
       FROM Compte 
       WHERE utilisateur_id = ?`,
      [distributeurId]
    );

    // 🔹 Commission du jour
    const [commissionResult] = await promisePool.query(
      `SELECT SUM(frais) AS commissionDuJour 
       FROM Transactions 
       WHERE utilisateur_id = ? AND DATE(date_transaction) = CURDATE()`,
      [distributeurId]
    );

    // 🔹 Nombre de transactions aujourd’hui
    const [transactionsResult] = await promisePool.query(
      `SELECT COUNT(*) AS transactionsDuJour 
       FROM Transactions 
       WHERE utilisateur_id = ? AND DATE(date_transaction) = CURDATE()`,
      [distributeurId]
    );

    res.json({
      solde: soldeResult[0]?.soldeTotal ?? 0,
      commissionDuJour: commissionResult[0]?.commissionDuJour ?? 0,
      transactionsDuJour: transactionsResult[0]?.transactionsDuJour ?? 0
    });
  } catch (err) {
    console.error('❌ Erreur dashboard distributeur :', err);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});


module.exports = router;
