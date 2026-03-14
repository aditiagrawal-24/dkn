import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, ArrowLeft, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { getFriendlyAuthError, signInWithPassword } from "@/lib/auth";

const AuthPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      navigate("/portal", { replace: true });
    }
  }, [user, navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const normalizedEmail = email.trim().toLowerCase();

      if (!normalizedEmail || !password) {
        toast({
          variant: "destructive",
          title: "Missing details",
          description: "Please enter both email and password.",
        });
        return;
      }

      if (!navigator.onLine) {
        toast({
          variant: "destructive",
          title: "You're offline",
          description: "Please reconnect to the internet and try again.",
        });
        return;
      }

      const { data, error } = await signInWithPassword(normalizedEmail, password);

      if (error) {
        toast({
          variant: "destructive",
          title: "Login failed",
          description: getFriendlyAuthError(error.message),
        });
        return;
      }

      if (!data.session) {
        const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
        if (sessionError || !sessionData.session) {
          throw new Error("Signed in but session could not be established. Please try again.");
        }
      }

      toast({ title: "Welcome back!", description: "You have signed in successfully." });
      navigate("/portal", { replace: true });
    } catch (err) {
      const message = err instanceof Error ? err.message : "Network error while signing in.";
      toast({
        variant: "destructive",
        title: "Login failed",
        description: getFriendlyAuthError(message),
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen">
      {/* Left panel */}
      <div className="hidden w-1/2 gradient-navy lg:flex lg:flex-col lg:justify-between lg:p-12">
        <Link to="/" className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-md gradient-gold">
            <span className="text-lg font-bold text-accent-foreground">S&A</span>
          </div>
          <span className="font-display text-xl font-semibold text-primary-foreground">
            DKN & Associates
          </span>
        </Link>
        <div>
          <h2 className="font-display text-3xl font-bold text-primary-foreground">
            Welcome to Your <span className="text-gradient-gold">Client Portal</span>
          </h2>
          <p className="mt-4 max-w-md text-primary-foreground/70 leading-relaxed">
            Access your financial documents, track your filings, and communicate with your dedicated CA — all in one secure place.
          </p>
          <ul className="mt-8 space-y-3 text-sm text-primary-foreground/60">
            <li className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-accent" />
              Real-time document tracking
            </li>
            <li className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-accent" />
              Secure file sharing
            </li>
            <li className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-accent" />
              Tax filing status updates
            </li>
            <li className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-accent" />
              Direct communication with your CA
            </li>
          </ul>
        </div>
        <p className="text-xs text-primary-foreground/40">
          © {new Date().getFullYear()} DKN & Associates
        </p>
      </div>

      {/* Right panel */}
      <div className="flex flex-1 items-center justify-center bg-background p-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          <Link
            to="/"
            className="mb-8 inline-flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="mr-1 h-4 w-4" /> Back to Home
          </Link>

          <h1 className="font-display text-2xl font-bold text-foreground">
            Sign In
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Enter your credentials to access your portal.
          </p>

          <form className="mt-8 space-y-4" onSubmit={handleLogin}>
            <div className="space-y-1.5">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              disabled={loading || !email.trim() || !password}
              className="w-full gradient-gold text-accent-foreground font-semibold hover:opacity-90 border-0"
            >
              {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
              {loading ? "Signing In..." : "Sign In"}
            </Button>
          </form>

          <p className="mt-6 text-center text-xs text-muted-foreground">
            Access is granted by your administrator. Contact your CA if you need an account.
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default AuthPage;
