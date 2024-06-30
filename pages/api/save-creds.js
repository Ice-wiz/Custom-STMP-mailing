import User from '@/models/user.model';
import { MongoClient } from 'mongodb';

const clientPromise = MongoClient.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).send('Method Not Allowed');
    }

    const { smtpUser, smtpPass, host, smtpPort } = req.body;

    try {
        // Connect to MongoDB
        const client = await clientPromise;
        const db = client.db();

        // Check if the email details are already stored
        const existingDetails = await db.collection('users').findOne({
            smtpUser,
            smtpPass,
            host,
            smtpPort,
        });

        if (existingDetails) {
            return res.status(200).json({ message: 'Email details already stored , Success' });
        }

        // Store the email details if they are not already in the database
        await db.collection('users').insertOne({
            smtpUser,
            smtpPass,
            host,
            smtpPort,
        });

        localStorage.setItem("user",smtpUser);
        console.log(localStorage.getItem('user'))

        res.status(200).json({ message: 'Email details stored successfully' });
    } catch (error) {
        console.error('Error storing email details:', error); // Log the error
        res.status(500).json({ message: 'Error storing email details', error: error.message });
    }
}
