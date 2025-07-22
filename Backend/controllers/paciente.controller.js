const Pacientes = require('../models/pacientes.model');

async function listar(req, res, next) {
  try {
    const datos = await Pacientes.getPacientes();
    res.json({
      ok: true,
      message: 'Lista de pacientes obtenida',
      datos   // Usar siempre "datos"
    });
  } catch (err) { next(err); }
}

async function obtener(req, res, next) {
  try {
    const paciente = await Pacientes.getPacienteById(req.params.id);
    if (!paciente) {
      return res.status(404).json({
        ok: false,
        message: 'Paciente no encontrado',
        datos: null
      });
    }
    res.json({
      ok: true,
      message: 'Paciente encontrado',
      datos: paciente
    });
  } catch (err) { next(err); }
}

async function crear(req, res, next) {
  try {
    if (!req.body || Object.keys(req.body).length === 0) {
      return res.status(400).json({
        ok: false,
        message: 'No se recibieron datos para crear paciente',
        datos: null
      });
    }

    const nuevo = await Pacientes.crearPaciente(req.body);
    res.status(201).json({
      ok: true,
      message: 'Paciente creado correctamente',
      datos: nuevo
    });
  } catch (err) { next(err); }
}

async function actualizar(req, res, next) {
  try {
    const actualizado = await Pacientes.actualizarPaciente(req.params.id, req.body);
    res.json({
      ok: true,
      message: 'Paciente actualizado correctamente',
      datos: actualizado
    });
  } catch (err) { next(err); }
}

async function eliminar(req, res, next) {
  try {
    await Pacientes.eliminarPaciente(req.params.id);
    res.json({
      ok: true,
      message: 'Paciente eliminado correctamente',
      datos: null
    });
  } catch (err) { next(err); }
}

module.exports = {
  listar,
  obtener,
  crear,
  actualizar,
  eliminar
};
