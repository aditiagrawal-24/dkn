import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, X, LogOut, LogIn } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

const navItems = [
  { label: "Home", path: "/home" },
  { label: "About Us", path: "/about" },
  { label: "Services", path: "/services" },
  { label: "Resources", path: "/resources" },
  { label: "Contact Us", path: "/contact" },
];

const authNavItems = [
  { label: "My Documents", path: "/portal" },
];

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const { toast } = useToast();

  const handleLogout = async () => {
    await signOut();
    toast({ title: "Signed out", description: "You have been logged out successfully." });
    navigate("/");
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/50 bg-card/80 backdrop-blur-lg">
      <div className="container flex h-16 items-center justify-between md:h-20">
        <Link to={user ? "/home" : "/"} className="flex items-center gap-3">
          <img alt="CA Logo" className="h-14 w-14 rounded-md object-contain" src="/lovable-uploads/5b45f1d2-f566-4351-9a53-b40759f72299.jpg" />
          <img alt="Firm Logo" className="h-18 w-auto max-w-[120px] rounded-md object-contain" src="/lovable-uploads/f96ddb4b-d628-4270-b545-90195e7da84d.png" />
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden items-center gap-1 md:flex">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-muted hover:text-foreground ${
                location.pathname === item.path
                  ? "text-accent font-semibold"
                  : "text-muted-foreground"
              }`}
            >
              {item.label}
            </Link>
          ))}
          {user ? (
            <>
              {authNavItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-muted hover:text-foreground ${
                    location.pathname === item.path
                      ? "text-accent font-semibold"
                      : "text-muted-foreground"
                  }`}
                >
                  {item.label}
                </Link>
              ))}
              <button
                onClick={handleLogout}
                className="ml-2 inline-flex items-center gap-1.5 rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
              >
                <LogOut size={16} />
                Logout
              </button>
            </>
          ) : (
            <Link
              to="/auth"
              className="ml-2 inline-flex items-center gap-1.5 rounded-md px-3 py-2 text-sm font-medium gradient-gold text-accent-foreground hover:opacity-90 transition-opacity"
            >
              <LogIn size={16} />
              Client Login
            </Link>
          )}
        </nav>

        {/* Mobile Toggle */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden text-foreground"
          aria-label="Toggle menu"
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Nav */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden border-t border-border bg-card md:hidden"
          >
            <nav className="container flex flex-col gap-1 py-4">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsOpen(false)}
                  className={`rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-muted ${
                    location.pathname === item.path
                      ? "text-accent"
                      : "text-muted-foreground"
                  }`}
                >
                  {item.label}
                </Link>
              ))}
              {user ? (
                <>
                  {authNavItems.map((item) => (
                    <Link
                      key={item.path}
                      to={item.path}
                      onClick={() => setIsOpen(false)}
                      className={`rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-muted ${
                        location.pathname === item.path
                          ? "text-accent"
                          : "text-muted-foreground"
                      }`}
                    >
                      {item.label}
                    </Link>
                  ))}
                  <button
                    onClick={() => {
                      setIsOpen(false);
                      handleLogout();
                    }}
                    className="rounded-md px-3 py-2 text-sm font-medium text-destructive transition-colors hover:bg-destructive/10 text-left flex items-center gap-1.5"
                  >
                    <LogOut size={16} />
                    Logout
                  </button>
                </>
              ) : (
                <Link
                  to="/auth"
                  onClick={() => setIsOpen(false)}
                  className="rounded-md px-3 py-2 text-sm font-medium text-accent transition-colors hover:bg-muted flex items-center gap-1.5"
                >
                  <LogIn size={16} />
                  Client Login
                </Link>
              )}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Navbar;
