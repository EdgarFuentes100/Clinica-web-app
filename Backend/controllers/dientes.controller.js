const Dientes = require('../models/dientes.model');

async function listar(req, res, next) {
  try {
    const datos = await Dientes.getDientes();
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
