import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Workflow Chat Bot",
  description: "Chat with workflows to get things done",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <div className="container">
          <header className="header">
            <h1>Workflow Chat Bot</h1>
            <p className="tagline">Type a workflow name to begin (e.g., "Onboard New Employee").</p>
          </header>
          <main>{children}</main>
          <footer className="footer">? {new Date().getFullYear()} Workflow Chat Bot</footer>
        </div>
      </body>
    </html>
  );
}
