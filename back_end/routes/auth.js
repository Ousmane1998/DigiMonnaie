const express = require('express');
const router = express.Router();
const { promisePool } = require('../config/db');
const crypto = require('crypto');
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');

// 📧 Configuration Gmail (mot de passe d'application recommandé)
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'papeousmanefaye011@gmail.com',
    pass: 'scke jztp wufa ybli' // ⚠️ utilise process.env en production
  }
});


// 🔹 Route : mot de passe oublié → envoi du lien
router.post('/mot-de-passe-oublie', async (req, res) => {
  const { email } = req.body;

  try {
    const [rows] = await promisePool.query(
      `SELECT id FROM Utilisateurs WHERE email = ?`,
      [email]
    );

    console.log('📥 Requête reçue pour mot de passe oublié');

    if (rows.length === 0) {
      return res.status(404).json({ error: 'Email introuvable' });
    }

    const utilisateurId = rows[0].id;
    const token = crypto.randomBytes(32).toString('hex');
    const expiration = new Date(Date.now() + 3600 * 1000); // expire dans 1h
    const lien = `http://localhost:4200/reinitialiser-mot-de-passe?token=${token}`;

    await promisePool.query(
      `INSERT INTO ResetTokens (utilisateur_id, token, expiration) VALUES (?, ?, ?)`,
      [utilisateurId, token, expiration]
    );

    await transporter.sendMail({
      from: 'MiniBank <no-reply@minibank.com>',
      to: email,
      subject: 'Réinitialisation du mot de passe',
      html: `
        <p>Bonjour,</p>
        <p>Voici votre lien pour réinitialiser votre mot de passe :</p>
        <a href="${lien}">${lien}</a>
        <p>Ce lien expire dans 1 heure.</p>
      `
    });

    console.log(`🔗 Lien de réinitialisation : ${lien}`);
    res.json({ message: 'Lien de réinitialisation généré', lien });
  } catch (err) {
    console.error('❌ Erreur mot de passe oublié :', err);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});


// 🔹 Route : réinitialisation du mot de passe via token
router.post('/reinitialiser-mot-de-passe', async (req, res) => {
  const { token, nouveauMotDePasse } = req.body;

  try {
    const [rows] = await promisePool.query(
      `SELECT utilisateur_id FROM ResetTokens WHERE token = ? AND expiration > NOW()`,
      [token]
    );

    if (rows.length === 0) {
      return res.status(400).json({ error: 'Token invalide ou expiré' });
    }

    const utilisateurId = rows[0].utilisateur_id;
    const hash = await bcrypt.hash(nouveauMotDePasse, 10);

    await promisePool.query(
      `UPDATE Utilisateurs SET mot_de_passe = ? WHERE id = ?`,
      [hash, utilisateurId]
    );

    await promisePool.query(
      `DELETE FROM ResetTokens WHERE token = ?`,
      [token]
    );

    res.json({ message: 'Mot de passe réinitialisé avec succès' });
  } catch (err) {
    console.error('❌ Erreur réinitialisation mot de passe :', err);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

module.exports = router;
