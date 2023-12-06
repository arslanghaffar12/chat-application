const jwt = require('jsonwebtoken');
const db = require('../helpers/db');
const User = db.User;
const bycrypt = require("bcryptjs");

module.exports = {
    getAll,
    create,
    authenticate,
    update,
    deleteUser,
    updatePassword
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

            let _user = { ...isExist.toJSON(), token: token, login: true }

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

async function update(id, body) {

    let isExist = await User.findById(id);

    if (!isExist) {
        throw 'user not exist'
    }

    if (isExist.email !== body.email && await User.findOne({ email: body.email })) {
        throw "already_existed"
    }

    if (body.password) {
        isExist.password_hash = bycrypt.hashSync(body.password, 10);
    }

    Object.assign(isExist, body);
    await isExist.save();
    return await User.findOne({ _id: id })
}

async function deleteUser(id) {
    try {
        return await User.deleteOne({ _id: id })

    } catch (e) {
        throw 'Not_found';
    }

}

async function updatePassword(id, request_param) {
    // id = new mongoose.Types.ObjectId(id)
    let user_found = await User.findById({ _id: id });

    if (!user_found)
        throw 'not found';

    if (bycrypt.compareSync(request_param.oldPassword, user_found.password_hash)) {

        if (request_param.newPassword) {
            let newPassword = bycrypt.hashSync(request_param.newPassword, 10);

            return await User.updateOne({
                _id: id
            }, {
                $set: { password_hash: newPassword }
            });
        }
    } else
        throw 'wrong_password';

}
