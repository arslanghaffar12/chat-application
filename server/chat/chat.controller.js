const express = require("express");
const router = express.Router();
const chatService = require("./chat.service");
const resHandler = require("../helpers/responseHandler")

// router.get("/", getAll);
router.post("/insert", postMessage);
router.get("/getMessages", getMessages);

module.exports = router;

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