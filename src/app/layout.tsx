import {Footer} from "@/app/Footer";
import {GameProvider} from "@/context/GameContext";
import type {Metadata} from "next";
import "./globals.css";
import {ReactNode} from "react";
import styles from "./layout.module.css";

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
      <body id="root">
        <GameProvider>
          <div className={styles.appWrapper}>
            <main className={styles.appMain}>{children}</main>
            <footer className={styles.appFooter}>
              <Footer />
            </footer>
          </div>
        </GameProvider>
      </body>
    </html>
  );
}
