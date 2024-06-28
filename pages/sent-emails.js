import { useEffect, useState } from 'react';
import axios from 'axios';
import Link from 'next/link';

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
        <div className="min-h-screen bg-slate-100 flex flex-col items-center py-8">
            <div className="bg-white shadow-md rounded-lg p-6 w-full max-w-4xl relative">
           
                <Link href="/" passHref>
                    <button className="absolute top-4 right-4 bg-slate-700 text-white py-2 px-4 rounded-lg shadow-lg hover:bg-slate-600 transition">
                        Dashboard
                    </button>
                </Link>

                <h1 className="text-2xl font-bold text-slate-800 mb-6 text-center">Sent Emails</h1>
                <ul className="space-y-6">
                    {emails.map((email, index) => (
                        <li key={index} className="bg-slate-50 p-4 rounded-lg shadow-sm border border-slate-200">
                            <div className="flex flex-col">
                                <h2 className="text-lg font-semibold text-slate-700 mb-2">{email.subject}</h2>
                                <p className="text-slate-600 mb-1"><strong>To:</strong> {email.recipient}</p>
                                <p className="text-slate-600 mb-1"><strong>Status:</strong> {email.status}</p>
                                <p className="text-slate-600 mb-1"><strong>Reference Code:</strong> {email.referenceCode}</p>
                                <p className="text-slate-800 mt-2"><strong>Content:</strong> {email.body}</p>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}
