const express = require('express');
const router = express.Router();
const DientesController = require('../controllers/dientes.controller');

router.get('/listar', DientesController.listar);

module.exports = router;
