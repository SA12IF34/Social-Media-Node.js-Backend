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

    const agent = request.agent(app);


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

    it('should create a comment on sample post', async () => {
        const response = await agent
            .post(`/comments/create/`)
            .set('Authorization', `Bearer ${accessToken}`)
            .send({'content': 'Test Comment', 'postId': samplePost.id});

        expect(response.status).toBe(201);
        expect(Array.isArray(response.body)).toBeTruthy();
        expect(response.body.length > 0).toBeTruthy()
    })

    it('should get post comments', async () => {
        const response = await request(app)
            .get(`/comments/post/${samplePost.id}/`);
        
        expect(response.status).toBe(200);
        expect(Array.isArray(response.body)).toBeTruthy();
        expect(response.body.length >= 1).toBeTruthy()
    })

    it('should update comment by author', async () => {
        const response = await agent
            .patch(`/comments/${sampleComment.id}/`)
            .send({'content': 'new sample comment content'})
            .set('Authorization', `Bearer ${accessToken}`);
        
        console.log(response.body);
        
        expect(response.status).toBe(202);
        expect(response.body._id).toBe(sampleComment.id);
        
    })

    it('should delete comment by author', async () => {
        const response = await agent
            .delete(`/comments/${sampleComment.id}`)
            .set('Authorization', `Bearer ${accessToken}`);

        expect(response.status).toBe(204);
    })


})