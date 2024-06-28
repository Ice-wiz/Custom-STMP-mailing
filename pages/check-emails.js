import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import checkForEmails from '../lib/recieveEmails';
import Link from 'next/link';

export default function Page({ initialMessage }) {
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState(initialMessage);
    const [redirecting, setRedirecting] = useState(false);
    const router = useRouter();

    useEffect(() => {


        async function fetchData() {
            try {
                const response = await fetch('/api/check-emails');
                const data = await response.json();
                setMessage(data.message || 'New emails fetched successfully.');
                setLoading(false);
            } catch (error) {
                console.error('Error fetching data:', error);
                setMessage('Error fetching data.');
                setLoading(false);
            }
        }

        fetchData();
    }, []);

    // for transition

    const handleRedirect = (path) => {
        setRedirecting(true);
        setTimeout(() => {
            router.push(path);
        }, 1000); 
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-100 via-white to-gray-200">
            <h1 className="text-3xl font-bold mb-6">Email Check</h1>
            {loading ? (
                <div className="flex flex-col items-center">
                    <div className="loader ease-linear rounded-full border-4 border-t-4 border-gray-200 h-12 w-12 mb-4"></div>
                    <p className="text-xl">Checking for new emails...</p>
                </div>
            ) : (
                <div className="text-center">
                    <p className="text-xl mb-6">{message}</p>
                    {!redirecting && (
                        <div className="flex justify-center space-x-4">
                            <div
                                className="bg-blue-600 hover:bg-blue-800 text-white font-semibold py-2 px-6 rounded-full shadow-lg transition duration-300 cursor-pointer"
                                onClick={() => handleRedirect('/')}
                            >
                                Go to Dashboard
                            </div>
                            <div
                                className="bg-green-600 hover:bg-green-800 text-white font-semibold py-2 px-6 rounded-full shadow-lg transition duration-300 cursor-pointer"
                                onClick={() => handleRedirect('/received-emails')}
                            >
                                View Received Emails
                            </div>
                        </div>
                    )}
                    {redirecting && (
                        <p className="text-gray-500 mt-4">Redirecting...</p>
                    )}
                </div>
            )}
        </div>
    );
}

export async function getStaticProps() {
    try {
        await checkForEmails();
        return {
            props: {
                initialMessage: 'Checked for emails and processed accordingly.'
            },
            revalidate: 3600 // Revalidate every hour
        };
    } catch (error) {
        console.error('Error checking emails:', error);
        return {
            props: {
                initialMessage: 'Error checking emails',
                error: error.message
            },
            revalidate: 3600
        };
    }
}
