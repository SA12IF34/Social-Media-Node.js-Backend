const path = require('path');
require('dotenv').config({
    path: path.join(__dirname, '..', '..', '.env')
})

const request = require('supertest');
const { app } = require('../../server');

const dbConn = require('../../config/dbConnect');
const mongoose = require('mongoose');

const Account = require('../../models/Account');
const Post = require('../../models/Post');

describe('Test failed post operations', () => {
    const validAccountData = {
        'username': 'postuser',
        'email': 'postuser@mail.com',
        'password': 'postpswrd234$'
    }

    const invalidPostData = {
        // Missing required content
    }

    let user;
    let otherUser;
    let accessToken;
    let otherUserAccessToken;
    let samplePost;

    const agentOne = request.agent(app);
    const agentTwo = request.agent(app);

    beforeAll(async () => {
        console.log('run before all');
        dbConn.connectDB(process.env.MONGODB_TEST_URI);
        mongoose.connection.once('open', () => {
            console.log('\n--\nConnected to DB.\n--\n')
        })

        // Create a test account and get access token
        const response = await agentOne
            .post('/auth/signup/')
            .send(validAccountData)
            .set('Content-Type', 'application/json');
        
        accessToken = response.body.access_token;

        // Get user data
        const accountRes = await agentOne
            .get('/auth/account/')
            .set('Authorization', `Bearer ${accessToken}`);
        user = accountRes.body;

        // Create another account for authorization tests
        const otherUserData = {
            'username': 'otheruser',
            'email': 'other@mail.com',
            'password': 'other1234$'
        };
        
        const otherResponse = await agentTwo
            .post('/auth/signup/')
            .send(otherUserData)
            .set('Content-Type', 'application/json');
        
        otherUserAccessToken = otherResponse.body.access_token;

        const otherAccountRes = await agentTwo
            .get('/auth/account/')
            .set('Authorization', `Bearer ${otherUserAccessToken}`);
        otherUser = otherAccountRes.body;

        // Create a sample post for testing
        samplePost = await Post.create({
            'content': 'Sample Post',
            'author': user.id
        });
    }, 100000)

    afterAll(async () => {
        await Account.collection.drop();
        await Post.collection.drop();
        await mongoose.disconnect();
        mongoose.connection.close();
        console.log('run after all');
    })

    it('Should fail to create post when not authenticated', async () => {
        const response = await request(app)
            .post('/posts/create/')
            .send({ content: 'Test content' })
            .set('Content-Type', 'application/json');

        expect(response.status).toBe(401);
    })

    it('Should fail to create post with invalid data', async () => {
        const response = await agentOne
            .post('/posts/create/')
            .set('Authorization', `Bearer ${accessToken}`)
            .send(invalidPostData)
            .set('Content-Type', 'application/json');

        expect(response.status).toBe(400);
    })

    it('Should fail to get post that does not exist', async () => {
        const nonExistentId = new mongoose.Types.ObjectId();
        const response = await agentOne
            .get(`/posts/${nonExistentId}/`);
        
        expect(response.status).toBe(404);
    })

    it('Should fail to update post with invalid data', async () => {
        const response = await agentOne
            .patch(`/posts/${samplePost.id}/`)
            .set('Authorization', `Bearer ${accessToken}`)
            .send(invalidPostData)
            .set('Content-Type', 'application/json');
        
        expect(response.status).toBe(400);
    })

    it('Should fail to update post when not authorized', async () => {
        const response = await agentTwo
            .patch(`/posts/${samplePost.id}/`)
            .set('Authorization', `Bearer ${otherUserAccessToken}`)
            .send({ content: 'Try to update' })
            .set('Content-Type', 'application/json');
        
        expect(response.status).toBe(403);
    })

    it('Should fail to like post when not authenticated', async () => {
        const response = await request(app)
            .patch(`/posts/${samplePost.id}/like/`)
            .send({});
        
        expect(response.status).toBe(401);
    })

    it('Should fail to dislike post when not authenticated', async () => {
        const response = await request(app)
            .patch(`/posts/${samplePost.id}/dislike/`)
            .send({});
        
        expect(response.status).toBe(401);
    })

    it('Should fail to get posts for non-existent user', async () => {
        const nonExistentId = new mongoose.Types.ObjectId();
        const response = await request(app)
            .get(`/posts/user/${nonExistentId}/`);
        
        expect(response.status).toBe(204);
    })

    it('Should fail to delete post when not authenticated', async () => {
        const response = await request(app)
            .delete(`/posts/${samplePost.id}/`);
        
        expect(response.status).toBe(401);
    })

    it('Should fail to delete post when not authorized (not the author)', async () => {
        const response = await agentTwo
            .delete(`/posts/${samplePost.id}`)
            .set('Authorization', `Bearer ${otherUserAccessToken}`);
        
        expect(response.status).toBe(403);
    })
})
