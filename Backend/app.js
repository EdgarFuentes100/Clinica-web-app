require('dotenv').config();           // carga .env al inicio
const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(express.json());

// Rutas
const pacientesRoutes = require('./routes/pacientes.routes');
app.use('/api/v1/pacientes', pacientesRoutes);

// Middleware de error simple
app.use((err, req, res, next) => {
  console.error(err);
  return res.status(500).json({ error: 'Error interno del servidor' });
});

app.listen(PORT, () => {
  console.log(`API Hospital escuchando en http://localhost:${PORT}/api/v1`);
});
