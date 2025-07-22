const express = require('express');
const router = express.Router();
const PacientesController = require('../controllers/ControllerPacientes.');

router.get('/', PacientesController.listar);
router.get('/:id', PacientesController.obtener);
router.post('/', PacientesController.crear);
router.put('/:id', PacientesController.actualizar);
router.delete('/:id', PacientesController.eliminar);

module.exports = router;
