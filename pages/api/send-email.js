import nodemailer from 'nodemailer';
import { MongoClient } from 'mongodb';

const clientPromise = new MongoClient(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true ,serverSelectionTimeoutMS: 5000}).connect();

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).send('Method Not Allowed');
    }

    const { recipient, subject, body , senderName , smtpUser , smtpPass , host , smtpPort } = req.body;
    console.log(senderName)

    // Generate a unique reference code
    const referenceCode = `REF-${Date.now()}`;

    // Append reference code to the subject
    const subjectWithRef = `${subject} [${referenceCode}]`;

    // Create SMTP transporter with environment variables
    let transporter = nodemailer.createTransport({
        host: host,
        port: smtpPort,
        secure: false, // false for STARTTLS
        auth: {
            user: smtpUser,
            pass: smtpPass
        }
    });

    // Email options
    let mailOptions = {
        from: `"${senderName}" <${smtpUser}>`, // Sender address
        to: recipient, // List of recipients
        subject: subjectWithRef, // Subject line
        text: body, // Plain text body
        html: `<p>${body}</p>` // HTML body
    };

    try {
        // Attempt to send the email
        let info = await transporter.sendMail(mailOptions);

        // Connect to MongoDB and store the email details
        const client = await clientPromise;
        const db = client.db();
        const collection = db.collection('sentEmails');
        
        await collection.insertOne({
            smtpUser: smtpUser,
            senderName,
            recipient,
            subject: subjectWithRef,
            body,
            referenceCode,
            status: 'sent',
            messageId: info.messageId
        });

        res.status(200).json({ message: 'Email sent', info });
    } catch (error) {
        console.error('Error sending email:', error); // Log the error
        res.status(500).json({ message: 'Error sending email', error: error.message });
    }
}
