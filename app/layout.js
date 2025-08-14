import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata = {
  title: "Bean There YYC",
  description: "Discover Calgary’s cafés, track stamps, and share reviews.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="min-h-dvh flex flex-col bg-gray-50 text-gray-900">
        <Navbar />
        <main className="flex-1 max-w-4xl mx-auto w-full px-4 sm:px-6 py-10">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
