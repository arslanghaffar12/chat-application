

const express = require("express");
const app = express();
const { default: mongoose } = require('mongoose');
const bodyParser = require('body-parser');
const cors = require("cors")


// const mongoConnectWithRetry = () => {
//     return mongoose.connect("mongodb://127.0.0.1:27017/chat", {
//         serverSelectionTimeoutMS: 5000, // Increase the server selection timeout
//     })
//         .then(() => console.log("Connected to MongoDB"))
//         .catch((err) => {
//             console.error("Connection to MongoDB failed:", err);
//             setTimeout(mongoConnectWithRetry, 10000);
//         });
// };

// mongoConnectWithRetry();

// Use body-parser middleware

var corsOptions = {
    origin : "*",
    optionsSuccessStatus : 200
}

app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/users', require('./users/user.controller'))
app.use('/chat', require('./chat/chat.controller'))
app.use('/conversation', require('./conversation/conversation.controller'))





// mongoConnectWithRetry()


app.listen(4200, function () {
    console.log("Server is listening on 4200");
});


