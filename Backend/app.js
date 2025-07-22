const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');

const authRoutes = require('./routes/auth.routes');
const usuariosRoutes = require('./routes/usuarios.routes');

const app = express();

app.use(express.json());
app.use(cookieParser());

app.use(cors({
  origin: 'http://localhost:3000',  // Cambia si usas otra URL frontend
  credentials: true
}));

app.use('/api/v1/auth', authRoutes);

app.listen(4000, () => console.log('Servidor en puerto 4000'));
