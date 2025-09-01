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
const Comment = require('../../models/Comment');

describe('Test successful comment operations', () => {
    const accountMockData = {
        'username': 'postuser',
        'email': 'postuser@mail.com',
        'password': 'postpswrd234$'
    }

    let sampleComment;
    let samplePost;

    let user;
    let accessToken;

    let otherUser;
    let otherAccessToken;

    const agent = request.agent(app);
    const otherAgent = request.agent(app);

    beforeAll(async () => {
        console.log('run before all');
        dbConn.connectDB(process.env.MONGODB_TEST_URI);
        mongoose.connection.once('open', () => {
            console.log('\n--\nConnected to DB.\n--\n')
        })

        const response = await agent
            .post('/auth/signup/')
            .send(accountMockData)
            .set('Content-Type', 'application/json');

        accessToken = response.body.access_token;

        const accountRes = await agent.get('/auth/account/').set('Authorization', `Bearer ${accessToken}`);
        user = accountRes.body;

        const otherResponse = await otherAgent
            .post('/auth/signup/')
            .send({username: 'otheruser', email: 'other@email.com', password: 'otherpswrd123'})
            .set('Content-Type', 'application/json');

        otherAccessToken = otherResponse.body.access_token;

        const otherAccountRes = await otherAgent.get('/auth/account').set('Authorization', `Bearer ${otherAccessToken}`)
        otherUser = otherAccountRes.body;

        samplePost = await Post.create({
            content: 'Sample Post',
            author: user.id
        })

        sampleComment = await Comment.create({
            content: 'Sample comment',
            author: user.id,
            post: samplePost.id
        })

    }, 100000)

    afterAll(async () => {
        await Account.collection.drop();
        await Post.collection.drop();
        await mongoose.disconnect();
        mongoose.connection.close();
        console.log('run after all');
    })


    // Test Cases

    it('should not create a comment on sample post because not authenticated', async () => {
        const response = await request(app)
            .post(`/comments/create/`)
            .send({'content': 'Test Comment', 'postId': samplePost.id});

        expect(response.status).toBe(401);
        expect(Array.isArray(response.body)).toBeFalsy();
    })


    it('should fail update comment by author', async () => {
        const response = await agent
            .patch(`/comments/${sampleComment.id}/`)
            .send({})
            .set('Authorization', `Bearer ${accessToken}`);

        expect(response.status).toBe(400);
        
    })

    it('should fail delete comment by different account', async () => {
        const response = await otherAgent
            .delete(`/comments/${sampleComment.id}/`)
            .set('Authorization', `Bearer ${otherAccessToken}`);

        expect(response.status).toBe(403);
    })


})