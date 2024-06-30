import { useEffect, useState } from 'react';
import axios from 'axios';
import Link from 'next/link';

export default function SentEmails() {
    const [emails, setEmails] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchEmails = async () => {
            const response = await axios.get('/api/sent-emails');
            setEmails(response.data.reverse()); // Reverse the array here
            setLoading(false);
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

                <h1 className="text-2xl font-bold text-slate-800 mb-6 text-center">Sent Emails</h1>
                {loading ? (
                    <div className="flex justify-center items-center h-64">
                        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500"></div>
                    </div>
                ) : (
                    <ul className="space-y-6">
                        {emails.map((email, index) => (
                            <li key={index} className="bg-slate-50 p-4 rounded-lg shadow-sm border border-slate-200">
                                <div className="flex items-center mb-4">
                                    <div className="w-12 h-12 rounded-full bg-slate-700 text-white flex items-center justify-center mr-4">
                                        {email.smtpUser[0].toUpperCase()}
                                    </div>
                                    <div>
                                        <p className="text-slate-600">from</p>
                                        <p className="text-lg font-semibold text-slate-700">{email.smtpUser}</p>
                                    </div>
                                </div>
                                <div className="flex items-center mb-4">
                                    <div>
                                        <p className="text-slate-600">to</p>
                                        <p className="text-lg font-semibold text-slate-700">{email.recipient}</p>
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
                                <div className="mb-4">
                                    <p className="font-semibold text-slate-700">Status:</p>
                                    <p className="text-slate-500">{email.status}</p>
                                </div>
                                <div>
                                    <p className="font-semibold text-slate-700">Reference Code:</p>
                                    <p className="text-slate-500">{email.referenceCode}</p>
                                </div>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
}
