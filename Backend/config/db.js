require('dotenv').config();
const mysql = require('mysql2/promise');

// Pool BD LOCAL
const localDB = mysql.createPool({
  host: process.env.DB_LOCAL_HOST,
  port: process.env.DB_LOCAL_PORT,
  user: process.env.DB_LOCAL_USER,
  password: process.env.DB_LOCAL_PASSWORD,
  database: process.env.DB_LOCAL_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Pool BD REMOTA
const remoteDB = mysql.createPool({
  host: process.env.DB_REMOTE_HOST,
  port: process.env.DB_REMOTE_PORT,
  user: process.env.DB_REMOTE_USER,
  password: process.env.DB_REMOTE_PASSWORD,
  database: process.env.DB_REMOTE_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

module.exports = { localDB, remoteDB };
