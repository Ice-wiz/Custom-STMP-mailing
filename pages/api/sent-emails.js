import clientPromise from '../../lib/mongodb';

export default async function handler(req, res) {
    if (req.method !== 'GET') {
        return res.status(405).json({ message: 'Method Not Allowed' });
    }

    try {
        const client = await clientPromise;
        const db = client.db();
        const collection = db.collection('sentEmails');

        const emails = await collection.find({}).toArray();

        res.status(200).json(emails);
    } catch (error) {
        console.error('Error fetching emails:', error);
        res.status(500).json({ message: 'Error fetching emails', error: error.message });
    }
}
