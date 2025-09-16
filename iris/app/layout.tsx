import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { CartProvider } from "./lib/cart";
import Header from "./components/Header";
import * as React from "react";
import {HeroUIProvider} from "@heroui/react";
// import {Providers} from "./providers";

const geistSans = Geist({
	variable: "--font-geist-sans",
	subsets: ["latin"],
});

const geistMono = Geist_Mono({
	variable: "--font-geist-mono",
	subsets: ["latin"],
});

export const metadata: Metadata = {
	title: "Iris",
	description: "Boutique e-commerce de chaussures",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="fr">
			<body
				className={`${geistSans.variable} ${geistMono.variable} antialiased h-screen`}
			>
				{/* <Providers> */}
					<CartProvider>
						<Header />
						{children}
					</CartProvider>
				{/* </Providers> */}
			</body>
		</html>
	);
}
