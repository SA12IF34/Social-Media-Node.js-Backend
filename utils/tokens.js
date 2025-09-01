const jwt = require('jsonwebtoken');


const handleCreateToken = (account, secret, age) => {
    return jwt.sign(
        {
            'account': {
            'id': account.id,
            'email': account.email
            }
        },
        secret,
        {expiresIn: age}
    );
}


module.exports = handleCreateToken;