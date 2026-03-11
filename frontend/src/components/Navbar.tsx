import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { User, LogOut, ChevronDown, Menu, X } from "lucide-react";
import { useState } from "react";

export function Navbar() {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const navLinks = [
    { to: "/", label: "Dashboard" },
    ...(isAdmin ? [{ to: "/fap-control", label: "FAP Control" }] : []),
    { to: "/reports", label: "Reports" },
  ];

  return (
    <nav className="sticky top-0 z-50 border-b bg-primary text-primary-foreground shadow-md">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4">
        {/* Logo — real NTC image */}
        <Link to="/" className="flex items-center gap-2 font-bold text-lg tracking-wide">
          <img
            src="/ntcnobglogo.png"
            alt="NTC Logo"
            className="h-10 w-10 rounded-md object-contain bg-white p-0.5"
          />
          <span className="hidden sm:inline">Nepal Telecom</span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className="rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-primary-foreground/10"
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Profile dropdown */}
        <div className="hidden md:block">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="gap-2 text-primary-foreground hover:bg-primary-foreground/10">
                <User className="h-4 w-4" />
                <span className="text-sm">{user?.name}</span>
                <span className="rounded bg-primary-foreground/20 px-1.5 py-0.5 text-xs">{user?.role === "ADMIN" ? "Admin" : "Analyst"}</span>
                <ChevronDown className="h-3 w-3" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-popover">
              <DropdownMenuItem onClick={handleLogout} className="cursor-pointer">
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Mobile menu button */}
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden text-primary-foreground hover:bg-primary-foreground/10"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      </div>

      {/* Mobile nav panel */}
      {mobileOpen && (
        <div className="md:hidden border-t border-primary-foreground/20 bg-primary px-4 pb-4 pt-2">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              onClick={() => setMobileOpen(false)}
              className="block rounded-md px-3 py-2 text-sm font-medium hover:bg-primary-foreground/10"
            >
              {link.label}
            </Link>
          ))}
          <button
            onClick={handleLogout}
            className="mt-2 flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm font-medium hover:bg-primary-foreground/10"
          >
            <LogOut className="h-4 w-4" /> Logout
          </button>
        </div>
      )}
    </nav>
  );
}
