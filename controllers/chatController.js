import mongoose from "mongoose";
import Conversation from "../models/conversationModel.js";
import Message from "../models/messageModel.js";
import User from "../models/userModel.js";
import { getOnlineUserSocketIdByUserId, io } from "../app.js";


export const getConversations = async (req, res) => {
    const userId = req.user._id;

    try {
        const conversations = await Conversation.find({
            participants: { $all: [userId] }
        })
            .populate("participants", "username email")
            .populate("lastMessage")
            .sort({ updatedAt: -1 });

        // Add the otherUser field to each conversation
        const formattedConversations = conversations.map((conversation) => {
            const otherUser = conversation.participants.find(
                (participant) => participant._id.toString() !== userId.toString()
            );
            return {
                ...conversation.toObject(),
                otherUser,
            };
        });

        res.status(200).json({ message: "success", conversations: formattedConversations });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Server Error" });
    }
};


export const getMessagesOfAConversation = async (req, res) => {
    let conversationId = req.query.conversationId;
    let recieverId = req.query.recieverId;
    try {

        if (!conversationId) {
            if (!recieverId) {
                return res.status(400).json({ message: "please provide reciever Id" })
            }
            const conversation = await Conversation.findOne({
                participants: {
                    $all: [req.user._id, recieverId]
                }
            });
            if (!conversation) {
                return res.status(200).json({ message: "No conversation found", messages: [], conversationId: "" });
            }
            conversationId = conversation._id;
        }

        const conversation = await Message.find({ conversationId: conversationId });
        res.status(200).json({ message: "success", messages: conversation, conversationId });
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
            text: message
        });
        conversation.lastMessage = newMessage._id;
        await conversation.save();
        await newMessage.save();
        const recieverSocketId = await getOnlineUserSocketIdByUserId(recieverId);
        console.log("onlineusers", recieverId, recieverSocketId);

        if (recieverSocketId) {
            io.to(recieverSocketId).emit('newMessage', newMessage)
        }
        res.status(201).json({ message: "Message sent successfully", conversationId: conversation._id, newMessage });


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