import mongoose from 'mongoose'


const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
    },
    smtpUser: {
        type: String,
        required: true,
    },
    smtpPass: {
        type: String,
        required: true,
    },
    host: {
        type: String,
        required: true,
    },
    smtpPort: {
        type: Number,
        required: true,
    },

    SentEmails: {
        type: Array,
        default: []
    },
    ReceivedEmails: {
        type: Array,
        default: []
    },
    ImapPort:{
        type:Number,
        default:993
    }

}, { timestamps: true });

// Create and export the User model
const User = mongoose.models.User || mongoose.model('User', userSchema);



export default User;