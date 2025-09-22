const express = require('express');
const router = express.Router();
const { pool, promisePool } = require('../config/db');

const bcrypt = require('bcrypt');

//route login
router.post('/login', (req, res) => {
  const { email, motDePasse } = req.body;


  pool.query('SELECT * FROM Utilisateurs WHERE email = ?', [email], (err, results) => {
    if (err) return res.status(500).send(err);
    if (results.length === 0) return res.status(401).send('Utilisateur non trouvé');

    const utilisateur = results[0];
    
    bcrypt.compare(motDePasse, utilisateur.mot_de_passe, (err, match) => {
      if (err) return res.status(500).send('Erreur de vérification du mot de passe');
      if (!match) return res.status(401).send('Mot de passe incorrect');
      req.session.userId = utilisateur.id;
      req.session.role = utilisateur.role;
      console.log('✅ Session créée :', req.session);
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
    const [clients] = await promisePool.query(
      `SELECT COUNT(*) AS totalClients 
       FROM Compte 
       WHERE utilisateur_id IN (
         SELECT id FROM Utilisateurs WHERE role = 'client'
       )`
    );

    // Total transactions aujourd’hui
    const [transactions] = await promisePool.query(
      `SELECT COUNT(*) AS totalTransactions 
       FROM Transactions
       WHERE DATE(date_transaction) = CURDATE()`
    );

   

    // Dernières transactions
    const [dernieresTransactions] = await promisePool.query(
      `SELECT t.date_transaction, t.type, t.montant, u.prenom AS client, t.statut
       FROM Transactions t
       JOIN Utilisateurs u ON t.utilisateur_id = u.id
       ORDER BY t.date_transaction DESC
       LIMIT 10`
    );

    res.json({
      clients: clients[0].totalClients,
      transactions: transactions[0]?.totalTransactions ?? 0,
    
      historiques: dernieresTransactions
    });
  } catch (err) {
    console.error('❌ Erreur dashboard agent :', err);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// Route historique des transactions de l’agent

router.get('/historique-agent', async (req, res) => {
  const agentId = req.session?.userId;
  console.log('📡 Session userId:', agentId);

  if (!agentId) {
    return res.status(401).json({ error: 'Agent non connecté' });
  }

  try {
    const [rows] = await promisePool.query(
  `SELECT t.id, t.date_transaction, t.type, t.montant, t.frais, t.statut,
          t.numero_transaction, t.motif_annulation, t.annule_par,
          u.nom AS utilisateur, u.role AS role_utilisateur,
          c.numeroCompte AS compte
   FROM Transactions t
   JOIN Utilisateurs u ON t.utilisateur_id = u.id
   JOIN Compte c ON t.compte_id = c.id
   ORDER BY t.date_transaction DESC`
);


    console.log('📦 Transactions envoyées :', rows);
    res.json({ success: true, transactions: rows });
  } catch (err) {
    console.error('❌ Erreur historique agent :', err.message);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

//route pour total commission d'un agent
router.get('/total-commissions', async (req, res) => {
  try {
    const [rows] = await promisePool.query(
      `SELECT SUM(commission) AS totalCommissions FROM Distributeur`
    );

    res.json({ totalCommissions: rows[0]?.totalCommissions ?? 0 });
  } catch (err) {
    console.error('❌ Erreur total commissions :', err);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});





module.exports = router;
