const db = require('./config/db'); // Connexion à MySQL

const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('DigiMonnaie API fonctionne !');
});

app.listen(3000, () => {
  console.log('Serveur lancé sur le port 3000');
});
