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
        default: "MT to MX Online Converter - Free SWIFT MT103 to MX Conversion Tool",
        template: "%s | MT to MX Online Converter"
    },
    description: "Free online MT to MX converter. Convert SWIFT MT103, MT202, MT940 to ISO 20022 MX format instantly. Professional swift mt to mx converter online with bank-grade validation. No signup required.",
    keywords: [
        "mt to mx online",
        "swift mt to mx",
        "mt103 to mx converter online",
        "swift converter online",
        "mt to mx converter",
        "online mt to mx conversion",
        "free mt to mx converter",
        "swift message converter online",
        "mt103 to pacs.008 online",
        "mt202 to pacs.009 converter",
        "mt940 to camt.053 online",
        "iso 20022 converter online",
        "swift mt to mx conversion tool",
        "online swift message converter",
        "mt to mx transformation online",
        "free swift converter",
        "mt103 converter online free",
        "iso 20022 validator online",
        "pacs.008 generator online",
        "swift financial message converter",
        "mt to mx online free",
        "instant mt to mx converter",
        "professional swift converter"
    ],
    authors: [{ name: "MT to MX Online Converter" }],
    creator: "MT to MX Online Converter",
    publisher: "MT to MX Online Converter",
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
        siteName: "MT to MX Online Converter",
        title: "MT to MX Online Converter | Free SWIFT MT103 to MX Tool",
        description: "Convert SWIFT MT messages to ISO 20022 MX format online. Free MT103 to MX converter with instant results. Professional swift mt to mx conversion tool.",
        images: [
            {
                url: "/og-image.png",
                width: 1200,
                height: 630,
                alt: "MT to MX Online Converter - Free SWIFT Conversion Tool",
            },
        ],
    },
    twitter: {
        card: "summary_large_image",
        title: "MT to MX Online Converter | Free SWIFT Tool",
        description: "Free online MT to MX converter. Convert SWIFT MT103, MT202, MT940 to ISO 20022 instantly. No signup required.",
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
