// models/pacientes.js
const { localDB } = require('../config/db');
const { appendPending } = require('../services/query.service');

// Obtener todos los pacientes (desde BD local)
async function getDientes() {
    const [rows] = await localDB.query('SELECT * FROM diente');
    return rows;
}


module.exports = {
    getDientes
};
