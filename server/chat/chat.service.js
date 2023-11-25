const db = require("../helpers/db")
const mongoose = require("mongoose")
const Chat = db.Chat;


const objectId = mongoose.Types.ObjectId;

module.exports = {
    getAll,
    postMessage,
    getMessages,
    getByConversationId
}


async function getAll() {

    return await Chat.find()

}


async function postMessage(requestData) {


    try {


        const new_chat = new Chat(requestData);

        return await new_chat.save()
    }
    catch (err) {
        throw err
    }

}


async function getMessages(senderId, recipentId) {

    try {
        let messages = await Chat.find({
            $or: [
                { senderId: senderId, recipientId: recipentId },
                { senderId: recipentId, recipientId: senderId },

            ]
        }).sort({ timestamp: 1 });

        return messages
    }
    catch (err) {
        throw err
    }

}

async function getByConversationId(id) {

    try {
        let messages = await Chat.find({
            conservationId: id
        }).sort({ timestamp: 1 });

        return messages
    }
    catch (err) {
        throw err
    }

}