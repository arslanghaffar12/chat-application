const express = require("express");
const router = express.Router();
const chatService = require("./chat.service");
const resHandler = require("../helpers/responseHandler")

// router.get("/", getAll);
router.get("/", getAll);
router.get("/getMessages", getMessages);
router.get("/getByConversationId", getByConversationId);
router.post("/insert", postMessage);
router.post('/getByCoversationIds', getByCoversationIds)


module.exports = router;

function getAll(req, res, next) {
    chatService.getAll()
        .then(response => {
            resHandler.getSuccess(res, response)
        })
        .catch(err => {
            resHandler.errorResponse(res, err)
        })
}

function postMessage(req, res, next) {
    chatService.postMessage(req.body)
        .then(response => {
            resHandler.insertSuccess(res, response);
        })
        .catch(err => {
            resHandler.errorResponse(res, err)
        })
}

function getMessages(req, res, next) {
    console.log("query are", req.query)
    chatService.getMessages(req.query.senderId, req.query.recipentId)
        .then(response => {
            resHandler.getSuccess(res, response)
        })
        .catch(err => {
            resHandler.errorResponse(req, err)
        })
}

function getByConversationId(req, res, next) {
    console.log("query are", req.query)
    chatService.getByConversationId(req.query.conservationId)
        .then(response => {
            console.log("messages are", response)

            resHandler.getSuccess(res, response)
        })
        .catch(err => {
            resHandler.errorResponse(res, err)
        })
}


function getByCoversationIds(req, res, next) {
    chatService.getByCoversationIds(req.body)
        .then(response => {
            resHandler.getSuccess(res, response)
        })
        .catch(err => {
            resHandler.errorResponse(res, err)
        })
}