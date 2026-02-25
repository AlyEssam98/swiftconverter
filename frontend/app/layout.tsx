import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import { Toaster } from "sonner";

const inter = Inter({
    subsets: ["latin"],
    display: 'swap',
    variable: '--font-inter',
});

export const metadata: Metadata = {
    metadataBase: new URL("https://swiftconverter.pro"),
    title: {
        default: "SWIFT Converter Pro - MT to MX & ISO 20022 Conversion Tool",
        template: "%s | SWIFT Converter Pro"
    },
    description: "Free online MT103 to MX converter, ISO 20022 validator, pacs.008 generator. Convert SWIFT MT messages to MX format instantly. Professional MT to MX conversion tool for financial institutions.",
    keywords: [
        "MT103 to MX converter",
        "ISO 20022 validator online",
        "pacs.008 generator",
        "MT to MX conversion tool",
        "SWIFT MT103 converter",
        "MT202 to pacs.009",
        "MT940 to camt.053",
        "SWIFT message converter",
        "ISO 20022 conversion",
        "financial message transformation"
    ],
    authors: [{ name: "SWIFT Converter Pro" }],
    creator: "SWIFT Converter Pro",
    publisher: "SWIFT Converter Pro",
    icons: {
        icon: [
            { url: '/favicon.svg', type: 'image/svg+xml' },
            { url: '/favicon.ico', sizes: 'any' }
        ],
        apple: '/favicon.svg',
    },
    robots: {
        index: true,
        follow: true,
        googleBot: {
            index: true,
            follow: true,
            "max-video-preview": -1,
            "max-image-preview": "large",
            "max-snippet": -1,
        },
    },
    openGraph: {
        type: "website",
        locale: "en_US",
        url: "https://swiftconverter.pro",
        siteName: "SWIFT Converter Pro",
        title: "MT103 to MX Converter | Free ISO 20022 Online Tool",
        description: "Convert MT103, MT202, MT940 to MX format instantly. Free online pacs.008 generator and ISO 20022 validator. Professional SWIFT message conversion.",
        images: [
            {
                url: "/og-image.png",
                width: 1200,
                height: 630,
                alt: "SWIFT MT to MX Converter",
            },
        ],
    },
    twitter: {
        card: "summary_large_image",
        title: "MT103 to MX Converter | SWIFT Conversion Tool",
        description: "Free online MT to MX converter. Convert SWIFT messages to ISO 20022 format instantly.",
        images: ["/og-image.png"],
    },
    alternates: {
        canonical: "https://swiftconverter.pro",
    },
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" className={inter.variable}>
            <body className="min-h-screen antialiased">
                <AuthProvider>
                    {children}
                    <Toaster />
                </AuthProvider>
            </body>
        </html>
    );
}
