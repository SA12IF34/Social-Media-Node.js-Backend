const {logEvents} = require('./logEvents');

const serverErrorHandler = (err, req, res, next) => {
    logEvents('Error: '+err.message)
    console.error(err.stack);
    res.status(500).send(err.message);
}

module.exports = serverErrorHandler;