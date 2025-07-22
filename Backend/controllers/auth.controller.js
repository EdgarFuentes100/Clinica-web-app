const { loginConPin } = require('../services/auth.service');
const jwt = require('jsonwebtoken');

const SECRET_KEY = process.env.SECRET_KEY || 'unSuperSecretoMuyMuyLargo1234567890';

async function loginUser(req, res) {
  try {
    const { pin } = req.body;
    const usuario = await loginConPin(pin);

    // Crear token JWT con datos mínimos
    const token = jwt.sign({
      id: usuario.idUsuario,
      nombre: usuario.nombre,
      rol: usuario.rol
    }, SECRET_KEY, { expiresIn: '1h' });

    // Enviar token en cookie httpOnly
    res.cookie('token', token, {
      httpOnly: true,
      maxAge: 3600000, // 1 hora
      sameSite: 'lax',  // protege contra CSRF
      secure: false     // true en producción con HTTPS
    });

    res.json({ ok: true, datos: usuario });
  } catch (error) {
    res.status(401).json({ ok: false, message: error.message });
  }
}

function checkAuth(req, res) {
  try {
    const token = req.cookies.token;
    if (!token) throw new Error('No autenticado');

    const decoded = jwt.verify(token, SECRET_KEY);
    res.json({ ok: true, datos: decoded });
  } catch (error) {
    res.status(401).json({ ok: false, message: error.message || 'Token inválido o expirado' });
  }
}

function logoutUser(req, res) {
  // Limpiar cookie para cerrar sesión
  res.clearCookie('token', { httpOnly: true, sameSite: 'lax' });
  res.json({ ok: true, message: 'Sesión cerrada correctamente' });
}

module.exports = { loginUser, checkAuth, logoutUser };
