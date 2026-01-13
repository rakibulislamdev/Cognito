import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import { ChatProvider } from "@/provider/ChatProvider";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Cognito",
  description: "Cognito example",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} antialiased`}>
        <ChatProvider>{children}</ChatProvider>
      </body>
    </html>
  );
}
