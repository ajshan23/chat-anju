import mongoose from "mongoose";
import Conversation from "../models/conversationModel.js";
import Message from "../models/messageModel.js";
import User from "../models/userModel.js";
import { getOnlineUserSocketIdByUserId } from "../app.js";


export const getConversations = async (req, res) => {
    const userId = req.user._id;
    try {
        const conversation = await Conversation.find({
            participants: { $all: [userId] }
        }).populate("participants", "username email")
            .populate("lastMessage")
            .sort({ updatedAt: -1 });

        res.status(200).json({ message: "success", conversation: conversation });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Server Error" });
    }
}

export const getMessagesOfAConversation = async (req, res) => {
    const conversationId = req.query.conversationId;
    try {
        if (!conversationId) {
            return res.status(400).json({ message: "please provide conversaiton Id" })
        }

        const conversation = await Message.find({ conversationId: conversationId });
        res.status(200).json({ message: "success", messages: conversation });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Server Error" });
    }
}

export const sendMessage = async (req, res) => {
    try {
        const { conversationId, message, recieverId } = req.body;
        const sender = req.user._id;
        if (!message || !recieverId || !sender) {
            return res.status(400).json({ message: "please provide conversationId and message" })
        }
        let conversation;
        if (conversationId) {
            conversation = await Conversation.findById(conversationId);
        } else {
            conversation = new Conversation({
                participants: [sender, recieverId]
            })
        }
        const newMessage = new Message({
            conversationId: conversation._id,
            sender: sender,
            message: message
        });
        conversation.lastMessage = newMessage._id;
        await conversation.save();
        await newMessage.save();
        const recieverSocketId=getOnlineUserSocketIdByUserId(recieverId);
        if(recieverSocketId){
            io.to(recieverSocketId).emit('newMessage', newMessage)
        }
        res.status(201).json({ message: "Message sent successfully" });


    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Server Error" });
    }
}


export const getAlluserExeptlogginedUser = async (req, res) => {
    const userId = req.user._id;
    try {
        const users = await User.find({
            _id: {
                $ne: userId
            }
        })

        res.status(200).json({ message: "success", users })
    } catch (error) {

    }
}