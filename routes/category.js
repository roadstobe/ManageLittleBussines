const Router = require('express');
const passport = require('passport');

const controller = require('../controllers/category');

const router = Router();

router.get('/', passport.authenticate('jwt', {session: false}), controller.getAll);
router.get('/:id', controller.getById);
router.delete('/:id', controller.remove);
router.post('/', controller.create);
router.patch('/:id', controller.update);


module.exports = router;
