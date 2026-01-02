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
      <body className="min-h-screen flex flex-col bg-gray-100 text-gray-900">
        
        {/* Header */}
        <header className="bg-blue-700 text-white px-6 py-4 shadow">
          <div className="max-w-6xl mx-auto">
            <h1 className="text-xl font-semibold">
              Signalement des infractions
            </h1>
          </div>
        </header>

        {/* Contenu principal */}
        <main className="flex-1 p-6">
          <div className="max-w-6xl mx-auto">
            {children}
          </div>
        </main>

        {/* Footer */}
        <footer className="bg-gray-200 text-center text-sm py-4">
          © {new Date().getFullYear()} — Projet universitaire
        </footer>

      </body>
    </html>
  );
}
