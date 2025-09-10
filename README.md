# Social Media Backend System
Backend system built with Node.js, Express.js and Mongodb, tested with Jest, deployed to Netlify. 
<br>
<a href="https://social-media.saifchan.site">Live Demo</a>

<hr>

## Description and Features
This is a social media system built in MVC architecture following Test Drevin Development approach. Has auth, profiles, posts and comments actions.

### Auth and Profiles 
- Signup, login, logout and close account
- Edit profile.
- Follow/Unfollow profile
- Get profile followers/followings

### Posts
- Create, read, update and delete posts
- Like/Dislike posts

### Comments
- Create, read, updated and delete comments on posts.

## How to run locally
- run `npm install` in project root dir
- create `.env` file and include following variables in it:
```
ACCESS_TOKEN_SECRET=<secret token for access JWT (e.g. base64 generated string)>
REFRESH_TOKEN_SECRET=<secret token for refresh JWT (e.g. base64 generated string)>
MONGODB_URI=<URI to mongodb database either local or mongodb atlas>
MONGODB_TEST_URI=<URI to mongodb test database either local or mongodb atlas>
MY_AWS_KEY_ID=<AWS access key id> # You can serve static files with express and host created profile images and posts media files
MY_AWS_SECRET_KEY=<AWS access secret id>
AWS_S3_BUCKET_NAME=<AWS S3 bucket name> 
MY_AWS_REGION=<AWS S3 bucket region>
```
- run `npm run dev` to run dev server
- run `npm run start` to run preview server
- run `npm run test` to run all tests, or run `npm run test <path to test file/folder>` to run certain tests

<br>
Feel free to fork, clone or make pull request to this repo.

 
