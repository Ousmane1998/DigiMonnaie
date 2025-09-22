const express = require('express');
const router = express.Router();
const db = require('../config/db');
const nodemailer = require('nodemailer');

const multer = require('multer');
const upload = multer();
function generateNumeroCompte() {
  const prefix = 'DIGI';
  const timestamp = Date.now().toString().slice(-6);
  const random = Math.floor(100 + Math.random() * 900);
  return `${prefix}${timestamp}${random}`;
}

router.post('/creer-compte',upload.single('photo'), async (req, res) => {
  const {
    nom, prenom, date_naissance, carte_identite,
    telephone, adresse, email, role
  } = req.body;

  const numeroCompte = generateNumeroCompte();

  try {
    // 1. Créer utilisateur
    const [result] = await db.promise().query(`
      INSERT INTO Utilisateurs (prenom, nom, adresse, email, telephone, date_naissance, carte_identite, role)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [prenom, nom, adresse, email, telephone, date_naissance, carte_identite, role]
    );

    const utilisateurId = result.insertId;

    // 2. Créer compte
   await db.promise().query(`
  INSERT INTO Compte (numeroCompte, solde, etat, type, utilisateur_id)
  VALUES (?, ?, ?, ?, ?)`,
  [numeroCompte, 0, 'active', role, utilisateurId]
);

    // 3. Insérer dans Client ou Distributeur
    if (role === 'client') {
      await db.promise().query(`INSERT INTO Client (id) VALUES (?)`, [utilisateurId]);
    } else if (role === 'distributeur') {
      await db.promise().query(`INSERT INTO Distributeur (id) VALUES (?)`, [utilisateurId]);
    }

    // 4. Envoyer email
    const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: "dndeyekoria@gmail.com",     // ✅ ton identifiant Mailtrap
    pass: "ipyn bjfn wvdz acxy"      // ✅ ton mot de passe Mailtrap
  }
});


    const mailOptions = {
 from: '"DigiMonnaie" <no-reply@digimonnaie.com>',
  to: email, // ✅ adresse saisie par l’utilisateur
  subject: 'Activation de votre compte Digimonnaie',
  html: `
    <h2>Bienvenue sur DigiMonnaie</h2>
    <p>Bonjour ${prenom},</p>
    <p>Votre numéro de compte est : <strong>${numeroCompte}</strong></p>
    <p>Veuillez cliquer sur le lien ci-dessous pour créer votre mot de passe :</p>
    <a href="http://localhost:4200/activation/${numeroCompte}" style="padding:10px 20px; background:#007bff; color:#fff; text-decoration:none; border-radius:5px;">Créer mon mot de passe</a>
  `
};

await transporter.sendMail(mailOptions);

  

    res.status(200).json({ message: 'Compte créé et email envoyé' });
  } catch (err) {
  console.error('❌ Erreur serveur :', err);
  res.status(500).json({ error: 'Erreur serveur', details: err.message });
}
});

module.exports = router;
