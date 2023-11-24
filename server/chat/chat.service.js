const db = require("../helpers/db")
const Chat = db.Chat;



module.exports = {
    postMessage,
    getMessages
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