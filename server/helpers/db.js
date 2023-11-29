const mongoose = require('mongoose');

const connectdb = () => {
    return mongoose.connect('mongodb+srv://arslanghaffar21:Artistopedia@chat.mj5sjij.mongodb.net/?retryWrites=true&w=majority', {
        serverSelectionTimeoutMS: 5000, // Increase the server selection timeout

    }).then(() => console.log('Mongodb is connected'))
    .catch((err) => {
        console.error("Connection to MongoDB failed:", err);
        setTimeout(connectdb, 10000);
    })
}

connectdb();

module.exports = {
    User : require('../users/user.model'),
    Chat : require("../chat/chat.model"),
    Conversation : require("../conversation/conversation.model")
}