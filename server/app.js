

const express = require("express");
const app = express();
const { default: mongoose } = require('mongoose');
const bodyParser = require('body-parser');
const http = require('http');
const server = http.createServer(app);
const sio = require('socket.io')(server, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST']
    }
});
const cors = require("cors");
const { User } = require("./helpers/db");
const { postMessage } = require("./chat/chat.service");

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
    origin: "*",
    optionsSuccessStatus: 200
}

app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/users', require('./users/user.controller'))
app.use('/chat', require('./chat/chat.controller'))
app.use('/conversation', require('./conversation/conversation.controller'))





// mongoConnectWithRetry()


server.listen(4200, function () {
    console.log("Server is listening on 4200");
});




sio.on('connection', function (socket) {
    console.log(`User ${socket.id} connected`);



    socket.on('disconnect', async () => {
        console.log('user disconnected:', socket.id);
        // await socketService.create({ socket: socket.id, connect: false });
        // socket.leave('room_' + connections[socket.id]);
        // delete connections[socket.id];
    });




    socket.on("joinRoom", ({ conversationId, user }) => {
        socket.join(conversationId);
        console.log('socket.join(conversationId)', socket.join(conversationId));
        console.log(`${user.name} has join the room with ${conversationId}`)
    })


    socket.on('isChatting', async (messageData) => {
        socket.to(messageData.conversationId).emit('isChatting', messageData)
    })


    socket.on('message', async (messageData) => {

        // Save message to the database if needed
        await postMessage(messageData)

        //    await  postMessage(messageData)
        // Emit the message to the conversation room
        socket.nsp.to(messageData.conversationId).emit('message', messageData);

        console.error('messageData is', messageData);


    });







})