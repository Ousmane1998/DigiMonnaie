// db.js
const mongoose = require('mongoose');

mongoose.connect('mongodb://127.0.0.1:27017/digimonnaie', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('✅ Connecté à la base MongoDB : digimonnaie'))
.catch(err => console.error('❌ Erreur de connexion à MongoDB :', err));

module.exports = mongoose;
