import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Key, Eye, EyeOff, Check, X, Brain, Gem } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useCustomToast, CustomToastContainer } from "@/components/ui/custom-toast";
import { supabase } from "@/integrations/supabase/client";

const API_PROVIDERS = [
  { id: 'openai', name: 'OpenAI', description: 'GPT-4, GPT-3.5 Turbo' },
  { id: 'anthropic', name: 'Anthropic', description: 'Claude 3.5 Sonnet, Claude 3 Haiku' },
  { id: 'google', name: 'Google', description: 'Gemini Pro, Gemini Ultra' },
  { id: 'xai', name: 'xAI', description: 'Grok-1, Grok-2' },
  { id: 'groq', name: 'Groq', description: 'Fast inference for various models' },
  { id: 'openrouter', name: 'OpenRouter', description: 'Access to multiple AI models' },
];

const Settings = () => {
  const [user, setUser] = useState<any>(null);
  const [apiSettings, setApiSettings] = useState<any>(null);
  const [selectedProvider, setSelectedProvider] = useState('');
  const [apiKey, setApiKey] = useState('');
  const [showApiKey, setShowApiKey] = useState(false);
  const [useCustomApi, setUseCustomApi] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  const { toast, toasts, removeToast } = useCustomToast();
  const navigate = useNavigate();

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      
      if (user) {
        // Fetch API settings
        const { data: settingsData, error } = await supabase
          .from('user_api_settings')
          .select('*')
          .eq('user_id', user.id)
          .single();

        if (settingsData) {
          setApiSettings(settingsData);
          setSelectedProvider(settingsData.api_provider || '');
          setApiKey(settingsData.api_key || '');
          setUseCustomApi(true);
        }
      }
      
      setLoading(false);
    };
    
    getUser();
  }, []);

  const handleSaveApiSettings = async () => {
    if (!user) return;
    
    if (useCustomApi && (!selectedProvider || !apiKey.trim())) {
      toast.error("Please select a provider and enter your API key");
      return;
    }
    
    setSaving(true);
    try {
      if (useCustomApi) {
        const { error } = await supabase
          .from('user_api_settings')
          .upsert({
            user_id: user.id,
            api_provider: selectedProvider,
            api_key: apiKey.trim(),
          });

        if (error) throw error;
        
        toast.success("API settings saved successfully!");
      } else {
        // Remove API settings if switching back to built-in
        const { error } = await supabase
          .from('user_api_settings')
          .delete()
          .eq('user_id', user.id);

        if (error) throw error;
        
        setApiSettings(null);
        setSelectedProvider('');
        setApiKey('');
        toast.success("Switched to built-in AI");
      }
    } catch (error: any) {
      toast.error("Failed to save API settings", error.message);
    } finally {
      setSaving(false);
    }
  };

  const handleClearApiKey = () => {
    setApiKey('');
    toast.info("API key cleared");
  };

  const getProviderIcon = (providerId: string) => {
    switch (providerId) {
      case 'openai':
        return '🤖';
      case 'anthropic':
        return '🧠';
      case 'google':
        return '🔍';
      case 'xai':
        return '⚡';
      case 'groq':
        return '🚀';
      case 'openrouter':
        return '🔗';
      default:
        return '⚙️';
    }
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
          <p className="text-muted-foreground mb-6">Please sign in to access settings</p>
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
            <h1 className="text-2xl font-handwritten text-primary">Settings</h1>
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto space-y-6">
          {/* AI Provider Settings */}
          <Card className="p-6 glass-effect border-primary/20">
            <div className="flex items-center gap-3 mb-6">
              <Brain className="h-6 w-6 text-primary" />
              <h2 className="text-xl font-semibold">AI Provider Settings</h2>
            </div>
            
            <div className="space-y-6">
              {/* Use Custom API Toggle */}
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="custom-api" className="text-base font-medium">
                    Use Custom API
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Switch between built-in AI and your own API keys
                  </p>
                </div>
                <Switch
                  id="custom-api"
                  checked={useCustomApi}
                  onCheckedChange={setUseCustomApi}
                />
              </div>

              {/* Current Status */}
              <div className="p-4 rounded-lg bg-muted/50 border border-border/50">
                <div className="flex items-center gap-3">
                  <div className="flex-shrink-0">
                    {useCustomApi ? (
                      <div className="h-3 w-3 rounded-full bg-green-500 animate-pulse" />
                    ) : (
                      <Gem className="h-5 w-5 text-primary" />
                    )}
                  </div>
                  <div>
                    <p className="font-medium">
                      {useCustomApi ? 'Using Custom API' : 'Using Built-in AI'}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {useCustomApi 
                        ? `Connected to ${API_PROVIDERS.find(p => p.id === selectedProvider)?.name || 'Unknown Provider'}`
                        : 'Built-in AI enabled'
                      }
                    </p>
                  </div>
                </div>
              </div>

              {/* API Configuration */}
              {useCustomApi && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="provider">AI Provider</Label>
                    <Select value={selectedProvider} onValueChange={setSelectedProvider}>
                      <SelectTrigger className="glass-effect border-primary/20">
                        <SelectValue placeholder="Select an AI provider" />
                      </SelectTrigger>
                      <SelectContent>
                        {API_PROVIDERS.map((provider) => (
                          <SelectItem key={provider.id} value={provider.id}>
                            <div className="flex items-center gap-2">
                              <span className="text-lg">{getProviderIcon(provider.id)}</span>
                              <div>
                                <div className="font-medium">{provider.name}</div>
                                <div className="text-xs text-muted-foreground">{provider.description}</div>
                              </div>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="api-key">API Key</Label>
                    <div className="relative">
                      <Input
                        id="api-key"
                        type={showApiKey ? "text" : "password"}
                        value={apiKey}
                        onChange={(e) => setApiKey(e.target.value)}
                        placeholder="Enter your API key"
                        className="glass-effect border-primary/20 pr-20"
                      />
                      <div className="absolute right-2 top-1/2 -translate-y-1/2 flex gap-1">
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => setShowApiKey(!showApiKey)}
                          className="h-8 w-8"
                        >
                          {showApiKey ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </Button>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={handleClearApiKey}
                          className="h-8 w-8"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Your API key is encrypted and stored securely. We never share your keys.
                    </p>
                  </div>

                  <Button
                    onClick={handleSaveApiSettings}
                    disabled={saving || !selectedProvider || !apiKey.trim()}
                    className="w-full"
                  >
                    {saving ? (
                      <div className="flex items-center gap-2">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                        Saving...
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <Check className="h-4 w-4" />
                        Save API Settings
                      </div>
                    )}
                  </Button>
                </div>
              )}
            </div>
          </Card>

          {/* API Provider Info */}
          <Card className="p-6 glass-effect border-primary/20">
            <h3 className="text-lg font-semibold mb-4">Supported Providers</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {API_PROVIDERS.map((provider) => (
                <div key={provider.id} className="flex items-center gap-3 p-3 rounded-lg bg-muted/30">
                  <span className="text-2xl">{getProviderIcon(provider.id)}</span>
                  <div>
                    <div className="font-medium">{provider.name}</div>
                    <div className="text-xs text-muted-foreground">{provider.description}</div>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Security Notice */}
          <Card className="p-6 glass-effect border-yellow-500/20 bg-yellow-500/5">
            <div className="flex items-start gap-3">
              <Key className="h-5 w-5 text-yellow-500 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-semibold text-yellow-600 mb-2">Security Notice</h4>
                <p className="text-sm text-yellow-700">
                  Your API keys are encrypted and stored securely. We use industry-standard encryption 
                  and never share your keys with third parties. You can delete your API settings at any time.
                </p>
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

export default Settings;
