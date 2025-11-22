const { NotFoundError } = require('../errors')
const taskRepository = require('../repositories/task.repository')

async function createTask(createTaskDto, userId) {
    return await taskRepository.createTask(createTaskDto, userId)
}

async function getAllTasks(page, pageSize, order) {
    return await taskRepository.getAllTasks(page, pageSize, order)
}

async function getAllTasksForUser(id, page, pageSize, order) {
    return await taskRepository.getAllTasksWithUserId(id, page, pageSize, order)
}

async function updateTask(updateTaskDto, id) {
    const task = await taskRepository.findById(id)
    if(!task) throw new NotFoundError('Task with ID ' + id + ' not found!')
    return await taskRepository.updateTask(updateTaskDto, id)
}

module.exports = { createTask, getAllTasks, getAllTasksForUser, updateTask }