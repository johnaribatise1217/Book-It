/* eslint-disable @next/next/no-sync-scripts */
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import dbConnect from "../../backend/config/dbConnect";
import Head from "./head";
import { GlobalProvider } from "./provider/GlobalProvider";
import Header from "./components/layout/Header";
import Footer from "./components/layout/Footer";
import 'bootstrap/dist/css/bootstrap.css'

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "BookIt-App",
  description: "Developed by AribaDev",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  dbConnect()
  return (
    <html lang="en">
      <Head/> 
      <body className={inter.className}>
        <GlobalProvider>
          <Header/>
          {children}
          <Footer/>
         </GlobalProvider>
        <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/js/bootstrap.bundle.min.js" ></script>
        <script src="https://kit.fontawesome.com/e1e292a0d1.js"></script>
      </body>
    </html>
  );
}
