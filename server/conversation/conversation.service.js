const db = require("../helpers/db")
const Conversation = db.Conversation;
const Chat = db.Chat;
const mongoose = require('mongoose');

module.exports = {
  getAll,
  getById,
  create,
  createIfNotExist,
  checkByParticipants,
  getByUser,
  updateConversationTime,
  updateUnreadMessage
}

async function getAll(req) {

  let conversation = Conversation.find();
  return conversation

}

async function getById(id) {

  try {
    let conversation = Conversation.findById(id)
    return conversation
  }
  catch (err) {
    throw err
  }


}


async function create(req) {

  let request = req.body;
  let senderId = "senderId" in request ? request.senderId : '';
  let recieverId = "recieverId" in request ? request.recieverId : '';

  if (senderId && recieverId) {
    let participants = [senderId, recieverId];

    let new_conservation = new Conversation(participants);
    return await new_conservation.save()


  } else {
    throw "inappropriate"
  }




}


async function checkByParticipants(req) {

  try {

    let participants = req.body.participants;

    let isExist = await Conversation.find({ participants: participants })

    return isExist


  }
  catch (err) {
    throw err
  }
}

async function createIfNotExist(req) {

  try {

    let participants = req.body.participants;
    console.log("participants are", participants)

    let isExist = await Conversation.find({ participants: participants })
    console.log("participants are exist", isExist)

    if (isExist && isExist.length > 0) {
      return isExist
    }

    let _conversation = new Conversation({ participants: participants });
    _conversation.save();

    return _conversation

  }
  catch (err) {
    throw "Not_found"
  }
}

async function getByUser(userId) {

  try {
    let cvnIds = await Conversation.find({ participants: userId });



    const conversations = await Conversation.aggregate([
      { $match: { participants: userId } },
      {
        $project: {
          _id: 1,
          participants: 1,
          timestamp: 1,
          users: {
            $filter: {
              input: "$participants",
              cond: { $ne: ["$$this", userId] }
            }
          },
        },
      },
      {
        $addFields: {
          users: {
            $map: {
              input: "$users",
              as: "userId",
              in: { $toObjectId: "$$userId" } // Convert each user ID to ObjectId
            }
          },
          conversationId: "$_id"
        },
      },

      { $unwind: "$users" },
      {
        $lookup: {
          from: 'users',
          localField: 'users',
          foreignField: "_id",
          as: 'membersArray'
        }
      },
      {
        $addFields: {
          members: { $arrayElemAt: ["$membersArray", 0] } // Extract the first element as an object
        }
      },
      { $unset: 'membersArray' },
      {
        $group: {
          _id: "$_id", // Group by the _id field of the Conversation collection
          participants: { $first: "$participants" }, // Retain the participants field for the group
          timestamp: { $first: "$timestamp" }, // Retain the timestamp field for the group
          members: { $push: "$members" }, // Collect the members array for each group
        }
      },
      {
        $addFields: {
          conversationId: "$_id", // Rename _id to conversationId
          sortedMessages: [],
          unread: 5,
          isTyping: { status: false, text: '' },
          unreads: []

        }
      },
      {
        $lookup: {
          from: 'chats',
          let: { conversationId: "$conversationId" },
          pipeline: [
            {
              $match: {
                $expr: { $eq: ["$conversationId", "$$conversationId"] }
              }
            },
            {
              $sort: { timestamp: -1 } // Sort messages by timestamp in descending order
            },
            {
              $limit: 5 // Retrieve only the latest 5 messages
            }
          ],
          as: 'sortedMessages'
        }
      },
      {
        $lookup: {
          from: 'chats',
          let: { conversationId: "$conversationId" },
          pipeline: [
            {
              $match: {
                $expr: { $eq: ["$conversationId", "$$conversationId"] },
                status: 'sent'
              }
            },
            {
              $sort: { timestamp: -1 } // Sort messages by timestamp in descending order
            },

          ],
          as: 'unreads'
        }
      }

    ]);

    console.log('conversations are', conversations);


    // Now conversations should contain details for participants other than the current user
    return conversations
  }
  catch (err) {
    throw "Not_found";
  }
}


async function updateConversationTime(conversation) {
  try {
    const updatedConversation = await Conversation.findByIdAndUpdate(
      conversation.conversationId,
      {
        $set: {
          timestamp: new Date(),
        },
      },
      { new: true }
    );

    const unreadMessages = await Chat.aggregate([
      {
        $match: {
          conversationId: new mongoose.Types.ObjectId(conversation.conversationId),
          status: { $ne: 'read' } // Filter messages with status not equal to 'read'
        }
      },
      {
        $sort: { timestamp: -1 } // Sort messages by timestamp in descending order
      },
    ]);

    return {
      conversationId: conversation.conversationId,
      unreads: unreadMessages,
      timestamp: updatedConversation.timestamp,
      sortedMessages: unreadMessages[0]
    };
  } catch (error) {
    // Handle the error appropriately
    console.error('Error in updateConversationTime:', error);
    throw error; // Re-throw the error to propagate it up the call stack if needed
  }
}

async function updateUnreadMessage(id) {
  try {


    const unreadMessages = await Chat.aggregate([
      {
        $match: {
          conversationId: new mongoose.Types.ObjectId(id),
          status: { $ne: 'read' } // Filter messages with status not equal to 'read'
        }
      },
      {
        $sort: { timestamp: -1 } // Sort messages by timestamp in descending order
      },
    ]);

    return {
      conversationId: id,
      unreads: unreadMessages,
      sortedMessages: unreadMessages[0]
    };
  } catch (error) {
    // Handle the error appropriately
    console.error('Error in updateUnreadMessage:', error);
    throw error; // Re-throw the error to propagate it up the call stack if needed
  }
}
