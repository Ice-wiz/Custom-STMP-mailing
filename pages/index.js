import Link from 'next/link';

export default function Home() {
    return (
        <main className="min-h-screen flex flex-col justify-between bg-gradient-to-br from-gray-100 via-white to-gray-200">

            <header className="pt-20 pb-10 bg-gradient-to-r from-blue-500 to-green-500 text-white">
                <div className="max-w-screen-lg mx-auto px-4">
                    <h1 className="text-4xl font-bold text-center mb-4">Welcome to Your Email Service</h1>
                    <p className="text-lg text-center">
                        Your personalized email solution for seamless communication.
                    </p>
                </div>
            </header>

            <section className="flex-grow flex flex-col justify-center items-center px-4">
                <h2 className="text-2xl font-bold text-gray-800 mb-8">What would you like to do?</h2>
                <div className="flex justify-center space-x-6 my-8">
               
                    <Link href="/send-email" passHref>
                        <div className="bg-blue-600 hover:bg-blue-800 text-white font-bold py-3 px-8 rounded-full shadow-lg transition duration-300 cursor-pointer">
                            Compose new
                        </div>
                    </Link>
                  
                    <Link href="/check-emails" passHref>
                        <div className="bg-green-600 hover:bg-green-800 text-white font-bold py-3 px-8 rounded-full shadow-lg transition duration-300 cursor-pointer">
                           Check Inbox
                        </div>
                    </Link>
               
                    <Link href="/sent-emails" passHref>
                        <div className="bg-purple-600 hover:bg-purple-800 text-white font-bold py-3 px-8 rounded-full shadow-lg transition duration-300 cursor-pointer">
                            Sent Emails
                        </div>
                    </Link>
                </div>
            </section>

    
            <footer className="bg-gray-900 text-white py-8">
                <div className="max-w-screen-lg mx-auto text-center">
                    <p className="text-lg mb-4">
                        Enjoy seamless communication with our custom email solution.
                    </p>
                    <p className="text-sm">
                        Made by Aryan, guided by Debasis sir, powered by Next.js.
                    </p>
                </div>
            </footer>
        </main>
    );
}
