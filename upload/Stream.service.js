const fs = require('fs');
const {Readable} = require('stream')

module.exports = async (file) => {
    try {
        let fileStream =  Readable.from(file.buffer)
    
        return fileStream;
    } catch (error) {
        console.log('Streaming file error ', error);

        return -1;
    }
}