const express = require('express');
const router = express.Router();
const userService = require("./user.service");
const resHandler = require("../helpers/responseHandler")


router.get('/', getAll);
router.put("/updatePassword", create2);
router.put("/:id", update);
router.post('/create', create);
router.post('/authenticate', authenticate);
router.delete("/:id", deleteUser)

module.exports = router;

function authenticate(req, res, next) {
    console.log("authenticate req", req.body)
    userService.authenticate(req.body)
        .then(response => {
            console.log('response of login', response);
            resHandler.getSuccess(res, response)
        })
        .catch(err => {
            resHandler.errorResponse(res, err)
        })

}


function getAll(req, res, next) {
    userService.getAll(req)
        .then(response => {
            resHandler.getSuccess(res, response)
        })
        .catch(err => next(err))

}

function create(req, res, next) {
    console.log("created request", req.body)
    userService.create(req.body)
        .then(response => {
            resHandler.insertSuccess(res, response)
        })
        .catch(err => next(err))

}

function create2(req, res, next) {
    console.log("created request in", req.body)
    userService.updatePassword(req.body._id, req.body)
        .then(response => {
            resHandler.insertSuccess(res, response)
        })
        .catch(err => resHandler.errorResponse(res, err))
    // userService.create(req.body)
    //     .then(response => {
    //         resHandler.insertSuccess(res, response)
    //     })
    //     .catch(err => next(err))

}


function update(req, res, next) {
    userService.update(req.params.id, req.body)
        .then(response => {
            resHandler.insertSuccess(res, response)
        })
        .catch(err => next(err))
}

function deleteUser(req, res, next) {
    userService.deleteUser(req.params.id)
        .then(response => {
            resHandler.insertSuccess(res, response)
        })
        .catch(err => next(err))
}

