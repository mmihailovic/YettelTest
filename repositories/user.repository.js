const { User } = require("../models")
const { Op } = require('sequelize');

async function updateUser(id, updateUserDto) {
    return await User.update(updateUserDto, { where: { id: id }, returning: true })
}

async function findUserByUsernameOrEmail(username) {
    return await User.findOne({ where: { [Op.or]: [{ username: username }, { email: username }] } })
}

module.exports = { updateUser, findUserByUsernameOrEmail }