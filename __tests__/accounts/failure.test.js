// /*
// Tests which pass on failure.
// */
const path = require('path');
require('dotenv').config({
    path:path.join(__dirname, '..', '..', '.env')
})

const request = require('supertest');
const {app} = require('../../server');

const dbConn = require('../../config/dbConnect');
const mongoose = require('mongoose');

const Account = require('../../models/Account');

describe('Test failed authentication and profile operations', () => {
    
    const invalidAccountData= {
        username: 'so',
        email: 'soo',
        password: 'sso'
    }

    const invalidAccountData2= {
        username: 'user',
        password: 'user1234$'
    }

    beforeAll(() => {
        console.log('run before all');
        dbConn.connectDB(process.env.MONGODB_TEST_URI);
        mongoose.connection.once('open', () => {
            console.log('\n--\nConnected to DB.\n--\n')
        })
    })

    afterAll(async () => {
        await mongoose.disconnect();
        console.log('run after all');
    })

    it('Should fail to create account with invalid data', async () => {
        const response = await request(app)
            .post('/auth/signup/')
            .send(invalidAccountData)
            .set('Content-Type', 'application/json');

        expect(response.status).toBe(500);
    })

    it('Should fail to create account with incomplete data', async () => {
        const response = await request(app)
            .post('/auth/signup/')
            .send(invalidAccountData2)
            .set('Content-Type', 'application/json');

        expect(response.status).toBe(400);
    })

    it('should fail to sign in with non-existent account', async () => {
        const response = await request(app)
            .post('/auth/login/')
            .send(invalidAccountData)
            .set('Content-Type', 'application/json');

        expect(response.status).toBe(404);
    })

    it('should fail to upload invalid image format', async () => {
        // Get valid access token first
        const validAccount = {
            'username': 'username',
            'email': 'digital@mail.com',
            'password': 'password123$'
        };
        
        const agent = request.agent(app)
                // Get access token first
        const loginResponse = await agent
            .post('/auth/signup/')
            .send(validAccount)
            .set('Content-Type', 'application/json');
        
        const accessToken = loginResponse.body.access_token;
        // Try uploading invalid file
        const response = await agent
            .patch('/auth/profile-img/')
            .set('Authorization', `Bearer ${accessToken}`)
            .attach('profile_img', path.join(__dirname, '..', 'mock', 'invalid.txt'));
        
        expect(response.status).toBe(400);
    })

    it('should fail to logout without being logged in', async () => {
        await Account.collection.drop()
        
        const response = await request(app)
            .post('/auth/logout/');
        
        expect(response.status === 204).toBeFalsy();
    })

    it('should fail to delete account without authorization', async () => {
        const response = await request(app)
            .delete('/auth/close-account/');
        
        expect(response.status).toBe(401);
    })
})
