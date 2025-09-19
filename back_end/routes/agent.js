const express = require('express');
const router = express.Router();
const db = require('../config/db');
const bcrypt = require('bcrypt');

//route login
router.post('/login', (req, res) => {
  const { email, motDePasse } = req.body;

  db.query('SELECT * FROM Utilisateurs WHERE email = ?', [email], (err, results) => {
    if (err) return res.status(500).send(err);
    if (results.length === 0) return res.status(401).send('Utilisateur non trouvé');

    const utilisateur = results[0];

    bcrypt.compare(motDePasse, utilisateur.mot_de_passe, (err, match) => {
      if (err) return res.status(500).send('Erreur de vérification du mot de passe');
      if (!match) return res.status(401).send('Mot de passe incorrect');

      res.json({
        success: true,
        utilisateur: {
          id: utilisateur.id,
          role: utilisateur.role,
          prenom: utilisateur.prenom,
          nom: utilisateur.nom
        }
      });
    });
  });
});
// Route tableau de bord agent
router.get('/dashboard/:agentId', async (req, res) => {
  const { agentId } = req.params;

  try {
    // Total clients gérés par l’agent
    const [clients] = await db.promise().query(
      `SELECT COUNT(*) AS totalClients 
       FROM Compte 
       WHERE utilisateur_id IN (
         SELECT id FROM Utilisateurs WHERE role = 'client'
       )`
    );

    // Total transactions aujourd’hui
    const [transactions] = await db.promise().query(
      `SELECT COUNT(*) AS totalTransactions 
       FROM Transaction 
       WHERE DATE(date_transaction) = CURDATE()`
    );

    // Total commissions de l’agent
    const [commissions] = await db.promise().query(
      `SELECT SUM(commission) AS totalCommissions 
       FROM Commission 
       WHERE agent_id = ?`,
      [agentId]
    );

    // Dernières transactions
    const [dernieresTransactions] = await db.promise().query(
      `SELECT t.heure, t.type, t.montant, u.prenom AS client, t.statut
       FROM Transaction t
       JOIN Utilisateurs u ON t.client_id = u.id
       ORDER BY t.date_transaction DESC
       LIMIT 10`
    );

    res.json({
      clients: clients[0].totalClients,
      transactions: transactions[0].totalTransactions,
      commissions: commissions[0].totalCommissions || 0,
      historiques: dernièresTransactions
    });
  } catch (err) {
    console.error('❌ Erreur dashboard agent :', err);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

//historique agent
router.get('/historique/:agentId', async (req, res) => {
  const { agentId } = req.params;

  try {
    const [transactions] = await db.promise().query(
      `SELECT 
         DATE_FORMAT(t.date_transaction, '%d/%m/%Y') AS dateType,
         t.type,
         e.prenom AS emetteur,
         b.prenom AS beneficiaire,
         t.montant,
         t.statut
       FROM Transaction t
       JOIN Utilisateurs e ON t.emetteur_id = e.id
       JOIN Utilisateurs b ON t.beneficiaire_id = b.id
       WHERE t.agent_id = ?
       ORDER BY t.date_transaction DESC`,
      [agentId]
    );

    res.json({ historiques: transactions });
  } catch (err) {
    console.error('❌ Erreur historique agent :', err);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});



module.exports = router;
