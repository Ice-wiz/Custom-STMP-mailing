
import { useState } from 'react';
import axios from 'axios';
import Link from 'next/link';


export default function SendEmail() {
    const [recipient, setRecipient] = useState('');
    const [senderName, setSenderName] = useState(''); // Already present
    const [subject, setSubject] = useState('');
    const [body, setBody] = useState('');
    const [status, setStatus] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus('Sending...');

        try {
            const response = await axios.post('/api/send-email', {
                senderName,
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
        <div className="min-h-screen flex items-center justify-center bg-slate-100">
            <div className="max-w-md w-full p-8 bg-white rounded-lg shadow-lg">
                <h1 className="text-3xl font-bold mb-6 text-center">Send Email</h1>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700">Sender Name:</label>
                        <input
                            type="text"
                            value={senderName}
                            onChange={(e) => setSenderName(e.target.value)}
                            required
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700">Recipient Email:</label>
                        <input
                            type="email"
                            value={recipient}
                            onChange={(e) => setRecipient(e.target.value)}
                            required
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700">Subject:</label>
                        <input
                            type="text"
                            value={subject}
                            onChange={(e) => setSubject(e.target.value)}
                            required
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700">Body:</label>
                        <textarea
                            value={body}
                            onChange={(e) => setBody(e.target.value)}
                            required
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        ></textarea>
                    </div>
                    <button
                        type="submit"
                        className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                        Send Email
                    </button>
                </form>
                {status && <p className="mt-4 text-sm text-gray-600">{status}</p>}
                <div className="mt-6 flex justify-between">
                    <Link href="/">
                        <div className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded text-center">
                            Dashboard
                        </div>
                    </Link>
                    <Link href="/sent-emails">
                        <div className="bg-purple-500 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded text-center">
                            Sent Emails
                        </div>
                    </Link>
                </div>
            </div>
        </div>
    );
}