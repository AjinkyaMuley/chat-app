import { Server } from "socket.io";
import http from 'http'
import express from 'express'


const app = express();

const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: ["http://localhost:3000"],
        methods: ["GET", "POST"]
    }
});


export const getRecieverSocketId  = (recieverId) => {
    return userSocketMap[recieverId]        //return recievers socket id from the recievers id
}

const userSocketMap = {}; //{userId : socketId}

io.on('connection', (socket) => {        //listening for the connections
    console.log("A user connected", socket.id);

    const userId = socket.handshake.query.userId;  //get the user id from the request query parameter

    if (userId !== "undefined") {                   //if a valid user id is provided then add it to the map
        userSocketMap[userId] = socket.id;          //map
    }
    //socket.on() is used to listen to the events . can be used both on client and server side

    io.emit("getOnlineUsers", Object.keys(userSocketMap));//send online users info to all clients when a new user connects . io.emit() is used to send events to all  the connected clients

    socket.on("disconnect", () => {
        console.log("User disconnected ", socket.id)
        delete userSocketMap[userId];
        io.emit("getOnlineUsers", Object.keys(userSocketMap))
    })
})

export { app, io, server };