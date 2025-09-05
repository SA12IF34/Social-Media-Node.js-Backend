const Account = require('../../models/Account');

const handleUpdateProfileImage = async (req, res) => {

    try {
        const profileImg = req.file;
        if (!profileImg) return res.sendStatus(400);

        const account = await Account.findById(req.userId).exec();
        account.profileImg = '/media/profiles/' + profileImg.filename;
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