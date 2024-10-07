import "@vibrance/styles/globals.css";
import NextAuthSessionProvider from "@vibrance/components/SessionProvider";
import { Inter_Tight } from "next/font/google";

const inter = Inter_Tight({
    subsets: ["latin"],
    variable: "--font-sans",
});

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en">
            <body className={`font-sans ${inter.variable}`}>
                <NextAuthSessionProvider>{children}</NextAuthSessionProvider>
            </body>
        </html>
    );
}
