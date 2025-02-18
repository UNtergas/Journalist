import type { Metadata } from "next";
import localFont from "next/font/local";
import { ColorSchemeScript, mantineHtmlProps, MantineProvider } from '@mantine/core';
import { ToasterProvider } from "@/components/toasterNotification";
import { theme } from "@/themes";
import { AuthProvider } from "@/auth.context";
import "@/styles/main.css";
import '@mantine/core/styles.css';
import '@mantine/charts/styles.css';

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Apprentis",
  description: "Formation en sécurité informatique par la voie de l’apprentissage ",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  
  return (
    <html lang="en" {...mantineHtmlProps}>
      <head>
        <ColorSchemeScript />
      </head>
      <body
        className={`
          ${geistSans.variable} ${geistMono.variable} antialiased 
          `}
      >
        <MantineProvider theme={theme}>
          <ToasterProvider>
            <AuthProvider>
              {children}
            </AuthProvider>
          </ToasterProvider>
        </MantineProvider>
      </body>
    </html>
  );
}

// bg-[url('/homepage.png')] bg-fill
// h-screen w-screen backdrop-blur-md