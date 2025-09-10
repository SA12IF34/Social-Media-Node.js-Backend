const Account = require('../../models/Account');
const {handleUpload} = require('../../upload/S3_upload.service');

const handleUpdateProfileImage = async (req, res) => {

    try {
        const profileImg = req.file;
        if (!profileImg) return res.sendStatus(400);

        const account = await Account.findById(req.userId).exec();
        
        const data = await handleUpload(profileImg, account.id+profileImg.originalname, profileImg.mimetype);

        account.profileImg = data.Location;
        await account.save()

        res.status(202).send({profileImg: account.profileImg});

    } catch (error) {
        console.error(error)
        res.sendStatus(500)        
    }
}


module.exports = {
    handleUpdateProfileImage
}