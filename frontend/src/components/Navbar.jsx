import { useState } from "react";
import { Link, useLocation } from "react-router";
import { BookOpenIcon, LayoutDashboardIcon, SparklesIcon, MenuIcon, XIcon } from "lucide-react";
import { UserButton } from "@clerk/clerk-react";

function Navbar() {
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="bg-[#0a0a0f]/80 border-b border-white/5 sticky top-0 z-50 shadow-lg">
      <div className="w-full py-2 px-2 sm:px-8 flex items-center justify-between text-white">
        {/* Logo */}
        <Link
          to="/"
          className="group flex items-center gap-3 hover:scale-105 transition-transform duration-200"
          style={{ minHeight: '44px' }}
        >
          <div className="size-10 rounded-xl bg-[#00ff88] flex items-center justify-center shadow-lg ">
            <SparklesIcon className="size-6 text-black" />
          </div>
          <div className="flex flex-col justify-center">
            <span className="font-black text-xl sm:text-2xl text-white font-mono tracking-wider leading-none">
              CodeArena
            </span>
            <span className="text-xs text-gray-400 font-medium leading-none">Code Together</span>
          </div>
        </Link>

        {/* Hamburger for mobile */}
        <button
          className="sm:hidden flex items-center justify-center p-2 rounded-lg hover:bg-[#0d0d16] focus:outline-none focus:ring-2 focus:ring-[#00ff88] ml-2"
          onClick={() => setMenuOpen((open) => !open)}
          aria-label={menuOpen ? "Close menu" : "Open menu"}
        >
          {menuOpen ? <XIcon className="size-6 text-[#00ff88]" /> : <MenuIcon className="size-6 text-[#00ff88]" />}
        </button>

        {/* Desktop Nav */}
        <div className="hidden sm:flex items-center gap-4">
          <Link
            to={"/problems"}
            className={`px-4 py-2.5 rounded-lg transition-all duration-200 font-medium flex items-center gap-x-2.5
              ${
                isActive("/problems")
                  ? "bg-[#00ff88] text-black"
                  : "hover:bg-[#00ff88]/10 text-white hover:text-[#00ff88]"
              }
              `}
          >
            <BookOpenIcon className="size-4" />
            <span className="hidden md:inline">Problems</span>
          </Link>
          <Link
            to={"/dashboard"}
            className={`px-4 py-2.5 rounded-lg transition-all duration-200 font-medium flex items-center gap-x-2.5
              ${
                isActive("/dashboard")
                  ? "bg-[#00ff88] text-black"
                  : "hover:bg-[#00ff88]/10 text-white hover:text-[#00ff88]"
              }
              `}
          >
            <LayoutDashboardIcon className="size-4" />
            <span className="hidden md:inline">Dashboard</span>
          </Link>
          <div className="flex items-center">
            <UserButton />
          </div>
        </div>

        {/* Mobile Nav Drawer */}
        {menuOpen && (
          <div className="sm:hidden absolute top-full left-0 w-full bg-[#0a0a0f]/95 shadow-lg border-b border-white/5 animate-fade-in z-50">
            <div className="flex flex-col items-center gap-2 py-3">
              <Link
                to={"/problems"}
                className={`w-11/12 px-4 py-3 rounded-lg text-center transition-all duration-200 font-medium flex items-center justify-center gap-x-2.5
                  ${
                    isActive("/problems")
                      ? "bg-[#00ff88] text-black"
                      : "hover:bg-[#00ff88]/10 text-white hover:text-[#00ff88]"
                  }
                `}
                onClick={() => setMenuOpen(false)}
              >
                <BookOpenIcon className="size-4" />
                <span>Problems</span>
              </Link>
              <Link
                to={"/dashboard"}
                className={`w-11/12 px-4 py-3 rounded-lg text-center transition-all duration-200 font-medium flex items-center justify-center gap-x-2.5
                  ${
                    isActive("/dashboard")
                      ? "bg-[#00ff88] text-black"
                      : "hover:bg-[#00ff88]/10 text-white hover:text-[#00ff88]"
                  }
                `}
                onClick={() => setMenuOpen(false)}
              >
                <LayoutDashboardIcon className="size-4" />
                <span>Dashboard</span>
              </Link>
              <div className="flex items-center justify-center">
                <UserButton />
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
export default Navbar;