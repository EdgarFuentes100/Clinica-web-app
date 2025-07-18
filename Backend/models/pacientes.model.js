const pool = require('../config/db');

// Obtener todos los pacientes
async function getPacientes() {
  const [rows] = await pool.query('SELECT * FROM pacientes');
  return rows;
}

// Obtener un paciente por ID
async function getPacienteById(id) {
  const [rows] = await pool.query('SELECT * FROM pacientes WHERE idPaciente = ?', [id]);
  return rows[0] || null;
}

// Crear paciente
async function crearPaciente(data) {
  const { nombre, apellido, fechaNacimiento } = data;
  const [result] = await pool.query(
    'INSERT INTO pacientes (nombre, apellido, fechaNacimiento) VALUES (?, ?, ?)',
    [nombre, apellido, fechaNacimiento]
  );
  return { id: result.insertId, ...data };
}

// Actualizar paciente
async function actualizarPaciente(id, data) {
  const { nombre, apellido, fechaNacimiento } = data;
  await pool.query(
    'UPDATE pacientes SET nombre=?, apellido=?, fechaNacimiento=? WHERE idPaciente=?',
    [nombre, apellido, fechaNacimiento, id]
  );
  return getPacienteById(id);
}

// Eliminar paciente
async function eliminarPaciente(id) {
  await pool.query('DELETE FROM pacientes WHERE idPaciente=?', [id]);
  return true;
}

module.exports = {
  getPacientes,
  getPacienteById,
  crearPaciente,
  actualizarPaciente,
  eliminarPaciente
};
