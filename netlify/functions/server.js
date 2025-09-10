require('dotenv').config();
const express = require('express');
const serverless = require('serverless-http');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const path = require('path');

const {logger} = require('../../middleware/logEvents');
const credentials = require("../../middleware/credentials");

const dbConn = require('../../config/dbConnect');

const serverErrorHandler = require('../../middleware/serverErrorHandler');

const app = express();

dbConn.connectDB(undefined);

mongoose.connection.on('close', () => {
    dbConn.connectDB(undefined)
})

app.use(express.urlencoded({extended: false}));
app.use(express.json());
app.use(cookieParser());
app.use('/media', express.static(path.join(__dirname, '../..', '/media')));

app.use(logger);
app.use(credentials);
app.use(cors({
    origin: 'https://social-media.saifchan.site',
    optionsSuccessStatus: 200
}));

// API Routes
app.use('/auth', require('../../apis/account'));
app.use('/posts', require('../../apis/posts'));
app.use('/comments', require('../../apis/comments'));


app.all('{*any}', (req, res) => {
    res.sendStatus(404);
});


app.use(serverErrorHandler)



module.exports = {handler: serverless(app)}