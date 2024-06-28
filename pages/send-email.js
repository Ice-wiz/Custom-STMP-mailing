// pages/send-email.js

import { useState } from 'react';
import axios from 'axios';

export default function SendEmail() {
    const [smtpUser, setSmtpUser] = useState('');
    const [smtpPass, setSmtpPass] = useState('');
    const [recipient, setRecipient] = useState('');
    const [subject, setSubject] = useState('');
    const [body, setBody] = useState('');
    const [status, setStatus] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus('Sending...');

        try {
            const response = await axios.post('/api/send-email', {
                smtpUser,
                smtpPass,
                recipient,
                subject,
                body
            });
            setStatus(`Email sent successfully: ${response.data.info.messageId}`);
        } catch (error) {
            setStatus(`Error sending email: ${error.response ? error.response.data.message : error.message}`);
        }
    };

    return (
        <div style={{ maxWidth: '600px', margin: '0 auto', padding: '20px' }}>
            <h1>Send Email</h1>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>SMTP User (Email):</label>
                    <input
                        type="email"
                        value={smtpUser}
                        onChange={(e) => setSmtpUser(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>SMTP Password:</label>
                    <input
                        type="password"
                        value={smtpPass}
                        onChange={(e) => setSmtpPass(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>Recipient Email:</label>
                    <input
                        type="email"
                        value={recipient}
                        onChange={(e) => setRecipient(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>Subject:</label>
                    <input
                        type="text"
                        value={subject}
                        onChange={(e) => setSubject(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>Body:</label>
                    <textarea
                        value={body}
                        onChange={(e) => setBody(e.target.value)}
                        required
                    ></textarea>
                </div>
                <button type="submit">Send Email</button>
            </form>
            {status && <p>{status}</p>}
        </div>
    );
}
