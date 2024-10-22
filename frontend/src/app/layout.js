import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { dark } from '@clerk/themes';
import Navbar from "./_components/Navbar";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


export const metadata = {
  title: "AST ENGINE",
  description: "Create and evaluate rules through abstract syntax trees",
};

export default function RootLayout({ children }) {
  return (
    <ClerkProvider appearance={{ baseTheme: dark }}>
      <html lang="en">
        <body>
          <ToastContainer autoClose={5000} theme="light"/>
          <div className="flex flex-col min-h-screen justify-center items-center bg-gradient-to-br from-black/20 to-gray-700/80">
            <Navbar />
            <main className="flex-grow">
              {children}
            </main>
          </div>
        </body>
      </html>
    </ClerkProvider>
  );
}
