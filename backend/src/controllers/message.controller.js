import cloudinary from "../lib/cloudinary.js";
import Message from "../models/message.model.js";
import User from "../models/user.model.js";

export const getUsersForSidebar = async (req, res) => {
    try {
        const loggedInUserId = req.user._id;
        const filterUsers = (await User.find({ _id: { $ne: loggedInUserId } })).select("-password");
    
        res.status(200).json(filterUsers);
    } catch (error) {
     console.log("error in getUsersForSidebar controller", error.message);
     res.status(500).json({ error: "Internal server Error" });  
    }
}

export const getMessages = async (req, res) => {
    try {
        const { id: userToChatId } = req.params;
        const myId = req.user._id;

        const messages = await Message.find({
            $or: [
                { senderId: myId, recieverId: userToChatId },
                { senderId: userToChatId, recieverId: myId },
            ],
        });

        res.status(200).json(messages);
    } catch (error) {
        console.log("error in getMessages controller", error.message);
        res.status(500).json({ error: "Internal server Error" });  
    }
}

export const sendMessage = async (req, res) => {
    try {
        const { text, image } = req.body;
        const { id: recieverId } = req.params;
        const senderId = req.user._id;

        let imageUrl;
        if(image) {
            const uploadresponse = await cloudinary.uploader.upload(image);
            imageUrl = uploadresponse.secure_url;
        }

        const newMessage = new Message({
            senderId,
            recieverId,
            text,
            image: imageUrl,
        });

        await newMessage.save();

        //TODO: soket.io here
        
        res.status(201).json(newMessage);
    } catch (error) {
        console.log("error in sendMessages controller", error.message);
        res.status(500).json({ error: "Internal server Error" });  
    }
}