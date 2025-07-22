const { getUsuarioPorPin } = require('../models/auth.model');
const jwt = require('jsonwebtoken');

const SECRET_KEY = 'unSuperSecretoMuyMuyLargo1234567890'; // Mejor en .env

async function loginUser(req, res) {
  const { pin } = req.body;
  const usuario = await getUsuarioPorPin(pin);
  console.log(usuario, pin);

  if (!usuario) {
    return res.status(401).json({ ok: false, message: 'PIN incorrecto' });
  }

  const token = jwt.sign({
    id: usuario.idUsuario,
    nombre: usuario.nombre,
    rol: usuario.rol
  }, SECRET_KEY, { expiresIn: '1h' });

  res.cookie('token', token, {
    httpOnly: true,
    secure: false, // Cambiar a true en producción con HTTPS
    sameSite: 'lax',
    maxAge: 3600000
  });

  res.json({ ok: true, datos: usuario });
}

function checkAuth(req, res) {
  const token = req.cookies.token;
  if (!token) {
    return res.status(401).json({ ok: false, message: 'No autenticado' });
  }
  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    res.json({ ok: true, datos: decoded });
  } catch (error) {
    res.status(401).json({ ok: false, message: 'Token inválido o expirado' });
  }
}

function logoutUser(req, res) {
  res.clearCookie('token', {
    httpOnly: true,
    secure: false, // Cambiar a true en producción con HTTPS
    sameSite: 'lax',
  });
  res.json({ ok: true, message: 'Sesión cerrada correctamente' });
}

module.exports = { loginUser, checkAuth, logoutUser };