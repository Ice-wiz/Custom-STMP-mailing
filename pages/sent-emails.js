// pages/sent-emails.js

import { useEffect, useState } from 'react';
import axios from 'axios';

export default function SentEmails() {
    const [emails, setEmails] = useState([]);

    useEffect(() => {
        const fetchEmails = async () => {
            const response = await axios.get('/api/sent-emails');
            setEmails(response.data);
        };

        fetchEmails();
    }, []);

    return (
        <div style={{ maxWidth: '600px', margin: '0 auto', padding: '20px' }}>
            <h1>Sent Emails</h1>
            <ul>
                {emails.map((email, index) => (
                    <li key={index}>
                        <h2>{email.subject}</h2>
                        <p><strong>To:</strong> {email.recipient}</p>
                        <p><strong>Status:</strong> {email.status}</p>
                        <p><strong>Reference Code:</strong> {email.referenceCode}</p>
                    </li>
                ))}
            </ul>
        </div>
    );
}
