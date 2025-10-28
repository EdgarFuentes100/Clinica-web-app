const express = require('express');
const router = express.Router();
const TratamientoController = require('../controllers/tratamiento.controller');

router.get('/listar', TratamientoController.listar);

module.exports = router;
