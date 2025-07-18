const Pacientes = require('../models/pacientes.model');

async function listar(req, res, next) {
  try {
    const data = await Pacientes.getPacientes();
    res.json(data);
  } catch (err) { next(err); }
}

async function obtener(req, res, next) {
  try {
    const paciente = await Pacientes.getPacienteById(req.params.id);
    if (!paciente) return res.status(404).json({ error: 'Paciente no encontrado' });
    res.json(paciente);
  } catch (err) { next(err); }
}

async function crear(req, res, next) {
  try {
    const nuevo = await Pacientes.crearPaciente(req.body);
    res.status(201).json(nuevo);
  } catch (err) { next(err); }
}

async function actualizar(req, res, next) {
  try {
    const actualizado = await Pacientes.actualizarPaciente(req.params.id, req.body);
    res.json(actualizado);
  } catch (err) { next(err); }
}

async function eliminar(req, res, next) {
  try {
    await Pacientes.eliminarPaciente(req.params.id);
    res.json({ mensaje: 'Paciente eliminado' });
  } catch (err) { next(err); }
}

module.exports = {
  listar,
  obtener,
  crear,
  actualizar,
  eliminar
};
