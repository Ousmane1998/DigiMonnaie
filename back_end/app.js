const db = require('./config/db'); // Connexion à MySQL

const express = require('express');
const cors = require('cors');
const app = express();
const agentRoutes = require('./routes/agent');
const compteRoutes = require('./routes/compte');
const activateRoutes = require('./routes/activate');
const transactionRoutes = require('./routes/transaction');
const clientRoutes = require('./routes/client');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const MemoryStore = require('memorystore')(session); 
const compteRoutesAgent = require('./routes/comptes');
const utilisateurRoutes = require('./routes/utilisateur');
const distributeurRoutes = require('./routes/distributeur');

app.use(cors(
  {
  origin: 'http://localhost:4200', 
  credentials: true                
}
));
app.use(cookieParser());
app.use(express.json());
app.use(session({
  secret: 'miniBankSecret',
  resave: false,
  saveUninitialized: false,
  store: new MemoryStore({
    checkPeriod: 86400000 // 24h
  }),
  cookie: {
    secure: false, // ✅ false en local
    httpOnly: true
  }
}));
// Routes API
app.use('/api/agent', agentRoutes);
app.use('/api', compteRoutes);
app.use('/api', activateRoutes);
app.use('/api/transaction', transactionRoutes);
app.use('/api/client', clientRoutes); 
app.use('/api/comptes', compteRoutesAgent);
app.use('/api/utilisateur', utilisateurRoutes);
app.use('/api/distributeur', distributeurRoutes);

app.get('/', (req, res) => {
  res.send('DigiMonnaie API fonctionne !');
 
});

app.listen(3000, () => {
  console.log('Serveur lancé sur le port 3000');
});
