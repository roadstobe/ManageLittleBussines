const Router = require('express');
//my imports
const controller = require('../controllers/auth');

const router = Router();

//localhost:5000/api/auth/**
router.post('/login', controller.login);
router.post('/register', controller.register);

module.exports = router;
