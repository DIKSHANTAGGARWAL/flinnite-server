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

    app.get("/",(req,res)=>{
        console.log("object")
        res.status(200).json({
            status: "200",
            message:"working"
        })
    })
    app.use("/auth", userRoutes)
    app.use("/engage", engageRoutes)


    //socket
    import http from 'http'
    import { Server } from 'socket.io';
    import Message from "./entities/message";
    import User from "./entities/user";
    import Group from "./entities/group";
    const server = http.createServer(app);
    const io = new Server(server, {
        cors: {
            origin: "*",  
            methods: ["GET", "POST"]
        }
    });

    const messageRepo = AppDataSource.getRepository(Message);
    const userRepo = AppDataSource.getRepository(User);
    const groupRepo = AppDataSource.getRepository(Group);

    io.on('connection', (socket) => {
        socket.on('joinGroup', async (groupId) => {
            try {
                console.log(groupId)
                const group = await groupRepo.findOne({ where: { group_id: groupId } });
                // console.log(group)

                if (group) {
                    socket.join(groupId);  // Join group room
                    // console.log("3+")
                    // Retrieve chat history
                    const messages = await messageRepo.find({
                        where: { group: { group_id: groupId } },
                        // relations: ['sender'],
                        order: { timestamp: 'ASC' }
                    });
                    // console.log(messages)
                    // console.log("messages56 ")
                    socket.emit('chatHistory', messages); 
                }
            } catch (error) {
                console.error("Error fetching messages:", error);
            }
        });

        socket.on('getGroupDetails', async (groupId) => {
            const group = await groupRepo.findOne({ where: { group_id: groupId }, relations: ['users'] });
            if (group) {
                const members = group.users.map(user => ({ email: user.email }));
                socket.emit('groupDetails', { name: group.name, members });
            }
        });

   
        socket.on('sendMessage', async ({ groupId, userEmail, content }) => {
            try {

                const user = await userRepo.findOne({ where: { email: userEmail } });
                const group = await groupRepo.findOne({ where: { group_id: groupId } });
                if (user && group) {
                    console.log(user)

                    const newMessage = new Message();
                    newMessage.content = content;
                    newMessage.sender = user.email;
                    newMessage.group = group;
                    newMessage.timestamp = new Date();
                    console.log(newMessage)

                    await messageRepo.save(newMessage); 

                  
                    io.to(groupId).emit('newMessage', {
                        content,
                        sender: user.email,
                        timestamp: newMessage.timestamp
                    });
                }
            } catch (error) {

            }

        });

        // interface GroupMembers {
        //     [groupId: string]: string[];
        // }
        
        // let groupMembers: GroupMembers = {};
        // socket.on('joinGroupCall', ({ groupId }: { groupId: string }) => {
        //     if (!groupMembers[groupId]) {
        //     groupMembers[groupId] = [];
        //     }
        //     // console.log("object")
        
        //     groupMembers[groupId].push(socket.id);
        //     const members = groupMembers[groupId].filter(
        //     (member) => member !== socket.id
        //     );
        
        //     // Send existing group members to the newly joined user
        //     socket.emit('groupMembers', members);
        
        //     // Inform existing group members about the new peer
        //     members.forEach((memberId) => {
        //     io.to(memberId).emit('newPeer', socket.id);
        //     });
        // });
        
        // // Handle sending WebRTC signal to another peer
        // socket.on(
        //     'sendSignal',
        //     ({ userToSignal, callerID, signal }: { userToSignal: string; callerID: string; signal: any }) => {
        //     io.to(userToSignal).emit('receiveSignal', { signal, callerID });
        //     }
        // );
        
        // // Handle returning WebRTC signal
        // socket.on('returnSignal', ({ signal, callerID }: { signal: any; callerID: string }) => {
        //     io.to(callerID).emit('receiveSignal', { signal, id: socket.id });
        // });

        

        socket.on('disconnect', () => {
            console.log('User disconnected');
        });
    });

    const PORT = process.env.PORT || 5000;

    AppDataSource.initialize()
        .then(() => {
            server.listen(PORT, () => {
                console.log(`Server is running on port ${PORT}`);
            });
        })
        .catch((err: any) => console.log("error", err));
