const db = require("../helpers/db")
const Conversation = db.Conversation;

module.exports = {
    getAll,
    getById,
    create,
    createIfNotExist,
    checkByParticipants,
    getByUser
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
                participantsDetails: {
                  $map: {
                    input: "$participants",
                    as: "participantId",
                    in: {
                      $let: {
                        vars: { participantDetails: { $toObjectId: "$$participantId" } },
                        in: {
                          $first: {
                            $filter: {
                              input: "$participantsDetails",
                              as: "participantDetail",
                              cond: {
                                $eq: ["$$participantDetail._id", "$$participantDetails"],
                              },
                            },
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
            {
              $unwind: "$participants",
            },
            {
              $match: { participants: { $ne: userId } },
            },
            {
              $lookup: {
                from: "users",
                let: { participantId: { $toObjectId: "$participants" } },
                pipeline: [
                  {
                    $match: {
                      $expr: {
                        $eq: ["$_id", "$$participantId"],
                      },
                    },
                  },
                ],
                as: "participantsDetails",
              },
            },
            {
              $unwind: "$participantsDetails",
            },
            {
              $group: {
                _id: "$_id",
                participants: { $push: "$participants" },
                timestamp: { $first: "$timestamp" },
                participantsDetails: { $push: "$participantsDetails" },
              },
            },
          ]);


        // Now conversations should contain details for participants other than the current user


        console.log("cvnIds===", conversations)
        return conversations
    }
    catch (err) {
        throw "Not_found";
    }
}

