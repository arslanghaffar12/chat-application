const jwt = require('jsonwebtoken');


module.exports = {
    validateToken
}

async function validateToken(req, res, next) {

    console.log('validateToken is running');

    try {
        console.log('req is', req);

        const authorization = req.headers.authorization;
        console.log('authorization is', authorization);

        if (authorization) {

            let result = jwt.verify(authorization.token, 'mySecret');
            console.log('result==', result);

        }
    }
    catch {
        throw 'not found'
    }
}