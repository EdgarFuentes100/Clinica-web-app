// services/querySyncService.js
const fs = require('fs');
const path = require('path');
const dns = require('dns');
const { remoteDB } = require('../config/db');

const LOG_FILE = path.join(__dirname, '../data/pending_queries.json');

// Crear archivo si no existe
if (!fs.existsSync(LOG_FILE)) {
  fs.writeFileSync(LOG_FILE, JSON.stringify([]));
}

function readQueue() {
  try {
    return JSON.parse(fs.readFileSync(LOG_FILE, 'utf8') || '[]');
  } catch (err) {
    console.error('Error leyendo log:', err);
    return [];
  }
}

function saveQueue(queue) {
  fs.writeFileSync(LOG_FILE, JSON.stringify(queue, null, 2), 'utf8');
}

function appendPending(sql, params = []) {
  const queue = readQueue();
  queue.push({ sql, params, ts: new Date().toISOString() });
  saveQueue(queue);
}

// Detectar conexión a Internet
function hasInternet() {
  return new Promise(resolve => {
    dns.lookup('google.com', err => resolve(!err));
  });
}

// Procesar TODA la cola
async function syncPendingToRemote() {
  let queue = readQueue();
  if (!queue.length) return;

  console.log(`Intentando sincronizar ${queue.length} consultas pendientes...`);

  const remaining = [];
  for (const entry of queue) {
    try {
      await remoteDB.query(entry.sql, entry.params);
      console.log('OK:', entry.sql);
    } catch (err) {
      console.error('Error ejecutando en remota:', err.message);
      remaining.push(entry); // Dejar pendientes las que fallan
    }
  }

  saveQueue(remaining);
}

// Proceso en segundo plano: cada X segundos verifica conexión
setInterval(async () => {
  const online = await hasInternet();
  if (online) {
    await syncPendingToRemote();
  } else {
    console.log('Sin Internet, esperando...');
  }
}, 150000); // Cada 15 segundos

module.exports = { appendPending };
