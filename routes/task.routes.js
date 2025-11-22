const express = require('express');
const router = express.Router();
const taskController = require('../controllers/task.controller');
const auth = require('../middlewares/auth.middleware')
const ownership = require('../middlewares/ownership.middleware')
const validate = require('../middlewares/validate.middleware')
const { TaskRequestDto } = require('../dtos/task.dto')
const { Task } = require('../models')

router.get('/', auth("BASIC"), taskController.getAllTasksForUser)
router.get('/all', auth("ADMIN"), taskController.getAllTasks)
router.post('/', auth("BASIC"), validate(TaskRequestDto), taskController.createTask)
router.put('/:id', auth("BASIC"), ownership(Task, 'UserId'), validate(TaskRequestDto), taskController.updateTask)
router.put('/admin/:id', auth("ADMIN"), validate(TaskRequestDto), taskController.updateTask)

module.exports = router;