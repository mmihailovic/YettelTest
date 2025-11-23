const request = require('supertest')
require('dotenv').config({ path: '.env.test' });
const app = require('../app')
const { User, sequelize } = require('../models');

let basicUser, adminUser

// setup database, create basic and admin user
beforeAll(async () => {
    await sequelize.sync({ alter: true });
    adminUser = await User.create({ firstName: 'Admin', lastName: 'Admin', email: 'admin@email.com', username: 'admin', password: '$2a$12$rg9NwcHzEbTF/Qyib2XoZuJ1c5X5XDqjrUiMLLKPQwS75A1qfiJei', role: 'ADMIN' })
    basicUser = await User.create({ firstName: 'User', lastName: 'User', email: 'user@email.com', username: 'user', password: '$2a$12$rg9NwcHzEbTF/Qyib2XoZuJ1c5X5XDqjrUiMLLKPQwS75A1qfiJei', role: 'BASIC' })
})

// clear tables
afterAll(async () => {
    await User.destroy({ where: {} })
})

describe('Login user', () => {
    it('POST /login should return JWT token if credentials are valid', async () => {
        const response = await request(app)
        .post('/api/users/login')
        .send({ username: 'user@email.com', password: '123' })

        expect(response.status).toBe(200)
        expect(response.body).toHaveProperty('token')
    })

    it('POST /login shoud not allow login if credentials are invalid', async () => {
        const response = await request(app)
        .post('/api/users/login')
        .send({ username: 'user@email.com', password: '1234' })

        expect(response.status).toBe(400)
    })
})

describe('Update user', () => {
    let basicUserJwt, adminUserJwt

    beforeAll(async () => {
        const basicUserResponse = await request(app)
        .post('/api/users/login')
        .send({ username: 'user@email.com', password: '123' })

        basicUserJwt = basicUserResponse.body.token

        const adminUserResponse = await request(app)
            .post('/api/users/login')
            .send({ username: 'admin@email.com', password: '123' })

        adminUserJwt = adminUserResponse.body.token
    })

    it('PUT / should update the logged user', async () => {
        const response = await request(app)
        .put('/api/users')
        .set('Authorization', `${basicUserJwt}`)
        .send({ firstName: 'User1', lastName: 'User', username: 'user', email: 'user@email.com', password: '123', role: 'BASIC' })
        
        expect(response.status).toBe(200)
        expect(response.body[1][0].firstName).toBe('User1') 
    })

    it('PUT /:id should update the user with the specified id', async () => {
        const response = await request(app)
        .put('/api/users/' + basicUser.id)
        .set('Authorization', `${adminUserJwt}`)
        .send({ firstName: 'User2', lastName: 'User', username: 'user', email: 'user@email.com', password: '123', role: 'BASIC' })
        
        expect(response.status).toBe(200)
        expect(response.body[1][0].firstName).toBe('User2')
    })

    it('PUT /:id should be forbidden for basic user', async () => {
        const response = await request(app)
        .put('/api/users/' + basicUser.id)
        .set('Authorization', `${basicUserJwt}`)
        .send({ firstName: 'User', lastName: 'User', email: 'user@email.com',
            username: 'user', password: '123', role: 'BASIC' })
        
        expect(response.status).toBe(403)
    })
})