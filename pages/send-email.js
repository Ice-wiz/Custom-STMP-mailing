import { useState } from 'react';
import axios from 'axios';
import Link from 'next/link';

export default function SendEmail() {
    // State for SMTP authentication details
    const [smtpUser, setSmtpUser] = useState('');
    const [smtpPass, setSmtpPass] = useState('');
    const [host, setHost] = useState('');
    const [smtpPort, setSmtpPort] = useState('');

    // State for email details
    const [recipient, setRecipient] = useState('');
    const [senderName, setSenderName] = useState('');
    const [subject, setSubject] = useState('');
    const [body, setBody] = useState('');
    const [status, setStatus] = useState('');
    const [smtpStatus, setSmtpStatus] = useState('');
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    // Handle form submission for saving SMTP details
    const handleSaveDetails = async (e) => {
        e.preventDefault();
        setSmtpStatus('Saving...');

        try {
            const response = await axios.post('/api/save-creds', {
                smtpUser,
                smtpPass,
                host,
                smtpPort
            });
            setSmtpStatus('SMTP Credentials saved successfully');
            setIsAuthenticated(true);
            console.log(response.data); // Log success response
        } catch (error) {
            setSmtpStatus(`Error saving SMTP Credentials: ${error.response ? error.response.data.message : error.message}`);
        }
    };

    // Handle email submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus('Sending...');

        try {
            const response = await axios.post('/api/send-email', {
                smtpUser,
                smtpPass,
                host,
                smtpPort,
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

    // Handle reset
    const handleReset = () => {
        setSmtpUser('');
        setSmtpPass('');
        setHost('');
        setSmtpPort('');
        setRecipient('');
        setSenderName('');
        setSubject('');
        setBody('');
        setStatus('');
        setSmtpStatus('');
        setIsAuthenticated(false);
        localStorage.removeItem('user');
    };

    return (
        <div className="py-2 min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-500 to-green-400">
            <div className="max-w-4xl w-full p-6 bg-white rounded-lg shadow-lg grid grid-cols-2 gap-8">
                <div className="p-6 bg-gray-50 rounded-lg shadow-md">
                    <h1 className="text-2xl font-bold mb-4 text-center">SMTP Authentication</h1>
                    <form onSubmit={handleSaveDetails}>
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700">SMTP User:</label>
                            <input
                                type="text"
                                value={smtpUser}
                                onChange={(e) => setSmtpUser(e.target.value)}
                                required
                                disabled={isAuthenticated}
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700">SMTP Password:</label>
                            <input
                                type="password"
                                value={smtpPass}
                                onChange={(e) => setSmtpPass(e.target.value)}
                                required
                                disabled={isAuthenticated}
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700">SMTP Host:</label>
                            <input
                                type="text"
                                value={host}
                                onChange={(e) => setHost(e.target.value)}
                                required
                                disabled={isAuthenticated}
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700">SMTP Port:</label>
                            <input
                                type="text"
                                value={smtpPort}
                                onChange={(e) => setSmtpPort(e.target.value)}
                                required
                                disabled={isAuthenticated}
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            />
                        </div>
                        <button
                            type="submit"
                            className={`w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${isAuthenticated ? 'bg-green-600' : 'bg-gray-500'} hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}
                            disabled={isAuthenticated}
                        >
                            {isAuthenticated ? 'Authenticated' : 'Save Details'}
                        </button>
                    </form>
                    {smtpStatus && (
                        <p className={`mt-4 text-sm ${smtpStatus.startsWith('Error') ? 'text-red-600' : 'text-green-600'}`}>{smtpStatus}</p>
                    )}
                </div>

                <div className="p-6 bg-gray-50 rounded-lg shadow-md">
                    <h1 className="text-2xl font-bold mb-4 text-center">Send Email</h1>
                    <form onSubmit={handleSubmit}>
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700">Sender Name:</label>
                            <input
                                type="text"
                                value={senderName}
                                onChange={(e) => setSenderName(e.target.value)}
                                required
                                disabled={!isAuthenticated}
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
                                disabled={!isAuthenticated}
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
                                disabled={!isAuthenticated}
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700">Body:</label>
                            <textarea
                                value={body}
                                onChange={(e) => setBody(e.target.value)}
                                required
                                disabled={!isAuthenticated}
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            ></textarea>
                        </div>
                        <button
                            type="submit"
                            className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                            disabled={!isAuthenticated}
                        >
                            Send Email
                        </button>
                    </form>
                    {status && (
                        <p className={`mt-4 text-sm ${status.startsWith('Error') ? 'text-red-600' : 'text-green-600'}`}>{status}</p>
                    )}
                </div>
                
                <div className="col-span-2 mt-6 flex justify-between">
                    <button
                        onClick={handleReset}
                        className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                    >
                        Reset
                    </button>
                    <div className="flex space-x-4">
                        <Link href="/sent-emails">
                            <div className="bg-purple-500 hover:bg-purple-700 text-white                             font-bold py-2 px-4 rounded text-center">
                                Sent Emails
                            </div>
                        </Link>
                        <Link href="/">
                            <div className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded text-center">
                                Go to Dashboard
                            </div>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}

