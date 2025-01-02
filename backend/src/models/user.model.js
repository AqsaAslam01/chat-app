import mongoose, { Types } from "mongoose";

const userSchema = new mongoose.Schema(
    {
        email: {
            Type: String,
            required: true,
            unique: true,
        },
        fullname: {
            Type: String,
            required: true,
        },
        password: {
            Type: String,
            required: true,
            minlength: 6,
        },    
        profilePic: {
            Type: String,
            default: "",
        },
    },
    { timestamps: true }
);

const User = mongoose.model("User", userSchema);

export default User;