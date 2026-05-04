const express = require('express');
const TodoController = require('../controllers/TodoController');
const AuthMiddleware = require('../middlewares/authMiddleware');
const validate = require('../middlewares/validate');

const router = express.Router();

router.use(AuthMiddleware.verifyToken);

router.post('/', validate('createTodo'), TodoController.create);
router.get('/completed', TodoController.getCompleted);
router.get('/summary', TodoController.getSummary);
router.get('/active', validate('pagination', 'query'), TodoController.getActive);
router.get('/expired', TodoController.getExpired);
router.get('/trash', TodoController.getTrash);
router.get('/', TodoController.getAll);
router.patch('/:id/trash', validate('idParam', 'params'), TodoController.moveToTrash);
router.patch('/:id/restore', validate('idParam', 'params'), TodoController.restoreFromTrash);
router.patch('/:id/status', validate('idParam', 'params'), validate('updateStatus'), TodoController.updateStatus);
router.put('/:id', validate('idParam', 'params'), validate('updateTodo'), TodoController.update);
router.delete('/:id', validate('idParam', 'params'), TodoController.delete);

module.exports = router;
