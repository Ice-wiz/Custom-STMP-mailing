import { useEffect, useState } from 'react';
import axios from 'axios';

const ReceivedEmails = () => {
    const [emails, setEmails] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchEmails = async () => {
            try {
                const response = await axios.get('/api/received-emails');
                setEmails(response.data);
            } catch (error) {
                console.error('Error fetching emails:', error);
                setError('Error fetching emails');
            }
        };

        fetchEmails();
    }, []);

    return (
        <div>
            <h1>Received Emails</h1>
            {error && <p>{error}</p>}
            <ul>
                {emails.map((email, index) => (
                    <li key={index}>
                        <p>From: {email.from}</p>
                        <p>Name: {email.name}</p>
                        <p>Subject: {email.subject}</p>
                        <p>Body: {email.body}</p>
                        <p>Date: {email.date}</p>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default ReceivedEmails;
