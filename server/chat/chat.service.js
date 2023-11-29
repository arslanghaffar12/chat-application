const db = require("../helpers/db")
const mongoose = require('mongoose');
const Chat = db.Chat;


const objectId = mongoose.Types.ObjectId;

module.exports = {
    getAll,
    postMessage,
    getMessages,
    getByConversationId,
    getByCoversationIds
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

async function getByCoversationIds(requestData) {
    console.log("requestData in ", requestData);

    // let all_ids = requestData.cnv_ids;
    try {

        let all_ids = requestData.cnv_ids.map(id => new mongoose.Types.ObjectId(id));
        console.log("all_ids", all_ids)
        const result = await Chat.aggregate([
            {
                $match: { conversationId: { $in: all_ids } },
            },
            {
                $group: {
                    _id: '$conversationId',
                    messages: { $push: '$$ROOT' },
                },
            },
            {
                $addFields: {
                    firstMessage: {
                        $let: {
                            vars: {
                                firstMessage: { $arrayElemAt: ['$messages', 0] }
                            },
                            in: {
                                senderId: '$$firstMessage.senderId',
                                recipientId: '$$firstMessage.recipientId',
                                // Add more fields as needed
                            }
                        }
                    }
                }
            },
            {
                $addFields: {
                    otherUserId: {
                        $cond: {
                            if: {
                                $eq: ['$firstMessage.senderId', new mongoose.Types.ObjectId(requestData.user_id)]
                            },
                            then: '$firstMessage.senderId',
                            else: '$firstMessage.recipientId'
                        }
                    }
                }
            },
            {
                $project: {
                    _id: 0, // exclude _id from the final result
                    conversationId: '$_id',
                    messages: 1,
                    otherUserId: { $toObjectId: '$otherUserId' },
                }
            },


            {
                $lookup: {
                    from: 'users',
                    localField: 'otherUserId',
                    foreignField: '_id',
                    as: 'userDetails'
                }
            },

            {
                $project: {
                    conversationId: 1,
                    messages: 1,
                    userDetails: { $arrayElemAt: ['$userDetails', 0] }
                }
            }



        ]);



        return result;
    } catch (error) {
        throw error;
    }
}

