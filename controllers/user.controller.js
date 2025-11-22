const userService = require('../services/user.service')

async function updateLoggedUser(req, res) {
    const userId = req.user.id;
    const user = await userService.updateUser(userId, req.body)
    res.status(200).json(user)
}

async function updateUser(req, res) {
    const id = req.params.id
    const user = await userService.updateUser(id, req.body)
    res.status(200).json(user)
}

async function login(req, res) {
    const { username, password } = req.body
    const token = await userService.login(username, password)
    res.status(200).json({"token": token})
}

module.exports = { updateLoggedUser, updateUser, login }