const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const auth = require('../middlewares/auth.middleware')
const validate = require('../middlewares/validate.middleware')
const { LoginDto, UserUpdateDto, AdminUserUpdateDto } = require('../dtos/user.dto');

router.put('/:id', auth("ADMIN"), validate(AdminUserUpdateDto), userController.updateUser)
router.put('/', auth("BASIC"), validate(UserUpdateDto), userController.updateLoggedUser)
router.post('/login', validate(LoginDto), userController.login)

module.exports = router;