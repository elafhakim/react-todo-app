import { Link, useNavigate } from "react-router";
import useAuth from "../../hooks/useAuth";

export default function Navbar() {
  const navigate = useNavigate();
  const { logout } = useAuth();

  function handleLogout() {
    logout();

    navigate("/login", {
      replace: true,
    });
  }

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur">
      <nav className="mx-auto flex min-h-16 w-full max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
        <Link
          to="/"
          className="shrink-0 text-3xl font-bold text-slate-900 transition hover:text-blue-600"
        >
          Todo App
        </Link>

        <button
          type="button"
          onClick={handleLogout}
          className="shrink-0 rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 transition hover:border-red-200 hover:bg-red-50 hover:text-red-700 sm:px-4"
        >
          Sign out
        </button>
      </nav>
    </header>
  );
}