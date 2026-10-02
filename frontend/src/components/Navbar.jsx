import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { user, logout } = useAuth();
  return (
    <nav className="sticky top-0 z-50 border-b border-slate-800 bg-slate-950/90 backdrop-blur">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">

        <div className="flex h-16 items-center justify-between">

          {/* Logo */}
          <Link
            to="/"
            onClick={() => setMenuOpen(false)}
            className="flex items-center gap-2"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-600 font-bold text-white">
              D
            </div>

            <span className="text-xl font-bold tracking-tight text-white">
              DevMind
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden items-center gap-1 md:flex">

            <Link
              to="/"
              className="rounded-lg px-4 py-2 text-sm font-medium text-slate-300 transition hover:bg-slate-800 hover:text-white"
            >
              Dashboard
            </Link>

            <Link
              to="/review"
              className="rounded-lg px-4 py-2 text-sm font-medium text-slate-300 transition hover:bg-slate-800 hover:text-white"
            >
              🤖 Code Review
            </Link>

<Link
  to="/history"
  className="rounded-lg px-4 py-2 text-sm font-medium text-slate-300 transition hover:bg-slate-800 hover:text-white"
>
  📜 History
</Link>
<Link
  to="/interview"
  className="rounded-lg px-4 py-2 text-sm font-medium text-slate-300 transition hover:bg-slate-800 hover:text-white"
>
  🎙️ Interview
</Link>
{user ? (
  <button
    onClick={logout}
    className="rounded-lg px-4 py-2 text-sm font-medium text-slate-300 transition hover:bg-slate-800 hover:text-white"
  >
    Log Out ({user.name})
  </button>
) : (
  <Link
    to="/login"
    className="rounded-lg px-4 py-2 text-sm font-medium text-slate-300 transition hover:bg-slate-800 hover:text-white"
  >
    Log In
  </Link>
)}
        
             
        <Link
  to="/notes"
  className="rounded-lg px-4 py-2 text-sm font-medium text-slate-300 transition hover:bg-slate-800 hover:text-white"
>
  🧠 My Notes
</Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="rounded-lg border border-slate-700 p-2 text-slate-300 hover:bg-slate-800 md:hidden"
            aria-label="Toggle menu"
          >
            {menuOpen ? "✕" : "☰"}
          </button>

        </div>

        {/* Mobile Navigation */}
        {menuOpen && (
          <div className="border-t border-slate-800 py-4 md:hidden">

            <div className="flex flex-col gap-1">

              <Link
                to="/"
                onClick={() => setMenuOpen(false)}
                className="rounded-lg px-4 py-3 text-sm font-medium text-slate-300 hover:bg-slate-800 hover:text-white"
              >
                🏠 Dashboard
              </Link>

              <Link
                to="/review"
                onClick={() => setMenuOpen(false)}
                className="rounded-lg px-4 py-3 text-sm font-medium text-slate-300 hover:bg-slate-800 hover:text-white"
              >
                🤖 Code Review
              </Link>
              <Link
  to="/review"
  onClick={() => setMenuOpen(false)}
  className="rounded-lg px-4 py-3 text-sm font-medium text-slate-300 hover:bg-slate-800 hover:text-white"
>
  🤖 Code Review
</Link>

<Link
  to="/history"
  onClick={() => setMenuOpen(false)}
  className="rounded-lg px-4 py-3 text-sm font-medium text-slate-300 hover:bg-slate-800 hover:text-white"
>
  📜 History
</Link>
<Link
  to="/interview"
  onClick={() => setMenuOpen(false)}
  className="rounded-lg px-4 py-3 text-sm font-medium text-slate-300 hover:bg-slate-800 hover:text-white"
>
  🎙️ Interview
</Link>

{user ? (
  <button
    onClick={logout}
    className="rounded-lg px-4 py-3 text-sm font-medium text-slate-300 hover:bg-slate-800 hover:text-white"
  >
    Log Out ({user.name})
  </button>
) : (
  <Link
    to="/login"
    className="rounded-lg px-4 py-3 text-sm font-medium text-slate-300 hover:bg-slate-800 hover:text-white"
  >
    Log In
  </Link>
)}
<Link
  to="/notes"
  onClick={()=>{setMenuOpen(false)}}
  className="rounded-lg px-4 py-3 text-sm font-medium text-slate-300 transition hover:bg-slate-800 hover:text-white"
>
  🧠 My Notes
</Link>



            </div>

          </div>
        )}

      </div>
    </nav>
  );
}

export default Navbar;