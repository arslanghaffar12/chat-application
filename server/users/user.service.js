const jwt = require('jsonwebtoken');
const db = require('../helpers/db');
const User = db.User;
const bycrypt = require("bcryptjs");

module.exports = {
    getAll,
    create,
    authenticate
}


async function authenticate(req) {

    let isExist = await User.findOne({ email: req.email });

    if (!isExist) {
        throw 'not exist'
    }

    if (isExist && bycrypt.compareSync(req.password, isExist.password_hash)) {
        try {

            let token = jwt.sign({
                sub: isExist._id,
                name: isExist.name,

            }, 'mySecret', { expiresIn: '5d' })

            let _user = { ...isExist.toJSON(), token: token , login : true}

            return _user
        }
        catch (err) {
            throw err
        }
    } else {
        throw 'Password is incorrect'
    }




}


function getAll(req, res) {

    let users = User.find();
    return users

}

async function create(req, res) {
    let isExist = await User.findOne({ email: req.email });

    if (isExist) {
        throw 'Already Exist!'
    }

    let newUser = new User(req);

    // hash password
    if (req.password) {
        newUser.password_hash = bycrypt.hashSync(req.password, 10);
    }

    return await newUser.save();
}