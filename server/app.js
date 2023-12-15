

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
const { postMessage, updateMessage } = require("./chat/chat.service");
const { updateConversationTime, updateUnreadMessage } = require("./conversation/conversation.service");
const { validateToken } = require('./helpers/jwt')


var corsOptions = {
    origin: "*",
    optionsSuccessStatus: 200
}

app.use(cors(corsOptions));


app.use(validateToken)


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/users', require('./users/user.controller'))
app.use('/chat', require('./chat/chat.controller'))
app.use('/conversation', require('./conversation/conversation.controller'))





// mongoConnectWithRetry()


server.listen(4200, function () {
    console.log("Server is listening on 4200");
});


const userRooms = new Map();

sio.on('connection', function (socket) {
    console.log(`User ${socket.id} connected`);

    socket.on('add-user', async (user) => {


        const userRoom = user._id;
        socket.join(userRoom);
        userRooms.set(user._id, userRoom);

        socket.emit('add-user', `You are connected with ${userRoom}`);
    })


    socket.on('disconnect', async (user) => {
        console.log('user disconnected:', socket.id, user);
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
        console.log('isChatting is recieing', messageData);
        socket.to(messageData.conversationId).emit('isChatting', messageData)
    })


    socket.on('update-message', async (message) => {
        console.log('message emiting', message);
        let id = message._id;
        let body = { _id: message._id, status: message.status }

        const updatesMessage = await updateMessage(id, body);
        const recipientId = message.recipientId;
        const recipientPersonalRoom = userRooms.get(recipientId);

        if (recipientPersonalRoom) {
            sio.to(recipientPersonalRoom).emit('update-message', updatesMessage);
        } else {
            console.log('user is not online');
        }

        const senderId = message.senderId;
        const senderPersonalRoom = userRooms.get(senderId);



        if (senderPersonalRoom) {
            sio.to(senderPersonalRoom).emit('update-status-of-message', updatesMessage)
        } else {
            console.log('user is not online');
        }
    })


    socket.on('update-all-messages-status', async (message) => {

        const senderId = message.senderId;
        const senderPersonalRoom = userRooms.get(senderId);



        if (senderPersonalRoom) {
            sio.to(senderPersonalRoom).emit('update-all-messages-status', 'update all to read')
        } else {
            console.log('user is not online');
        }
    })



    socket.on('message', async (messageData) => {

        // Save message to the database if needed
        let newMessage = await postMessage(messageData);
        console.log('newMessage', newMessage);
        let updatedCon = await updateConversationTime(messageData);
        const recipientId = messageData.recipientId;
        const recipientPersonalRoom = userRooms.get(recipientId);
        const message = { ...messageData, 'timestamp': Date.now() };

        if (recipientPersonalRoom) {
            // Emit the private message to the recipient's personal room
            sio.to(recipientPersonalRoom).emit('privateMessage', { 'conversation': updatedCon, "message": message });
        } else {
            // Handle the case where the recipient is not online
            console.log(`Recipient ${recipientId} is not online.`);
            // You might consider sending a push notification or using another mechanism here
        }


        //    await  postMessage(messageData)
        // Emit the message to the conversation room
        sio.to(messageData.conversationId).emit('message', newMessage);

        console.error('messageData is', messageData);


    });







})