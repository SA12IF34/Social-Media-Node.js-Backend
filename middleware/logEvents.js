const {format} = require('date-fns');
const {v4: uuid} = require('uuid');
const fs = require('fs');
const fsPromises = require('fs').promises;
const path = require('path');

const logEvents = async (msg) => {
    const logDate = `${format(new Date(), 'yyyyMMdd\tHH:mm:ss')}`;
    const logItem = `${logDate}\t${uuid()}\t${msg}`;
    console.log('\n',logItem,'\n');
    
    try {
        if (!fs.existsSync(path.join(__dirname, '..', 'logs'))) {
            await fsPromises.mkdir(path.join(__dirname, '..', 'logs'));
        }
        await fsPromises.appendFile(path.join(__dirname, '..', 'logs', 'logs.log'), logItem+'\n');
    } catch (error) {
        console.log('Could not log events due to the following error:\n', error);
    }
}

const logger = (req, res, next) => {
    logEvents(`${req.method}\t${req.headers.origin}\t${req.url}`)
    console.log(`${req.method}\t${req.headers.origin}\t${req.url}`);
    next()
}

module.exports = {logEvents, logger};