const db = require('./config/db'); // Connexion à MySQL

const express = require('express');
const cors = require('cors');
const app = express();
const agentRoutes = require('./routes/agent');
const compteRoutes = require('./routes/compte');
const activateRoutes = require('./routes/activate');
const transactionRoutes = require('./routes/transaction');

app.use(cors());
app.use(express.json());
// Routes API
app.use('/api/agent', agentRoutes);
app.use('/api', compteRoutes);
app.use('/api', activateRoutes);
app.use('/api/transaction', transactionRoutes);
app.get('/', (req, res) => {
  res.send('DigiMonnaie API fonctionne !');
});

app.listen(3000, () => {
  console.log('Serveur lancé sur le port 3000');
});
