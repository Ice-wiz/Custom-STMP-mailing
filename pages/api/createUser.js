
import User from './models/User';

const createUser = async () => {
    const newUser = new User({
        username: 'john_doe',
        smtpUser: 'john.smtp@example.com',
        smtpPass: 'password123',
        host: 'smtp.example.com',
        smtpPort: 587,
        SentEmails: [],
        ReceivedEmails: []
    });
    
    await newUser.save();
    console.log('User created:', newUser);
};
console.log("hi")
createUser();
