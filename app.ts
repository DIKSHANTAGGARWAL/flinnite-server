import "reflect-metadata"
import express from 'express';
import cors from 'cors';
import dotenv from "dotenv";


import AppDataSource from "./config";
import { userRoutes } from './auth/routes';
import { engageRoutes } from "./engage/routes";

const app = express()
app.use(express.json());


app.use(
    cors({
        origin: "*",
    })
);

dotenv.config();


app.use("/auth", userRoutes)
app.use("/engage", engageRoutes)


//socket
import http from 'http'
import { Server } from 'socket.io';
import Message from "./entities/message";
import User from "./entities/user";
import Group from "./entities/group";
const server = http.createServer(app);
const io = new Server(server);

const messageRepo = AppDataSource.getRepository(Message);
const userRepo = AppDataSource.getRepository(User);
const groupRepo = AppDataSource.getRepository(Group);

io.on('connection', (socket) => {
    console.log('A user connected');

    // Join group room
    socket.on('joinGroup', async (groupId) => {
        const group = await groupRepo.findOne({ where: { group_id: groupId } });
        if (group) {
            socket.join(groupId);  // Join group room
            // Retrieve chat history
            const messages = await messageRepo.find({ 
                where: { group: groupId },
                relations: ['sender'],
                order: { timestamp: 'ASC' }
            });
            socket.emit('chatHistory', messages); // Send chat history to user
        }
    });

    // Handle new message
    socket.on('sendMessage', async ({ groupId, userEmail, content }) => {
        const user = await userRepo.findOne({ where: { email:userEmail } });
        const group = await groupRepo.findOne({ where: { group_id: groupId } });
        
        if (user && group) {
            const newMessage = new Message();
            newMessage.content = content;
            newMessage.sender = user.email;
            newMessage.group = group;
            newMessage.timestamp = new Date();

            await messageRepo.save(newMessage);  // Store in DB

            // Broadcast to group
            io.to(groupId).emit('newMessage', { 
                content, 
                sender: user.email, 
                timestamp: newMessage.timestamp 
            });
        }
    });

    // Disconnect user
    socket.on('disconnect', () => {
        console.log('User disconnected');
    });
});

const port = 5000;

AppDataSource.initialize()
    .then(() => {
        app.listen(port, () => {
            console.log(`Server is running on port ${port}`);
        });
    })
    .catch((err: any) => console.log("error", err));
