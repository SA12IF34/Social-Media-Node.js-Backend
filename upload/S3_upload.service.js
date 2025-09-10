const AWS = require('aws-sdk');
const getStream = require('./Stream.service');
AWS.config.update({region: process.env.AWS_S3_BUCKET_REGION})

const s3 = new AWS.S3({
    region: process.env.MY_AWS_REGION,
    accessKeyId: process.env.MY_AWS_KEY_ID,
    secretAccessKey: process.env.MY_AWS_SECRET_KEY
})


const handleUpload = async (file, fileName, fileType) => {
    try {
        let fileStream = await getStream(file);

        let uploadParams = {
            Bucket: process.env.AWS_S3_BUCKET_NAME,
            Key: fileName,
            Body: fileStream,
            ContentType: fileType
        }

        let data = await s3.upload(uploadParams).promise();
        console.log('Uploaded file!')
        console.log(data);
        return data;

    } catch (error) {
        console.log('Error uploading to S3 \n', error);
        return -1
    }
}

module.exports = {handleUpload}