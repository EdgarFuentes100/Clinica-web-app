// models/usuarios.model.js
const { localDB } = require('../config/db');

async function getUsuarioPorPin(pin) {
  const [rows] = await localDB.query(
    `SELECT u.idUsuario, u.nombre, u.email, r.rol AS rol 
     FROM usuarios u
     JOIN roles r ON u.idRol = r.idRol
     WHERE u.pin_hash = SHA2(?, 256) AND u.activo = 1`,
    [pin]
  );
  return rows.length > 0 ? rows[0] : null;
}

module.exports = {
  getUsuarioPorPin,
};
