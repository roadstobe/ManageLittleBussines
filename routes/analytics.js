const Router = require('express');

const controller = require('../controllers/analytics');

const router = Router();

router.get('/overview', controller.overview);
router.get('/analytics', controller.analytics);

module.exports = router;
