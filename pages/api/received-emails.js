// pages/api/received-emails.js

import clientPromise from '../../lib/mongodb';

export default async function handler(req, res) {
    if (req.method !== 'GET') {
        return res.status(405).send('Method Not Allowed');
    }

    try {
        const client = await clientPromise;
        const db = client.db();
        const collection = db.collection('receivedEmails');

        const emails = await collection.find({}).toArray();

        res.status(200).json(emails);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching emails', error: error.message });
    }
}
