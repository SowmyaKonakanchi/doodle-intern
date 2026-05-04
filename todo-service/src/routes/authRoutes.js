const express = require('express');
const AuthController = require('../controllers/AuthController');
const AuthMiddleware = require('../middlewares/authMiddleware');
const validate = require('../middlewares/validate');

const router = express.Router();

router.post('/signup', validate('signup'), AuthController.signup);
router.post('/login', validate('login'), AuthController.login);
router.post('/forgot-password', validate('forgotPassword'), AuthController.forgotPassword);
router.put('/update-details', AuthMiddleware.verifyToken, validate('updateDetails'), AuthController.updateDetails);
router.put('/update-password', AuthMiddleware.verifyToken, validate('updatePassword'), AuthController.updatePassword);

module.exports = router;
