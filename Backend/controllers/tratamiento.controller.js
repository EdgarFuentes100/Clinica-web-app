const Tratamiento = require('../models/tratamiento.model');

async function listar(req, res, next) {
  try {
    const datos = await Tratamiento.getTratamiento();
    res.json({
      ok: true,
      message: 'Lista obtenida',
      datos   // Usar siempre "datos"
    });
  } catch (err) { next(err); }
}

module.exports = {
  listar
};
