import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Bookmark, MessageSquare, Trash, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useCustomToast, CustomToastContainer } from "@/components/ui/custom-toast";
import { supabase } from "@/integrations/supabase/client";

interface BookmarkedPrompt {
  id: string;
  prompt_title: string;
  prompt_content: string;
  design_patterns: string[];
  ui_libraries: string[];
  font_family: string;
  auth_provider: string;
  database_provider: string;
  theme: string;
  created_at: string;
}

interface HistoryItem {
  id: string;
  prompt_title: string;
  prompt_content: string;
  design_patterns: string[];
  ui_libraries: string[];
  font_family: string;
  auth_provider: string;
  database_provider: string;
  theme: string;
  created_at: string;
}

const Bookmarks = () => {
  const [bookmarks, setBookmarks] = useState<BookmarkedPrompt[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  
  const { toast, toasts, removeToast } = useCustomToast();
  const navigate = useNavigate();

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      if (user) {
        fetchBookmarksFor(user.id);
      } else {
        setLoading(false);
      }
    };
    getUser();
  }, []);

  const fetchBookmarksFor = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('bookmarked_prompts')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setBookmarks(data || []);
    } catch (error: any) {
      toast.error("Failed to fetch bookmarks");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.id) {
      fetchBookmarksFor(user.id);
    }
  }, [user?.id]);

  const handleDeleteBookmark = async (id: string) => {
    try {
      const { error } = await supabase
        .from('bookmarked_prompts')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      setBookmarks(bookmarks.filter(bookmark => bookmark.id !== id));
      toast.success("Bookmark removed successfully");
    } catch (error: any) {
      toast.error("Failed to delete bookmark");
    }
  };

  const handleContinueChat = (bookmark: BookmarkedPrompt) => {
    // Navigate to generator with pre-filled data
    const params = new URLSearchParams({
      title: bookmark.prompt_title,
      content: bookmark.prompt_content,
      design_patterns: bookmark.design_patterns.join(','),
      ui_libraries: bookmark.ui_libraries.join(','),
      font_family: bookmark.font_family,
      auth_provider: bookmark.auth_provider,
      database_provider: bookmark.database_provider,
      theme: bookmark.theme,
    });
    navigate(`/generator?${params.toString()}`);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 text-primary animate-spin" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="p-8 text-center glass-effect border-primary/20">
          <h1 className="text-2xl font-bold mb-4">Sign In Required</h1>
          <p className="text-muted-foreground mb-6">Please sign in to view your bookmarks</p>
          <Button onClick={() => navigate('/auth')}>Sign In</Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-radial from-primary/5 via-transparent to-transparent animate-pulse" />
      <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-secondary/10 rounded-full blur-3xl animate-float" />
      <div className="absolute bottom-0 left-0 w-1/2 h-1/2 bg-accent/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }} />

      {/* Header */}
      <header className="relative z-10 border-b border-border/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate('/generator')}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <button
            className="flex items-center gap-2"
            onClick={() => navigate('/')}
            aria-label="Go to Home"
          >
            <h1 className="text-2xl font-handwritten text-primary">My Collection</h1>
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Content */}
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <Loader2 className="h-8 w-8 text-primary animate-spin" />
              <p className="mt-4 text-muted-foreground">Loading your bookmarks...</p>
            </div>
          ) : bookmarks.length === 0 ? (
            <Card className="p-8 text-center glass-effect border-primary/20">
              <Bookmark className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">No Bookmarks Yet</h3>
              <p className="text-muted-foreground mb-6">
                Start creating prompts and bookmark your favorites to see them here.
              </p>
              <Button onClick={() => navigate('/generator')}>
                Create Your First Prompt
              </Button>
            </Card>
          ) : (
            <div className="grid gap-6">
              {bookmarks.map((bookmark) => (
                <Card key={bookmark.id} className="p-6 glass-effect border-primary/20">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold mb-2">{bookmark.prompt_title}</h3>
                      <p className="text-sm text-muted-foreground mb-3">
                        {formatDate(bookmark.created_at)}
                      </p>
                      <div className="flex flex-wrap gap-2 mb-4">
                        {bookmark.design_patterns.map((pattern, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {pattern}
                          </Badge>
                        ))}
                        {bookmark.ui_libraries.map((library, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {library}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div className="flex gap-2 ml-4">
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => handleContinueChat(bookmark)}
                        title="Continue Chat"
                      >
                        <MessageSquare className="h-4 w-4" />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => handleDeleteBookmark(bookmark.id)}
                        title="Delete"
                      >
                        <Trash className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <div className="bg-background/50 p-4 rounded-lg border border-primary/10 max-h-[200px] overflow-y-auto">
                    <pre className="whitespace-pre-wrap font-mono text-sm text-muted-foreground">
                      {bookmark.prompt_content.substring(0, 500)}
                      {bookmark.prompt_content.length > 500 && '...'}
                    </pre>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>
      
      {/* Custom Toast Container */}
      <CustomToastContainer toasts={toasts} onRemove={removeToast} />
    </div>
  );
};

export default Bookmarks;
