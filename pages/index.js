import Image from "next/image";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  return (
    <main>
      <div style={{ display: 'flex', flexDirection: 'column', color: 'black', padding: '20px' }}>
        <p>Welcome to our email service, here you can send and receive emails through your custom mailer and mailbox.</p>
        <p>Make sure to click to hit check-email, whenever you are expecting to receive an email, thanks.</p>
        <p>Made by Aryan, under guidance of Debasis sir (in Next.js for both backend and frontend).</p>
      </div>
    </main>
  );
}
