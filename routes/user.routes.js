const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const auth = require('../middlewares/auth.middleware')
const validate = require('../middlewares/validate.middleware')
const { LoginDto, UserUpdateDto, AdminUserUpdateDto } = require('../dtos/user.dto');

/**
 * @swagger
 * /users/{id}:
 *   put:
 *     summary: Update user
 *     description: Updates user with specified id
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               firstName:
 *                 type: string
 *                 description: First name
 *               lastName:
 *                 type: string
 *                 description: Last name
 *               username:
 *                 type: string
 *                 description: Username
 *               email:
 *                 type: string
 *                 description: Email
 *               password:
 *                 type: string
 *                 description: Password
 *               role:
 *                 type: string
 *                 description: Role
 *                 enum: [BASIC, ADMIN]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the user
 *     responses:
 *       200:
 *         description: Updated user
 *       403:
 *         description: Unauthorized
 */
router.put('/:id', auth("ADMIN"), validate(AdminUserUpdateDto), userController.updateUser)

/**
 * @swagger
 * /users:
 *   put:
 *     summary: Update logged user
 *     description: Updates logged user
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               firstName:
 *                 type: string
 *                 description: First name
 *               lastName:
 *                 type: string
 *                 description: Last name
 *               username:
 *                 type: string
 *                 description: Username
 *               email:
 *                 type: string
 *                 description: Email
 *               password:
 *                 type: string
 *                 description: Password
 *     responses:
 *       200:
 *         description: Updated user
 *       403:
 *         description: Unauthorized
 */
router.put('/', auth("BASIC", "ADMIN"), validate(UserUpdateDto), userController.updateLoggedUser)

/**
 * @swagger
 * /users/login:
 *   post:
 *     summary: Login user
 *     description: Login user with credentials
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 description: Username
 *               password:
 *                 type: string
 *                 description: Password
 *     responses:
 *       200:
 *         description: Successfully logged in
 *       400:
 *         description: Bad credentials
 */
router.post('/login', validate(LoginDto), userController.login)

module.exports = router;