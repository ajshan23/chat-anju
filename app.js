import express from 'express';
import http from "http";
import { Server } from "socket.io"
import NodeCache from "node-cache";
const app = express();

app.use(express.urlencoded({
    extended: true
}));


app.use(express.json());


const server = http.createServer(app)
const io = new Server(server)

const myCache = new NodeCache();
//userid:socketid


io.on("connect", (socket) => {
    console.log('Number of connected clients:', io.engine.clientsCount);
    console.log('A USER is CONNECTED', socket.id, socket.handshake.query.userId);
    const userId = socket.handshake.query?.userId;
    if (userId) {
        myCache.set(userId, socket.id);
    } else {
        socket.disconnect();
    }

    io.emit("onlineUsers", myCache.keys())

    io.on("disconnect", () => {
        console.log("disconnected")
        myCache.del(userId);
        io.emit("onlineUsers", myCache.keys())
    })
})
export const getOnlineUserSocketIdByUserId = async (id) => {
    try {
        let userSocketId = myCache.get(id)
        return userSocketId;

    } catch (error) {
        return null;
    }

}

export { app, server, io };