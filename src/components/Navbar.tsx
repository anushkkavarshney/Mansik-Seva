import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Heart, Menu, LogIn, UserPlus } from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

export function Navbar() {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, signOut } = useAuth();
  const { toast } = useToast();

  const isActive = (path: string) => location.pathname === path;

  const handleSignOut = async () => {
    const { error } = await signOut();
    if (error) {
      toast({
        title: "Error signing out",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Signed out successfully",
        description: "You have been logged out.",
      });
    }
  };

  const navLinks = user ? [
    { path: "/", label: "Home" },
    { path: "/student", label: "Student Dashboard" },
  ] : [
    { path: "/", label: "Home" },
  ];

  return (
    <nav className="sticky top-0 z-50 w-full bg-card border-b border-border shadow-soft">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
              <Heart className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-semibold text-foreground">ManasikSeva</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link key={link.path} to={link.path}>
                <Button
                  variant={isActive(link.path) ? "default" : "ghost"}
                  className="text-sm font-medium"
                >
                  {link.label}
                </Button>
              </Link>
            ))}
            
            {/* Auth buttons */}
            {user ? (
              <Button
                onClick={handleSignOut}
                variant="outline"
                className="text-sm font-medium ml-2"
              >
                Sign Out
              </Button>
            ) : (
              <div className="flex items-center gap-2 ml-2">
                <Link to="/auth">
                  <Button variant="ghost" className="text-sm font-medium">
                    <LogIn className="h-4 w-4 mr-1" />
                    Sign In
                  </Button>
                </Link>
                <Link to="/auth">
                  <Button variant="default" className="text-sm font-medium">
                    <UserPlus className="h-4 w-4 mr-1" />
                    Get Started
                  </Button>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            <Menu className="h-5 w-5" />
          </Button>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden pb-4 animate-slide-up">
            <div className="flex flex-col gap-2">
              {navLinks.map((link) => (
                <Link key={link.path} to={link.path} onClick={() => setIsMobileMenuOpen(false)}>
                  <Button
                    variant={isActive(link.path) ? "default" : "ghost"}
                    className="w-full justify-start text-sm font-medium"
                  >
                    {link.label}
                  </Button>
                </Link>
              ))}
              
              {/* Mobile Auth buttons */}
              {user ? (
                <Button
                  onClick={() => {
                    handleSignOut();
                    setIsMobileMenuOpen(false);
                  }}
                  variant="outline"
                  className="w-full justify-start text-sm font-medium"
                >
                  Sign Out
                </Button>
              ) : (
                <>
                  <Link to="/auth" onClick={() => setIsMobileMenuOpen(false)}>
                    <Button variant="ghost" className="w-full justify-start text-sm font-medium">
                      <LogIn className="h-4 w-4 mr-1" />
                      Sign In
                    </Button>
                  </Link>
                  <Link to="/auth" onClick={() => setIsMobileMenuOpen(false)}>
                    <Button variant="default" className="w-full justify-start text-sm font-medium">
                      <UserPlus className="h-4 w-4 mr-1" />
                      Get Started
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}