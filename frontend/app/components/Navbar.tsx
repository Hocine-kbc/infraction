import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="w-full bg-blue-700 text-white shadow">
      <div className="max-w-6xl mx-auto flex justify-between items-center px-6 py-4">
        <h1 className="text-xl font-bold hover:text-blue-300 transition cursor-pointer">
          Signalement Infractions
        </h1>

        <div className="flex gap-4 items-center">
          <Link href="/" className="hover:text-blue-300 transition">
            Accueil
          </Link>

          <Link href="/login" className="hover:text-blue-300 transition">
            Connexion
          </Link>

          <Link href="/register" className="hover:text-blue-300 transition">
            Inscription
          </Link>

          <Link
            href="/report"
            className="bg-white text-blue-700 px-3 py-1 rounded hover:bg-blue-100 transition font-medium"
          >
            Signalement
          </Link>
        </div>
      </div>
    </nav>
  );
}
