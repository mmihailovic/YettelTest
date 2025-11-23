const jwt = require('jsonwebtoken');
const userRepository = require('../repositories/user.repository')
const bcrypt = require('bcryptjs');
const { UserDto } = require('../dtos/user.dto');
const { BadRequestError } = require('../errors');

async function updateUser(id, userUpdateDto) {
    if(userUpdateDto['role'] && userUpdateDto.role !== 'BASIC' && userUpdateDto.role !== 'ADMIN') throw new BadRequestError("Role can be BASIC or ADMIN!")
    userUpdateDto.password = await bcrypt.hash(userUpdateDto.password, await bcrypt.genSalt())
    let [count, updatedUser] = await userRepository.updateUser(id, userUpdateDto)
    updatedUser = updatedUser.map(user => UserDto.parse(user))
    return [count, updatedUser]
}

async function login(username, password) {
    // logging with username or email
    const user = await userRepository.findUserByUsernameOrEmail(username)
    if(!user) throw new BadRequestError("Username doesn't exist!")

    const checkPassword = await bcrypt.compare(password, user.password)
    if(!checkPassword) throw new BadRequestError("Bad credentials!")
    
    const token = jwt.sign({id: user.id, username: user.username, email: user.email, role: user.role}, process.env.JWT_SECRET)
    return token
}

module.exports = { updateUser, login }