const mysql = require('mysql2');

const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'digimonnaie',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Vérification de connexion
pool.getConnection((err, conn) => {
  if (err) throw err;
  console.log('✅ Connecté à la base MySQL : digimonnaie');
  conn.release();
});

module.exports = {
  pool,             // pool normal
  promisePool: pool.promise()  // pool en promesse
};
