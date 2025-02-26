import type {Metadata} from "next";
import "./globals.css";
import {ReactNode} from "react";

export const metadata: Metadata = {
  title: "Intelligent Connect Four",
  description: "By j&fLab",
};

interface RootLayoutProps {
  children: ReactNode;
}

export default function RootLayout({children}: RootLayoutProps) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
