import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Gem, Copy, RefreshCw, Bookmark, LogOut, Settings, User, BookMarked, Edit, Check, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { useCustomToast, CustomToastContainer } from "@/components/ui/custom-toast";
import { supabase } from "@/integrations/supabase/client";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { EnhancedDesignPatternSelector } from "@/components/EnhancedDesignPatternSelector";
import { UILibrarySelector } from "@/components/UILibrarySelector";
import { EnhancedFontSelector } from "@/components/EnhancedFontSelector";
import { EnhancedTechStackSelector } from "@/components/EnhancedTechStackSelector";
import { AIToolSelector } from "@/components/AIToolSelector";
import { PaymentGatewaySelector } from "@/components/PaymentGatewaySelector";

const Generator = () => {
  const [userIdea, setUserIdea] = useState("");
  const [designPatterns, setDesignPatterns] = useState<string[]>([]);
  const [uiLibraries, setUiLibraries] = useState<string[]>([]);
  const [fontFamily, setFontFamily] = useState("");
  const [authProvider, setAuthProvider] = useState("");
  const [databaseProvider, setDatabaseProvider] = useState("");
  const [theme, setTheme] = useState("dark");
  const [aiTool, setAiTool] = useState("Cursor");
  const [paymentGateways, setPaymentGateways] = useState<string[]>([]);
  const [generatedPrompt, setGeneratedPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedPrompt, setEditedPrompt] = useState("");
  const [searchParams] = useSearchParams();
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [bookmarkId, setBookmarkId] = useState<string | null>(null);
  const [authLoaded, setAuthLoaded] = useState(false);
  
  const { toast, toasts, removeToast } = useCustomToast();
  const navigate = useNavigate();

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
      setAuthLoaded(true);
    });
  }, []);

  // Handle URL parameters for continuing chats
  useEffect(() => {
    const title = searchParams.get('title');
    const content = searchParams.get('content');
    const designPatterns = searchParams.get('design_patterns');
    const uiLibraries = searchParams.get('ui_libraries');
    const fontFamily = searchParams.get('font_family');
    const authProvider = searchParams.get('auth_provider');
    const databaseProvider = searchParams.get('database_provider');
    const theme = searchParams.get('theme');

    if (title) setUserIdea(title);
    if (content) {
      setGeneratedPrompt(content);
      setEditedPrompt(content);
    }
    if (designPatterns) setDesignPatterns(designPatterns.split(',').filter(Boolean));
    if (uiLibraries) setUiLibraries(uiLibraries.split(',').filter(Boolean));
    if (fontFamily) setFontFamily(fontFamily);
    if (authProvider) setAuthProvider(authProvider);
    if (databaseProvider) setDatabaseProvider(databaseProvider);
    if (theme) setTheme(theme);
  }, [searchParams]);

  // Auto-save functionality
  useEffect(() => {
    if (isEditing && editedPrompt !== generatedPrompt) {
      const timeoutId = setTimeout(() => {
        setGeneratedPrompt(editedPrompt);
      toast.success("Auto-saved", "Your changes have been saved");
      }, 2000);

      return () => clearTimeout(timeoutId);
    }
  }, [editedPrompt, isEditing, generatedPrompt, toast]);

  // Check if current prompt is bookmarked
  const checkBookmarkStatus = async () => {
    if (!user || !generatedPrompt) return;
    
    try {
      const { data, error } = await supabase
        .from('bookmarked_prompts')
        .select('id')
        .eq('user_id', user.id)
        .eq('prompt_content', generatedPrompt)
        .single();

      if (data) {
        setIsBookmarked(true);
        setBookmarkId(data.id);
      } else {
        setIsBookmarked(false);
        setBookmarkId(null);
      }
    } catch (error) {
      setIsBookmarked(false);
      setBookmarkId(null);
    }
  };

  useEffect(() => {
    checkBookmarkStatus();
  }, [user, generatedPrompt]);

  const handleGenerate = async () => {
    if (!userIdea.trim()) {
      toast.error("Missing Input", "Please describe your idea first");
      return;
    }

    setIsGenerating(true);
    try {
      const { data, error } = await supabase.functions.invoke('generate-prompt', {
        body: {
          userIdea,
          designPatterns,
          uiLibraries,
          fontFamily,
          authProvider,
          databaseProvider,
          theme,
          aiTool,
        },
      });

      if (error) throw error;
      
      setGeneratedPrompt(data.prompt);
      setEditedPrompt(data.prompt);
      setIsEditing(false);
      // Save to per-user history
      try {
        if (user?.id) {
          const historyKey = `prompt_history:${user.id}`;
          const existingRaw = localStorage.getItem(historyKey);
          const existing = existingRaw ? JSON.parse(existingRaw) : [];
          const newItem = {
            id: crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).slice(2),
            prompt_title: userIdea.substring(0, 100),
            prompt_content: data.prompt,
            design_patterns: designPatterns,
            ui_libraries: uiLibraries,
            font_family: fontFamily,
            auth_provider: authProvider,
            database_provider: databaseProvider,
            theme,
            created_at: new Date().toISOString(),
          };
          const updated = [newItem, ...existing].slice(0, 200);
          localStorage.setItem(historyKey, JSON.stringify(updated));
        }
      } catch {}
      toast.success("Prompt Generated!", "Your AI-optimized prompt is ready");
    } catch (error: any) {
      toast.error("Generation Failed", error.message || "Failed to generate prompt");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedPrompt);
    toast.success("Copied!", "Prompt copied to clipboard");
  };

  const handleBookmark = async () => {
    if (!user) {
      toast.error("Sign In Required", "Please sign in to bookmark prompts");
      navigate('/auth');
      return;
    }

    try {
      if (isBookmarked && bookmarkId) {
        // Remove bookmark
        const { error } = await supabase
          .from('bookmarked_prompts')
          .delete()
          .eq('id', bookmarkId);

        if (error) throw error;

        setIsBookmarked(false);
        setBookmarkId(null);
        toast.success("Removed from Bookmarks", "Prompt removed from your collection");
      } else {
        // Add bookmark
        const { data, error } = await supabase.from('bookmarked_prompts').insert({
          user_id: user.id,
          prompt_title: userIdea.substring(0, 100),
          prompt_content: generatedPrompt,
          design_patterns: designPatterns,
          ui_libraries: uiLibraries,
          font_family: fontFamily,
          auth_provider: authProvider,
          database_provider: databaseProvider,
          theme,
        }).select('id').single();

        if (error) throw error;

        setIsBookmarked(true);
        setBookmarkId(data.id);
        toast.success("Bookmarked!", "Prompt saved to your collection");
      }
    } catch (error: any) {
      toast.error("Failed to Bookmark", error.message);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    toast.success("Signed Out", "You've been signed out successfully");
  };

  const handleEditToggle = () => {
    if (isEditing) {
      // Save changes
      setGeneratedPrompt(editedPrompt);
      setIsEditing(false);
      toast.success("Saved", "Your changes have been saved");
    } else {
      // Enter edit mode
      setEditedPrompt(generatedPrompt);
      setIsEditing(true);
    }
  };

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-radial from-primary/5 via-transparent to-transparent animate-pulse" />
      <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-secondary/10 rounded-full blur-3xl animate-float" />
      <div className="absolute bottom-0 left-0 w-1/2 h-1/2 bg-accent/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }} />

      {/* Header */}
      <header className="relative z-10 border-b border-border/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <button
            className="flex items-center gap-2"
            onClick={() => navigate('/')}
            aria-label="Go to Home"
          >
           <img src="/logo.png" alt="Forge" className="h-7 w-7" />
          </button>
          <div className="flex gap-2">
            {authLoaded && (user ? (
              <>
                <Button variant="ghost" size="icon" onClick={() => navigate('/bookmarks')} title="My Bookmarks">
                  <BookMarked className="h-5 w-5" />
                </Button>
                <Button variant="ghost" size="icon" onClick={() => navigate('/profile')} title="Profile">
                  <User className="h-5 w-5" />
                </Button>
                <Button variant="ghost" size="icon" onClick={() => navigate('/settings')} title="Settings">
                  <Settings className="h-5 w-5" />
                </Button>
                <Button variant="ghost" size="icon" onClick={handleLogout} title="Sign Out">
                  <LogOut className="h-5 w-5" />
                </Button>
              </>
            ) : (
              <Button variant="outline" onClick={() => navigate('/auth')}>Sign In</Button>
            ))}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto space-y-8">
          {/* Input Section */}
          <Card className="p-6 glass-effect border-primary/20">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Gem className="h-5 w-5 text-primary" />
              Describe Your Idea
            </h2>
            <Textarea
              placeholder="Tell me what you want to build... Be as detailed or as brief as you like!"
              value={userIdea}
              onChange={(e) => setUserIdea(e.target.value)}
              className="min-h-[150px] glass-effect border-primary/20 focus:border-primary"
            />
          </Card>

          {/* Selectors Grid */}
          <div className="grid md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <EnhancedDesignPatternSelector value={designPatterns} onChange={setDesignPatterns} />
            </div>
            <UILibrarySelector value={uiLibraries} onChange={setUiLibraries} />
            <EnhancedFontSelector value={fontFamily} onChange={setFontFamily} />
            <EnhancedTechStackSelector
              authProvider={authProvider}
              databaseProvider={databaseProvider}
              onAuthChange={setAuthProvider}
              onDatabaseChange={setDatabaseProvider}
            />
            <AIToolSelector value={aiTool} onChange={setAiTool} />
            <PaymentGatewaySelector value={paymentGateways} onChange={setPaymentGateways} />
            <Card className="p-6 glass-effect border-primary/20">
              <h3 className="text-sm font-medium mb-3">Theme</h3>
              <div className="flex gap-2">
                <Button
                  variant={theme === 'dark' ? 'default' : 'outline'}
                  onClick={() => setTheme('dark')}
                  className="flex-1"
                >
                  Dark
                </Button>
                <Button
                  variant={theme === 'light' ? 'default' : 'outline'}
                  onClick={() => setTheme('light')}
                  className="flex-1"
                >
                  Light
                </Button>
                <Button
                  variant={theme === 'both' ? 'default' : 'outline'}
                  onClick={() => setTheme('both')}
                  className="flex-1"
                >
                  Both
                </Button>
              </div>
            </Card>
          </div>

          {/* Generate Button */}
          <Button
            onClick={handleGenerate}
            disabled={isGenerating}
            className="w-full h-14 text-lg neon-glow"
            size="lg"
          >
            {isGenerating ? (
              <>
                <RefreshCw className="h-5 w-5 mr-2 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Gem className="h-5 w-5 mr-2" />
                Generate Prompt
              </>
            )}
          </Button>

          {/* Generated Prompt */}
          {generatedPrompt && (
            <Card className="p-6 glass-effect border-primary/20">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Your Generated Prompt</h2>
                <div className="flex gap-2">
                  <Button size="icon" variant="ghost" onClick={handleEditToggle} title={isEditing ? "Save Changes" : "Edit Prompt"}>
                    {isEditing ? <Check className="h-4 w-4" /> : <Edit className="h-4 w-4" />}
                  </Button>
                  <Button size="icon" variant="ghost" onClick={handleCopy} title="Copy to Clipboard">
                    <Copy className="h-4 w-4" />
                  </Button>
                  <Button size="icon" variant="ghost" onClick={handleBookmark} title={isBookmarked ? "Remove from Bookmarks" : "Add to Bookmarks"}>
                    <Heart className={`h-4 w-4 ${isBookmarked ? 'fill-red-500 text-red-500' : ''}`} />
                  </Button>
                  <Button size="icon" variant="ghost" onClick={handleGenerate} title="Regenerate">
                    <RefreshCw className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <div className="bg-background/50 p-4 rounded-lg border border-primary/10 max-h-[500px] overflow-y-auto">
                {isEditing ? (
                  <Textarea
                    value={editedPrompt}
                    onChange={(e) => setEditedPrompt(e.target.value)}
                    className="min-h-[400px] font-mono text-sm border-none bg-transparent resize-none focus:ring-0 focus:outline-none"
                    placeholder="Edit your prompt here..."
                  />
                ) : (
                  <div className="prose prose-invert prose-sm max-w-none">
                    <ReactMarkdown
                      remarkPlugins={[remarkGfm]}
                      components={{
                        code: ({ className, children, ...props }: any) => {
                          const inline = !className;
                          if (inline) {
                            return (
                              <code className="bg-muted px-1 py-0.5 rounded text-sm" {...props}>
                                {children}
                              </code>
                            );
                          }
                          return (
                            <pre className="bg-muted p-3 rounded-lg overflow-x-auto">
                              <code className={className} {...props}>
                                {children}
                              </code>
                            </pre>
                          );
                        },
                        pre: ({ children }) => <>{children}</>,
                        h1: ({ children }) => <h1 className="text-xl font-bold mb-2 text-primary">{children}</h1>,
                        h2: ({ children }) => <h2 className="text-lg font-semibold mb-2 text-secondary">{children}</h2>,
                        h3: ({ children }) => <h3 className="text-base font-medium mb-1 text-accent">{children}</h3>,
                        ul: ({ children }) => <ul className="list-disc list-inside mb-2 space-y-1">{children}</ul>,
                        ol: ({ children }) => <ol className="list-decimal list-inside mb-2 space-y-1">{children}</ol>,
                        li: ({ children }) => <li className="text-sm">{children}</li>,
                        p: ({ children }) => <p className="mb-2 text-sm leading-relaxed">{children}</p>,
                        strong: ({ children }) => <strong className="font-semibold text-primary">{children}</strong>,
                        em: ({ children }) => <em className="italic text-secondary">{children}</em>,
                      }}
                    >
                      {generatedPrompt}
                    </ReactMarkdown>
                  </div>
                )}
              </div>
            </Card>
          )}
        </div>
      </main>
      
      {/* Custom Toast Container */}
      <CustomToastContainer toasts={toasts} onRemove={removeToast} />
    </div>
  );
};

export default Generator;