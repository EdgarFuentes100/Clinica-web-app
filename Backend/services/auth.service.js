const { getUsuarioPorPin } = require('../models/auth.model');

async function loginConPin(pin) {
    if (!pin) throw new Error('PIN requerido');
    const usuario = await getUsuarioPorPin(pin);
    if (!usuario) throw new Error('PIN incorrecto');
    // cualquier otra lógica (ej: registro de login, verificación extra, etc.)
    return usuario;
}

module.exports = { loginConPin };
