const db = require("../helpers/db")
const Conversation = db.Conversation;

module.exports = {
    getAll,
    getById,
    create,
    createIfNotExist,
    checkByParticipants
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

        let isExist = await Conversation.find({ participants: participants })

        if(isExist){
            return isExist
        }

        let _conversation = new Conversation(participants);
        _conversation.save();

        return _conversation

    }
    catch (err) {
        throw err
    }
}

