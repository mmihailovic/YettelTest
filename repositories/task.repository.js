const { Task } = require("../models");


async function createTask(createTaskDto, userId) {
    return await Task.create({ ...createTaskDto, UserId: userId })
}

async function getAllTasks(page, pageSize, order) {
    return await Task.findAll({ limit: pageSize, offset: (page - 1) * pageSize, order: [['createdAt', order]] })
}

async function getAllTasksWithUserId(id, page, pageSize, order) {
    return await Task.findAll({ where: { UserId: id }, limit: pageSize, offset: (page - 1) * pageSize, order: [['createdAt', order]] })
}

async function findById(id) {
    return await Task.findByPk(id)
}

async function updateTask(updateTaskDto, id) {
    return await Task.update(updateTaskDto, { where: { id: id }, returning: true })
}

module.exports = { createTask, getAllTasks, getAllTasksWithUserId, updateTask, findById }