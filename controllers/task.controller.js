const taskService = require('../services/task.service')

async function createTask(req, res) {
    const userId = req.user.id;
    const task = await taskService.createTask(req.body, userId)
    res.status(201).json(task)
}

async function getAllTasks(req, res) {
    const pageSize = req.query.size || 5
    const page = req.query.page || 1
    const order = req.query.order || 'DESC'
    const tasks = await taskService.getAllTasks(page, pageSize, order)
    res.status(200).json(tasks)
}

async function getAllTasksForUser(req, res) {
    const userId = req.user.id;
    const pageSize = req.query.size || 5
    const page = req.query.page || 1
    const order = req.query.order || 'DESC'
    const tasks = await taskService.getAllTasksForUser(userId, page, pageSize, order)
    res.status(200).json(tasks)
}

async function updateTask(req, res) {
    const task = await taskService.updateTask(req.body, req.params.id)
    res.status(200).json(task)
}

module.exports = { createTask, getAllTasks, getAllTasksForUser, updateTask }