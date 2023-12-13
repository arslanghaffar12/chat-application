const db = require("../helpers/db")
const mongoose = require('mongoose');
const Chat = db.Chat;


const objectId = mongoose.Types.ObjectId;

module.exports = {
    updateStatusByConversationId,
    getAll,
    postMessage,
    getMessages,
    getByConversationId,
    getByCoversationIds,
    updateMessage,
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

async function updateMessage(id, body) {
    console.log('id, body', id, body);
    //check if record existed in database which need to be updated
    const existing_object = await Chat.findById(id);
    if (!existing_object) throw 'Not_found';

    Object.assign(existing_object, body);
    return await existing_object.save();

}


async function updateStatusByConversationId(body) {
    try {
        // Find all messages with the given conversationId and update their status
        const updateResult = await Chat.updateMany(
            { conversationId: body._id },
            { $set: { status: 'read' } }
        );

        // Log or handle the update result if needed
        // console.log(`Updated ${updateResult.nModified} messages to 'read' status.`);

        // Return the update result or perform additional actions as needed
        return updateResult;
    } catch (error) {
        // Handle errors
        throw 'not found'; // You might want to handle this differently based on your use case
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

        ]);



        return result;
    } catch (error) {
        throw 'not found';
    }
}

async function getByCoversationIdsOld(requestData) {
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
                                $eq: ['$firstMessage.senderId', (requestData.user_id)]
                            },
                            then: '$firstMessage.recipientId',
                            else: '$firstMessage.senderId'
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



