import { useEffect, useState } from 'react';
import axios from 'axios';
import Link from 'next/link';

const ReceivedEmails = () => {
    const [emails, setEmails] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    localStorage.getItem('user');

    useEffect(() => {
        const fetchEmails = async () => {
            try {
                const response = await axios.get('/api/received-emails');
                setEmails(response.data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching emails:', error);
                setError('Error fetching emails');
                setLoading(false);
            }
        };

        fetchEmails();
    }, []);


    return (
        <div className="min-h-screen bg-gradient-to-r from-blue-500 to-green-400 flex flex-col items-center py-8">
            <div className="bg-white shadow-md rounded-lg p-6 w-full max-w-4xl relative">
                
                <Link href="/" passHref>
                    <button className="absolute top-4 right-4 bg-slate-700 text-white py-2 px-4 rounded-lg shadow-lg hover:bg-slate-600 transition">
                        Dashboard
                    </button>
                </Link>
                
                <h1 className="text-2xl font-bold text-slate-800 mb-6 text-center">Received Emails</h1>
                {loading ? (
                    <p className="text-gray-600 text-center">Loading...</p>
                ) : error ? (
                    <p className="text-red-500 text-center mb-4">{error}</p>
                ) : emails.length === 0 ? (
                    <p className="text-gray-600 text-center">No emails found.</p>
                ) : (
                    <div className="space-y-6">
                        {emails.slice().reverse().map((email, index) => (
                            <div key={index} className="bg-slate-50 p-4 rounded-lg shadow-sm border border-slate-200">
                                <div className="flex items-center mb-4">
                                    <div className="w-12 h-12 rounded-full bg-slate-700 text-white flex items-center justify-center mr-4">
                                        {email.from[0].toUpperCase()}
                                    </div>
                                    <div>
                                        <p className="text-lg font-semibold text-slate-700">{email.name}</p>
                                        <p className="text-slate-600">{email.from}</p>
                                    </div>
                                </div>
                                <div className="mb-4">
                                    <p className="font-semibold text-slate-700">Subject:</p>
                                    <p className="text-slate-800">{email.subject}</p>
                                </div>
                                <div className="mb-4">
                                    <p className="font-semibold text-slate-700">Body:</p>
                                    <p className="text-slate-800">{email.body}</p>
                                </div>
                                <div>
                                    <p className="font-semibold text-slate-700">Date:</p>
                                    <p className="text-slate-500">{new Date(email.date).toLocaleString()}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ReceivedEmails;
