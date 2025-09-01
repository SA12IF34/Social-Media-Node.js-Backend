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

describe('Test successful post operations', () => {
    const accountMockData = {
        'username': 'postuser',
        'email': 'postuser@mail.com',
        'password': 'postpswrd234$'
    }

    const postMockData = {
        'content': 'This is a test post content'
    }

    let samplePostOne; 
    let samplePostTwo; 

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

        samplePostOne = await Post.create({
            'content': 'Sample Post One',
            'author': user.id
        });
        samplePostTwo = await Post.create({
            'content': 'Sample Post Two',
            'author': user.id
        })
    }, 100000)

    afterAll(async () => {
        await Account.collection.drop();
        await Post.collection.drop();
        await mongoose.disconnect();
        mongoose.connection.close();
        console.log('run after all');
    })

    it('Should create a new post', async () => {
        const response = await agent
            .post('/posts/create/')
            .set('Authorization', `Bearer ${accessToken}`)
            .send(postMockData)
            .set('Content-Type', 'application/json');

        expect(response.status).toBe(201);
        expect(response.body).toHaveProperty('id');
        expect(response.body.content).toBe(postMockData.content);
    })

    it('Should get a post by id', async () => {
        // Then get the post
        const response = await agent
            .get(`/posts/${samplePostOne.id}`)
            .set('Authorization', `Bearer ${accessToken}`);
        
        expect(response.status).toBe(200);
        expect(response.body.id).toBe(samplePostOne.id);
        expect(response.body.content).toBe(samplePostOne.content);
    })

    it('Should update post content by author', async () => {

        const updatedContent = { content: 'Updated content' };

        // Then update the post
        const response = await agent
            .patch(`/posts/${samplePostTwo.id}/`)
            .set('Authorization', `Bearer ${accessToken}`)
            .send(updatedContent)
            .set('Content-Type', 'application/json');
        
        expect(response.status).toBe(202);
        expect(response.body.content).toBe(updatedContent.content);
    })

    it('Should like a post', async () => {

        // Then like the post
        const response = await agent
            .patch(`/posts/${samplePostOne.id}/like/`)
            .send({})
            .set('Authorization', `Bearer ${accessToken}`);
        
        expect(response.status).toBe(202);
    })

    it('Should dislike a post', async () => {

        // Then dislike the post
        const response = await agent
            .patch(`/posts/${samplePostTwo.id}/dislike/`)
            .send({})
            .set('Authorization', `Bearer ${accessToken}`);
        
        expect(response.status).toBe(202);
    })

    it('Should get all posts for an account', async () => {
        const response = await request(app)
            .get(`/posts/user/${user.id}/`)
            
        
        expect(response.status).toBe(200);
        expect(Array.isArray(response.body)).toBeTruthy();
    })

    it('Should delete post by author', async () => {
        const response = await agent
            .delete(`/posts/${samplePostOne.id}/`)
            .set('Authorization', `Bearer ${accessToken}`);
        
        expect(response.status).toBe(204);

        // Verify post is actually deleted
        const checkResponse = await agent
            .get(`/posts/${samplePostOne.id}`);
        expect(checkResponse.status).toBe(404);
    })
})
