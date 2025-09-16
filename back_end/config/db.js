const mysql = require('mysql2');

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '', 
  database: 'digimonnaie' 
});

connection.connect((err) => {
  if (err) throw err;
  console.log('✅ Connecté à la base MySQL : digimonnaie');
});

module.exports = connection;
