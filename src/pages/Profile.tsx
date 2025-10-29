import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, User, Camera, Edit, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useCustomToast, CustomToastContainer } from "@/components/ui/custom-toast";
import { supabase } from "@/integrations/supabase/client";

const Profile = () => {
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [username, setUsername] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [promptCount, setPromptCount] = useState(0);
  const [bookmarkCount, setBookmarkCount] = useState(0);
  
  const { toast, toasts, removeToast } = useCustomToast();
  const navigate = useNavigate();

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      
      if (user) {
        // Fetch user profile
        const { data: profileData, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('user_id', user.id)
          .single();

        if (profileData) {
          setProfile(profileData);
          setUsername(profileData.username || user.email?.split('@')[0] || '');
          setAvatarUrl(profileData.avatar_url || '');
        } else {
          // Create profile if it doesn't exist
          const { data: newProfile, error: createError } = await supabase
            .from('profiles')
            .insert({
              user_id: user.id,
              username: user.email?.split('@')[0] || '',
            })
            .select()
            .single();

          if (newProfile) {
            setProfile(newProfile);
            setUsername(newProfile.username || '');
            setAvatarUrl(newProfile.avatar_url || '');
          }
        }

        // Load counts
        await Promise.all([
          loadPromptHistoryCount(user.id),
          loadBookmarkCount(user.id),
        ]);
      }
      
      setLoading(false);
    };
    
    getUser();
  }, []);

  const loadPromptHistoryCount = async (userId: string) => {
    try {
      const raw = localStorage.getItem(`prompt_history:${userId}`);
      if (!raw) {
        setPromptCount(0);
        return;
      }
      const items = JSON.parse(raw);
      setPromptCount(Array.isArray(items) ? items.length : 0);
    } catch {
      setPromptCount(0);
    }
  };

  const loadBookmarkCount = async (userId: string) => {
    try {
      const { count, error } = await supabase
        .from('bookmarked_prompts')
        .select('id', { count: 'exact', head: true })
        .eq('user_id', userId);
      if (error) throw error;
      setBookmarkCount(count || 0);
    } catch {
      setBookmarkCount(0);
    }
  };

  const handleSave = async () => {
    if (!user || !profile) return;
    
    setSaving(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          username: username.trim(),
          avatar_url: avatarUrl.trim(),
        })
        .eq('user_id', user.id);

      if (error) throw error;

      setProfile({
        ...profile,
        username: username.trim(),
        avatar_url: avatarUrl.trim(),
      });
      
      setIsEditing(false);
      toast.success("Profile updated successfully!");
    } catch (error: any) {
      toast.error("Failed to update profile", error.message);
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setUsername(profile?.username || user?.email?.split('@')[0] || '');
    setAvatarUrl(profile?.avatar_url || '');
    setIsEditing(false);
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="p-8 text-center glass-effect border-primary/20">
          <h1 className="text-2xl font-bold mb-4">Sign In Required</h1>
          <p className="text-muted-foreground mb-6">Please sign in to view your profile</p>
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
            <h1 className="text-2xl font-handwritten text-primary">Profile</h1>
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <Card className="p-8 glass-effect border-primary/20">
            <div className="flex flex-col items-center space-y-6">
              {/* Avatar Section */}
              <div className="relative">
                <Avatar className="h-24 w-24">
                  <AvatarImage src={avatarUrl} alt={username} />
                  <AvatarFallback className="text-2xl font-semibold bg-primary/20 text-primary">
                    {getInitials(username)}
                  </AvatarFallback>
                </Avatar>
                {isEditing && (
                  <Button
                    size="icon"
                    className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full"
                    onClick={() => {
                      const url = prompt('Enter avatar URL:');
                      if (url) setAvatarUrl(url);
                    }}
                  >
                    <Camera className="h-4 w-4" />
                  </Button>
                )}
              </div>

              {/* User Info */}
              <div className="text-center space-y-2">
                <h2 className="text-2xl font-bold">{username || 'Anonymous'}</h2>
                <p className="text-muted-foreground">{user.email}</p>
                <p className="text-sm text-muted-foreground">
                  Member since {new Date(user.created_at).toLocaleDateString()}
                </p>
              </div>

              {/* Edit Form */}
              {isEditing ? (
                <div className="w-full space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="username">Username</Label>
                    <Input
                      id="username"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder="Enter your username"
                      className="glass-effect border-primary/20"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="avatar">Avatar URL</Label>
                    <Input
                      id="avatar"
                      value={avatarUrl}
                      onChange={(e) => setAvatarUrl(e.target.value)}
                      placeholder="Enter avatar URL"
                      className="glass-effect border-primary/20"
                    />
                  </div>

                  <div className="flex gap-2 justify-center">
                    <Button
                      onClick={handleSave}
                      disabled={saving}
                      className="flex items-center gap-2"
                    >
                      {saving ? (
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                      ) : (
                        <Check className="h-4 w-4" />
                      )}
                      {saving ? 'Saving...' : 'Save Changes'}
                    </Button>
                    <Button
                      variant="outline"
                      onClick={handleCancel}
                      disabled={saving}
                      className="flex items-center gap-2"
                    >
                      <X className="h-4 w-4" />
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <Button
                  onClick={() => setIsEditing(true)}
                  className="flex items-center gap-2"
                >
                  <Edit className="h-4 w-4" />
                  Edit Profile
                </Button>
              )}

              {/* Stats */}
              <div className="w-full grid grid-cols-2 gap-4 pt-6 border-t border-border/50">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">{promptCount}</div>
                  <div className="text-sm text-muted-foreground">Prompts Generated</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-secondary">{bookmarkCount}</div>
                  <div className="text-sm text-muted-foreground">Bookmarks</div>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </main>
      
      {/* Custom Toast Container */}
      <CustomToastContainer toasts={toasts} onRemove={removeToast} />
    </div>
  );
};

export default Profile;
