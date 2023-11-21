const db = require("../helpers/db")
const Chat = db.Chat;



module.exports = {
    postMessage,
    getMessages
}


async function postMessage(req) {


    try {

        let message = {
            content: req.content,
            senderId: req.senderId,
            senderName: req.senderName,
            recipientId: req.recipientId,
            recipientName: req.recipientName,
        }
        const new_chat = new Chat(message);

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