import Conversation from "../models/conservation.model.js";
import Message from "../models/message.model.js";

export const sendMessage = async (req, res) => {
    try {
        const { message } = req.body
        const { id: recieverId } = req.params;
        const senderId = req.user._id;

        let conversation = await Conversation.findOne({
            participants: { $all: [senderId, recieverId] }, //find the data where participants array contains the value of senderId and recieverId
        })

        if (!conversation) {
            conversation = await Conversation.create({
                participants: [senderId, recieverId]
            })
        }

        const newMessage = new Message({
            senderId,
            recieverId,
            message,
        })

        if (newMessage) {
            conversation.messages.push(newMessage._id);
        }

        // await conversation.save()
        // await newMessage.save()

        await Promise.all([conversation.save(),newMessage.save()])  //this done so that  both the conversation and messages get saved at once to avoid any unhandled promise rejection errors reduces time as both of them runs paralley

        return res.status(201).json(newMessage)

    } catch (error) {
        console.log("error in sendMessage controller ", error.message)
        res.status(500).json({ error: "internal server error" })
    }
}

export const getMessages = async (req,res) => {
    try {
        
        const {id : userToChatId}  = req.params;
        const senderId = req.user._id;

        const conversation = await Conversation.findOne({
            participants : {$all : [senderId,userToChatId]},
        }).populate("messages"); //this will now instead of returning msg ids it will now return array of objects containing the messages. RETURNS ACTUAL MESSAGES NOT REFERENECE

        if(!conversation) return res.status(200).json([]);

        const messages = conversation.messages;

        res.status(200).json(messages)

    } catch (error) {
        console.log("error in getMessage controller ", error.message)
        res.status(500).json({ error: "internal server error" })
    }
}