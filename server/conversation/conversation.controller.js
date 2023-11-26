const express = require("express");
const router = express.Router();
const service = require('./conversation.service');
const resHandler = require("../helpers/responseHandler")


router.get("/", getAll)
router.get("/getByUser", getByUser)
router.get('/:id', getById);
router.post("/checkByParticipants", checkByParticipants)
router.post("/createIfNotExist", createIfNotExist)


module.exports = router


async function getAll(req, res, next) {
    service.getAll(req)
        .then(response => {
            resHandler.getSuccess(res, response)

        })
        .catch(err => {
            resHandler.errorResponse(res, err)
        })

}

async function getById(req, res, next) {
    service.getById(req.params.id)
        .then(response => {
            resHandler.getSuccess(res, response)
        })
        .catch(err => {
            resHandler.errorResponse(res, err)
        })
}

async function checkByParticipants(req, res, next) {
    service.checkByParticipants(req)
        .then(response => {
            resHandler.getSuccess(res, response)
        })
        .catch(err => {
            resHandler.errorResponse(res, err)
        })
}

async function createIfNotExist(req, res, next) {
    service.createIfNotExist(req)
        .then(response => {
            console.log("response of created", response)
            resHandler.getSuccess(res, response)
        })
        .catch(err => {
            resHandler.errorResponse(res, err)
        })
}

async function getByUser(req, res, next) {
    console.log("this is running")
    console.log("req.query.id",req.query.id)
    service.getByUser(req.query.id)
        .then(response => {
            resHandler.getSuccess(res, response)
        })
        .catch(err => {
            resHandler.getSuccess(res, err)
        })
}