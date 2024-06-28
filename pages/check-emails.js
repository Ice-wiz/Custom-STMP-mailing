import { useEffect } from 'react';
import checkForEmails from '../lib/recieveEmails';

export default function Page({ message }) {
    useEffect(() => {
        // Run checkForEmails when component mounts (client-side) or within server-side logic
// sourcery skip: avoid-function-declarations-in-blocks
        async function fetchData() {
            try {
                const response = await fetch('/api/check-emails'); // Trigger API route
                const data = await response.json();
                console.log(data);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        }
        fetchData();
    }, []);

    return (
        <div>
            <h1>Email Check</h1>
            <p>{message}</p>
        </div>
    );
}

export async function getStaticProps() {
    // This function runs at build time
    try {
        await checkForEmails(); // Run email check
        return {
            props: {
                message: 'Checked for emails and processed accordingly.'
            },
            revalidate: 3600 // Revalidate every hour
        };
    } catch (error) {
        console.error('Error checking emails:', error);
        return {
            props: {
                message: 'Error checking emails',
                error: error.message
            },
            revalidate: 3600
        };
    }
}
