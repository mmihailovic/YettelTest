const express = require('express');
const router = express.Router();
const taskController = require('../controllers/task.controller');
const auth = require('../middlewares/auth.middleware')
const ownership = require('../middlewares/ownership.middleware')
const validate = require('../middlewares/validate.middleware')
const { TaskRequestDto } = require('../dtos/task.dto')
const { Task } = require('../models')

/**
 * @swagger
 * /tasks:
 *   get:
 *     summary: Get tasks for logged user
 *     description: Get tasks for logged user
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: query
 *         name: size
 *         required: false
 *         schema:
 *           type: integer
 *         description: Page size for pagination. Default is 5.
 * 
 *       - in: query
 *         name: page
 *         required: false
 *         schema:
 *           type: integer
 *         description: Page for pagination. Default is 1.
 * 
 *       - in: query
 *         name: order
 *         required: false
 *         schema:
 *           type: integer
 *           enum: [ASC, DESC]
 *         description: Order by creation date. Default is DESC.
 *      
 *     responses:
 *       200:
 *         description: All tasks for logged user
 *       403:
 *         description: Unauthorized
 */
router.get('/', auth("BASIC"), taskController.getAllTasksForUser)

/**
 * @swagger
 * /tasks/all:
 *   get:
 *     summary: Get tasks for user
 *     description: Get tasks for user with specified id
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: query
 *         name: size
 *         required: false
 *         schema:
 *           type: integer
 *         description: Page size for pagination. Default is 5.
 * 
 *       - in: query
 *         name: page
 *         required: false
 *         schema:
 *           type: integer
 *         description: Page for pagination. Default is 1.
 * 
 *       - in: query
 *         name: order
 *         required: false
 *         schema:
 *           type: integer
 *           enum: [ASC, DESC]
 *         description: Order by creation date. Default is DESC.
 *      
 *     responses:
 *       200:
 *         description: Tasks for user with specified id
 *       403:
 *         description: Unauthorized
 */
router.get('/all', auth("ADMIN"), taskController.getAllTasks)

/**
 * @swagger
 * /tasks:
 *   post:
 *     summary: Create task
 *     description: Create task
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               body:
 *                 type: string
 *                 description: Body
 *     responses:
 *       200:
 *         description: Created task
 *       403:
 *         description: Unauthorized
 */
router.post('/', auth("BASIC"), validate(TaskRequestDto), taskController.createTask)

/**
 * @swagger
 * /tasks/{id}:
 *   put:
 *     summary: Update task
 *     description: Updates task with specified id. Just for basic users.
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               body:
 *                 type: string
 *                 description: Body
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the task
 *     responses:
 *       200:
 *         description: Updated task
 *       403:
 *         description: Unauthorized
 */
router.put('/:id', auth("BASIC"), ownership(Task, 'UserId'), validate(TaskRequestDto), taskController.updateTask)

/**
 * @swagger
 * /tasks/admin/{id}:
 *   put:
 *     summary: Update task
 *     description: Updates task with specified id. Just for admin users.
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               body:
 *                 type: string
 *                 description: Body
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the task
 *     responses:
 *       200:
 *         description: Updated task
 *       403:
 *         description: Unauthorized
 */
router.put('/admin/:id', auth("ADMIN"), validate(TaskRequestDto), taskController.updateTask)

module.exports = router;