import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Gem, Gauge, Brain, Code2 } from "lucide-react";
import GithubStars from "@/components/GithubStars";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

const Index = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [authLoaded, setAuthLoaded] = useState(false);

  useEffect(() => {
    let mounted = true;
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (mounted) {
        setUser(user);
        setAuthLoaded(true);
      }
    });
    return () => { mounted = false; };
  }, []);

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-radial from-primary/5 via-transparent to-transparent animate-pulse" />
      <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-secondary/10 rounded-full blur-3xl animate-float" />
      <div className="absolute bottom-0 left-0 w-1/2 h-1/2 bg-accent/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }} />

      {/* Header */}
      <header className="relative z-10 border-b border-border/50 backdrop-blur-sm/50">
        <div className="container mx-auto px-4 h-14 flex items-center justify-between">
          <button
            className="flex items-center gap-2"
            onClick={() => navigate('/')}
            aria-label="Go to Home"
          >
            <img src="/logo.png" alt="Forge" className="h-7 w-7" />
            <span className="text-2xl font-bold text-white">Forge</span>
          </button>
          <div className="flex items-center gap-2">
            <GithubStars />
            {authLoaded && (
              user ? (
                <Button variant="ghost" onClick={() => navigate('/generator')} className="hidden sm:inline-flex">Open App</Button>
              ) : (
                <Button variant="ghost" onClick={() => navigate('/auth')} className="hidden sm:inline-flex">Sign In</Button>
              )
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <div className="relative z-10 container mx-auto px-4 min-h-[calc(100vh-3.5rem)] flex flex-col items-center justify-center">
        <p className="font-handwritten text-4xl sm:text-4xl md:text-7xl leading-tight text-center max-w-4xl mt-8 mb-8 sm:mb-12 px-4 text-primary">
          Turn <span className="text-white">ideas</span> into perfect prompts that deliver working <span className="text-white">MVPs</span> on the first try
        </p>

        <div className="flex flex-col sm:flex-row gap-4 mb-12 sm:mb-16 px-4">
          {authLoaded && user ? (
            <Button 
              size="lg" 
              className="h-14 px-8 text-lg neon-glow"
              onClick={() => navigate('/generator')}
            >
              <Gem className="h-5 w-5 mr-2" />
              Start Building
            </Button>
          ) : (
            <>
              <Button 
                size="lg" 
                className="h-14 px-8 text-lg neon-glow"
                onClick={() => navigate('/generator')}
              >
                <Gem className="h-5 w-5 mr-2" />
                Start Building
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="h-14 px-8 text-lg glass-effect border-primary/20"
                onClick={() => navigate('/auth')}
              >
                Sign In
              </Button>
            </>
          )}
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 max-w-6xl w-full mt-8 sm:mt-12 px-4">
          <div className="glass-effect p-4 sm:p-6 rounded-lg border border-primary/20 text-center">
            <Gauge className="h-6 w-6 sm:h-8 sm:w-8 text-primary mx-auto mb-3" />
            <h3 className="font-semibold mb-2 text-sm sm:text-base">Lightning Fast</h3>
            <p className="text-xs sm:text-sm text-muted-foreground">Generate comprehensive prompts in seconds</p>
          </div>
          
          <div className="glass-effect p-4 sm:p-6 rounded-lg border border-primary/20 text-center">
            <Brain className="h-6 w-6 sm:h-8 sm:w-8 text-secondary mx-auto mb-3" />
            <h3 className="font-semibold mb-2 text-sm sm:text-base">AI-Optimized</h3>
            <p className="text-xs sm:text-sm text-muted-foreground">Crafted for all major AI coding tools</p>
          </div>
          
          <div className="glass-effect p-4 sm:p-6 rounded-lg border border-primary/20 text-center sm:col-span-2 lg:col-span-1">
            <Code2 className="h-6 w-6 sm:h-8 sm:w-8 text-accent mx-auto mb-3" />
            <h3 className="font-semibold mb-2 text-sm sm:text-base">First Try MVP</h3>
            <p className="text-xs sm:text-sm text-muted-foreground">Build production-ready apps instantly</p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="relative z-10 border-t border-border/50 py-6">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} Forge with ♥ by <a className="underline hover:text-foreground" href="https://programmify.org" target="_blank" rel="noreferrer">Programmify</a>
        </div>
      </footer>
    </div>
  );
};

export default Index;