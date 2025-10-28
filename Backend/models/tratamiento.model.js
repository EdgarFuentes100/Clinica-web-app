// models/pacientes.js
const { localDB } = require('../config/db');
const { appendPending } = require('../services/query.service');

// Obtener todos los pacientes (desde BD local)
async function getTratamiento() {
    const [rows] = await localDB.query('SELECT * FROM tratamiento');
    return rows;
}


module.exports = {
    getTratamiento
};
