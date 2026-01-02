import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Signalement des infractions",
  description: "Application web de signalement des infractions",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <body>
        
        {/* Header */}
        <header className="app-header">
          <div className="header-container">
            <h1 className="header-title">
              Signalement des infractions
            </h1>
          </div>
        </header>

        {/* Contenu principal */}
        <main className="app-main">
          {children}
        </main>

        {/* Footer */}
        <footer className="app-footer">
          <p className="footer-text">
            © {new Date().getFullYear()} — Projet universitaire
          </p>
        </footer>

      </body>
    </html>
  );
}
