// pages/api/send-email.js

import nodemailer from 'nodemailer';
import { MongoClient } from 'mongodb';

const clientPromise = new MongoClient(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true }).connect();

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).send('Method Not Allowed');
    }

    const { smtpUser, smtpPass, recipient, subject, body } = req.body;

    // Generate a unique reference code
    const referenceCode = `REF-${Date.now()}`;

    // Append reference code to the subject
    const subjectWithRef = `${subject} [${referenceCode}]`;

    // Create SMTP transporter with user's credentials
    let transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT,
        secure: false, // false for STARTTLS
        auth: {
            user: smtpUser,
            pass: smtpPass
        }
    });

    // Email options
    let mailOptions = {
        from: `"Your Name" <${smtpUser}>`, // Sender address
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
            smtpUser,
            recipient,
            subject: subjectWithRef,
            body,
            referenceCode,
            status: 'sent',
            messageId: info.messageId
        });

        res.status(200).json({ message: 'Email sent', info });
    } catch (error) {
        res.status(500).json({ message: 'Error sending email', error: error.message });
    }
}
