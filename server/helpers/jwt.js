const jwt = require('jsonwebtoken');


module.exports = {
    validateToken
}

async function validateToken(req, res, next) {

    const authorizationHeaader = req.headers.authorization;
    let result;
    const excluded = ['/users/authenticate'];
    // console.log("FDFD",req.url.split('/')[1])
    if (excluded.indexOf(req.url) > -1 || excluded.indexOf(req.url.split('/')[1]) > -1) return next();
    if (authorizationHeaader) {
        const token = req.headers.authorization.split(' ')[1]; // Bearer <token>

        try {
            // verify makes sure that the token hasn't expired and has been issued by us
            result = jwt.verify(token, 'mySecret');

            // Let's pass back the decoded token to the request object
            req.decoded = result;

            // We call next to pass execution to the subsequent middleware
            next();
        } catch (err) {
            // Throw an error just in case anything goes wrong with verification
            throw new Error(err);
        }
    } else {
        result = {
            status: false,
            message: 'token required',
            data: null,
            encrypted: false
        }
        res.status(401).send(
            result
        );
    }


}