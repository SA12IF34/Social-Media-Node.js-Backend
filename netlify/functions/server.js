require('dotenv').config();
const express = require('express');
const serverless = require('serverless-http');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const path = require('path');

const {logger} = require('../../middleware/logEvents');
const credentials = require("../../middleware/credentials");
const CORSOptions = require('../../config/CORSOptions');

const dbConn = require('../../config/dbConnect');

const serverErrorHandler = require('../../middleware/serverErrorHandler');

const PORT = 3000;
const app = express();

dbConn.connectDB();


app.use(express.urlencoded({extended: false}));
app.use(express.json());
app.use(cookieParser());
app.use('/media', express.static(path.join(__dirname, '../..', '/media')));

app.use(logger);
app.use(credentials);
app.use(cors(CORSOptions));

// API Routes
app.use('/auth', require('../../apis/account'));
app.use('/posts', require('../../apis/posts'));
app.use('/comments', require('../../apis/comments'));


app.all('{*any}', (req, res) => {
    res.sendStatus(404);
});


app.use(serverErrorHandler)

// mongoose.connection.once('open', () => {
//     console.log("\nConnected to MongoDB. \n");

//     app.listen(PORT, '0.0.0.0', () => {
//         console.log(`Listening on \nhttp://0.0.0.0:${PORT}\n`)
//     })
// })

// module.exports = {app}

module.exports = {handler: serverless(app)}