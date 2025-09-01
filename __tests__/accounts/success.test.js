/*
Tests which pass on success.
*/
const path = require('path');
require('dotenv').config({
    path:path.join(__dirname, '..', '..', '.env')
})

const request = require('supertest');
const {app} = require('../../server');

const dbConn = require('../../config/dbConnect');
const mongoose = require('mongoose');

const Account = require('../../models/Account')

describe('Test successful authentication and profile operations', () => {
    // SignUp, SignIn, LogOut, Update ProfileImg and Delete Account

    const accountMockData = {
        'username': 'user',
        'email': 'user@mail.com',
        'password': 'userpswrd234$'
    };

    let targetAccount;

    beforeAll(async () => {
        console.log('run before all');
        dbConn.connectDB(process.env.MONGODB_TEST_URI);
        mongoose.connection.once('open', () => {
            console.log('\n--\nConnected to DB.\n--\n')
        })

        targetAccount = await Account.create({
            username: "targetAccount",
            email: "target@mail.com",
            password: "password12323"
        })
        
    })

    afterAll(async () => {
        await Account.collection.drop();
        await mongoose.disconnect();
        mongoose.connection.close();
        console.log('run after all');
    })

    

    it('Should create a new account', async () => {
        const response = await request(app)
            .post('/auth/signup/')
            .send(accountMockData)
            .set('Content-Type', 'application/json');

        expect(response.status).toBe(200);
        expect(Object.keys(response.body)).toContain('access_token');
    })

    it('should sign into existing account', async () => {
        const response = await request(app)
            .post('/auth/login/')
            .send(accountMockData)
            .set('Content-Type', 'application/json');

        expect(response.status).toBe(200);
        expect(Object.keys(response.body)).toContain('access_token');
    })

    it('should upload new profile image', async () => {
        const agent = request.agent(app)
        // Get access token first
        const loginResponse = await agent
            .post('/auth/login/')
            .send(accountMockData)
            .set('Content-Type', 'application/json');
        
        const accessToken = loginResponse.body.access_token;

        // Then upload the image
        const response = await agent
            .patch('/auth/profile-img/')
            .set('Authorization', `Bearer ${accessToken}`)
            .set('Content-Type', 'multipart/form-data')
            .attach('profile_img',  path.join(__dirname, '..', 'mock', 'sample.jpg'));
        
        expect(response.status).toBe(202);
    })

    it('should follow target account', async () => {
        const agent = request.agent(app)
        // Get access token first
        const loginResponse = await agent
            .post('/auth/login/')
            .send(accountMockData)
            .set('Content-Type', 'application/json');
        
        const accessToken = loginResponse.body.access_token;

        const response = await agent
            .patch(`/auth/profile/${targetAccount.id}/follow`)
            .set('Authorization', `Bearer ${accessToken}`)
            .send({});

        const targetFollowers = (await Account.findById(targetAccount.id).exec()).followers
        const account = await Account.findOne({username: accountMockData.username}).exec();

        expect(response.status).toBe(200);
        expect(targetFollowers.length).toBe(1);
        expect(account.following.length).toBe(1);
        expect(targetFollowers[0]).toBe(account.id);
        expect(account.following[0]).toBe(targetAccount.id);
    })

    it('should logout from account', async () => {
        const agent = request.agent(app)
        const loginResponse = await agent
            .post('/auth/login/')
            .send(accountMockData)
            .set('Content-Type', 'application/json');
        
        const accessToken = loginResponse.body.access_token;

        const response = await agent
            .post('/auth/logout/')
            .set('Authorization', `Bearer ${accessToken}`);
        
        expect(response.status).toBe(204);
    })


    it('should delete account', async () => {
        const agent = request.agent(app);
        const loginResponse = await agent
            .post('/auth/login/')
            .send(accountMockData)
            .set('Content-Type', 'application/json');
        
        const accessToken = loginResponse.body.access_token;

        const response = await agent
            .delete('/auth/close-account/')
            .set('Authorization', `Bearer ${accessToken}`);
        
        expect(response.status).toBe(204);
    })
})

