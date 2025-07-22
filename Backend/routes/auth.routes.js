const express = require('express');
const router = express.Router();
const { loginUser, checkAuth, logoutUser } = require('../controllers/auth.controller');

router.post('/login', loginUser);
router.get('/check', checkAuth);
router.post('/logout', logoutUser);

module.exports = router;
