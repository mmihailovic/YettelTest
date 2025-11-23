const request = require('supertest')
require('dotenv').config({ path: '.env.test' });
const app = require('../app')
const { User, Task, sequelize } = require('../models');

let basicUserJwt, basicUser2Jwt, adminUserJwt

// setup database, create and login basic and admin user
beforeAll(async () => {
    await sequelize.sync({ alter: true });
    await User.create({ firstName: 'Admin', lastName: 'Admin', email: 'admin@email.com', username: 'admin', password: '$2a$12$rg9NwcHzEbTF/Qyib2XoZuJ1c5X5XDqjrUiMLLKPQwS75A1qfiJei', role: 'ADMIN' })
    await User.create({ firstName: 'User', lastName: 'User', email: 'user@email.com', username: 'user', password: '$2a$12$rg9NwcHzEbTF/Qyib2XoZuJ1c5X5XDqjrUiMLLKPQwS75A1qfiJei', role: 'BASIC' })
    await User.create({ firstName: 'User', lastName: 'User', email: 'user2@email.com', username: 'user2', password: '$2a$12$rg9NwcHzEbTF/Qyib2XoZuJ1c5X5XDqjrUiMLLKPQwS75A1qfiJei', role: 'BASIC' })

    const basicUserResponse = await request(app)
        .post('/api/users/login')
        .send({ username: 'user@email.com', password: '123' })

    basicUserJwt = basicUserResponse.body.token

    const basicUser2Response = await request(app)
        .post('/api/users/login')
        .send({ username: 'user2@email.com', password: '123' })

    basicUser2Jwt = basicUser2Response.body.token

    const adminUserResponse = await request(app)
        .post('/api/users/login')
        .send({ username: 'admin@email.com', password: '123' })

    adminUserJwt = adminUserResponse.body.token
})

// clear tables
afterAll(async () => {
    await User.destroy({ where: {} })
})

describe('Create task', () => {
    it('POST /tasks should create task and return it for basic user', async () => {
        const response = await request(app).post('/api/tasks').set('Authorization', `${basicUserJwt}`).send({ body: 'Test body' })
        expect(response.status).toBe(201)
        const task = response.body
        expect(task.body).toBe('Test body')
    })

    it('POST /tasks should be forbidden for admin user', async () => {
        const response = await request(app).post('/api/tasks').set('Authorization', `${adminUserJwt}`).send({ body: 'Test body' })
        expect(response.status).toBe(403)
    })

    afterAll(async () => {
        await Task.destroy({ truncate: true, restartIdentity: true })
    })
})

describe('Get tasks', () => {
    let tasks = []
    let tasksSortedDesc = []

    // creating tasks
    beforeAll(async () => {
        for (let i = 1; i <= 3; i++) {
            const response = await request(app).post('/api/tasks').set('Authorization', `${basicUserJwt}`).send({ body: 'Test body ' + i })
            tasks.push(response.body)
        }
        tasksSortedDesc = tasks.toReversed()
    })


    it('GET /tasks should return tasks for basic user, support pagination and sorting', async () => {
        const firstPage = await request(app)
            .get('/api/tasks')
            .query({ size: 1, page: 1, order: 'ASC' })
            .set('Authorization', `${basicUserJwt}`)

        expect(firstPage.status).toBe(200)
        expect(firstPage.body[0]).toEqual(tasks[0])

        const lastPage = await request(app)
            .get('/api/tasks')
            .query({ size: 1, page: 1, order: 'DESC' })
            .set('Authorization', `${basicUserJwt}`)

        expect(lastPage.status).toBe(200)
        expect(lastPage.body[0]).toEqual(tasksSortedDesc[0])
    })

    it('GET /tasks should return default maximum first 5 tasks for basic user when no query params are provided', async () => {
        const response = await request(app).get('/api/tasks').set('Authorization', `${basicUserJwt}`)
        expect(response.status).toBe(200)
        expect(response.body).toEqual(tasksSortedDesc)
    })

    it('GET /tasks should be forbidden for admin user', async () => {
        const response = await request(app).get('/api/tasks').set('Authorization', `${adminUserJwt}`)
        expect(response.status).toBe(403)
    })

    it('GET /tasks/all should be forbidden for basic user', async () => {
        const response = await request(app).get('/api/tasks/all').set('Authorization', `${basicUserJwt}`)
        expect(response.status).toBe(403)
    })

    it('GET /tasks/all should return default maximum first 5 tasks for admin user when no query params are provided', async () => {
        const response = await request(app).get('/api/tasks/all').set('Authorization', `${adminUserJwt}`)
        expect(response.status).toBe(200)
        expect(response.body).toEqual(tasksSortedDesc)
    })

    afterAll(async () => {
        await Task.destroy({ truncate: true, restartIdentity: true })
    })
})

describe('Update tasks', () => {
    let tasks = []

    // create tasks for basic users
    beforeAll(async () => {
        const responseUser = await request(app).post('/api/tasks').set('Authorization', `${basicUserJwt}`).send({ body: 'Test body' })
        tasks.push(responseUser.body)

        const responseUser2 = await request(app).post('/api/tasks').set('Authorization', `${basicUser2Jwt}`).send({ body: 'Test body' })
        tasks.push(responseUser2.body)
    })

    it('PUT /:id should update the task with specified id if that task belongs to user', async () => {
        const response = await request(app).put('/api/tasks/' + tasks[0].id).set('Authorization', `${basicUserJwt}`).send({ body: 'Test body updated' })
        expect(response.status).toBe(200)
        const updatedTask = response.body[1][0]
        expect(updatedTask.body).toBe('Test body updated')
    })

    it('PUT /:id should be forbidden if task does not belong to the user', async () => {
        const response = await request(app).put('/api/tasks/' + tasks[1].id).set('Authorization', `${basicUserJwt}`).send({ body: 'Test body updated' })
        expect(response.status).toBe(403)
    })

    it('PUT /:id should be forbidden for admin user', async () => {
        const response = await request(app).put('/api/tasks/' + tasks[1].id).set('Authorization', `${adminUserJwt}`).send({ body: 'Test body updated' })
        expect(response.status).toBe(403)
    })

    it('PUT /admin/:id should update the task with specified id', async () => {
        const response = await request(app).put('/api/tasks/admin/' + tasks[0].id).set('Authorization', `${adminUserJwt}`).send({ body: 'Test body updated' })
        expect(response.status).toBe(200)
        const updatedTask = response.body[1][0]
        expect(updatedTask.body).toBe('Test body updated')
    })

    it('PUT /admin/:id should be forbidden for basic user', async () => {
        const response = await request(app).put('/api/tasks/admin/' + tasks[0].id).set('Authorization', `${basicUserJwt}`).send({ body: 'Test body' })
        expect(response.status).toBe(403)
    })

    afterAll(async () => {
        await Task.destroy({ truncate: true, restartIdentity: true })
    })
})
