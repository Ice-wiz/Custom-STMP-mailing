import checkForEmails from '../../lib/recieveEmails';

export default async function handler(req, res) {
    if (req.method !== 'GET') {
        return res.status(405).send('Method Not Allowed');
    }

    try {
        await checkForEmails();
        res.status(200).json({ message: 'Checked for emails and processed accordingly.' });
    } catch (error) {
        res.status(500).json({ message: 'Error checking emails', error: error.message });
    }
}
