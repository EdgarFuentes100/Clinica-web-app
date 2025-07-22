// models/pacientes.js
const { localDB } = require('../config/db');
const { appendPending } = require('../services/query.service');

// Obtener todos los pacientes (desde BD local)
async function getPacientes() {
  const [rows] = await localDB.query('SELECT * FROM pacientes');
  return rows;
}

// Obtener un paciente por ID (desde BD local)
async function getPacienteById(id) {
  const [rows] = await localDB.query('SELECT * FROM pacientes WHERE idPaciente = ?', [id]);
  return rows[0] || null;
}

// Crear paciente
async function crearPaciente(data) {
  if (!data) {
    throw new Error('No se recibieron datos para crear paciente');
  }
  const { nombre, apellido, fechaNacimiento } = data;
  console.log(nombre, apellido);

  const sql = 'INSERT INTO pacientes (nombre, apellido, fechaNacimiento) VALUES (?, ?, ?)';
  const params = [nombre, apellido, fechaNacimiento];

  const [result] = await localDB.query(sql, params);

  appendPending(sql, params);

  return { id: result.insertId, ...data };
}

// Actualizar paciente
async function actualizarPaciente(id, data) {
  const { nombre, apellido, fechaNacimiento } = data;
  const sql = 'UPDATE pacientes SET nombre=?, apellido=?, fechaNacimiento=? WHERE idPaciente=?';
  const params = [nombre, apellido, fechaNacimiento, id];

  await localDB.query(sql, params);

  appendPending(sql, params);

  return getPacienteById(id);
}

// Eliminar paciente
async function eliminarPaciente(id) {
  const sql = 'DELETE FROM pacientes WHERE idPaciente=?';
  const params = [id];

  await localDB.query(sql, params);

  appendPending(sql, params);

  return true;
}

module.exports = {
  getPacientes,
  getPacienteById,
  crearPaciente,
  actualizarPaciente,
  eliminarPaciente
};
