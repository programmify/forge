import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

const AUTH_PROVIDERS = [
  { name: "Better Auth", badge: "Modern", rating: "⭐ 4.8", color: "bg-blue-500/20 text-blue-400" },
  { name: "Supabase Auth", badge: "Most Popular", rating: "⭐ 4.9", color: "bg-green-500/20 text-green-400" },
  { name: "Firebase Auth", badge: "Easy Setup", rating: "⭐ 4.7", color: "bg-orange-500/20 text-orange-400" },
  { name: "Auth0", badge: "Enterprise", rating: "⭐ 4.6", color: "bg-purple-500/20 text-purple-400" },
  { name: "Clerk", badge: "Developer Friendly", rating: "⭐ 4.8", color: "bg-pink-500/20 text-pink-400" },
  { name: "NextAuth", badge: "Next.js Native", rating: "⭐ 4.7", color: "bg-cyan-500/20 text-cyan-400" },
  { name: "Lucia", badge: "Lightweight", rating: "⭐ 4.5", color: "bg-yellow-500/20 text-yellow-400" },
  { name: "Keycloak", badge: "Open Source", rating: "⭐ 4.4", color: "bg-red-500/20 text-red-400" },
];

const DATABASE_PROVIDERS = [
  { name: "Supabase", badge: "Most Popular", rating: "⭐ 4.9", color: "bg-green-500/20 text-green-400" },
  { name: "Neon", badge: "Serverless Postgres", rating: "⭐ 4.7", color: "bg-cyan-500/20 text-cyan-400" },
  { name: "PlanetScale", badge: "MySQL at Scale", rating: "⭐ 4.8", color: "bg-blue-500/20 text-blue-400" },
  { name: "MongoDB", badge: "NoSQL Leader", rating: "⭐ 4.6", color: "bg-green-600/20 text-green-500" },
  { name: "Firebase", badge: "Easy Setup", rating: "⭐ 4.7", color: "bg-orange-500/20 text-orange-400" },
  { name: "PostgreSQL", badge: "Battle Tested", rating: "⭐ 4.8", color: "bg-indigo-500/20 text-indigo-400" },
  { name: "MySQL", badge: "Classic Choice", rating: "⭐ 4.5", color: "bg-blue-600/20 text-blue-500" },
  { name: "Prisma", badge: "Type-Safe ORM", rating: "⭐ 4.9", color: "bg-purple-500/20 text-purple-400" },
];

interface EnhancedTechStackSelectorProps {
  authProvider: string;
  databaseProvider: string;
  onAuthChange: (value: string) => void;
  onDatabaseChange: (value: string) => void;
}

export const EnhancedTechStackSelector = ({
  authProvider,
  databaseProvider,
  onAuthChange,
  onDatabaseChange,
}: EnhancedTechStackSelectorProps) => {
  const selectedAuth = AUTH_PROVIDERS.find(p => p.name === authProvider);
  const selectedDb = DATABASE_PROVIDERS.find(p => p.name === databaseProvider);

  return (
    <Card className="p-6 glass-effect border-primary/20">
      <h3 className="text-sm font-medium mb-3">Tech Stack</h3>
      <div className="space-y-4">
        <div>
          <label className="text-xs text-muted-foreground mb-2 block">Authentication</label>
          <Select value={authProvider} onValueChange={onAuthChange}>
            <SelectTrigger className="glass-effect border-primary/20">
              <SelectValue placeholder="Select auth provider" />
            </SelectTrigger>
            <SelectContent>
              {AUTH_PROVIDERS.map((provider) => (
                <SelectItem key={provider.name} value={provider.name}>
                  <div className="flex items-center justify-between gap-3 w-full">
                    <span>{provider.name}</span>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className={`text-xs ${provider.color}`}>
                        {provider.badge}
                      </Badge>
                      <span className="text-xs">{provider.rating}</span>
                    </div>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {selectedAuth && (
            <div className="mt-2 flex gap-2">
              <Badge variant="outline" className={`text-xs ${selectedAuth.color}`}>
                {selectedAuth.badge}
              </Badge>
              <span className="text-xs text-muted-foreground">{selectedAuth.rating}</span>
            </div>
          )}
        </div>
        
        <div>
          <label className="text-xs text-muted-foreground mb-2 block">Database</label>
          <Select value={databaseProvider} onValueChange={onDatabaseChange}>
            <SelectTrigger className="glass-effect border-primary/20">
              <SelectValue placeholder="Select database" />
            </SelectTrigger>
            <SelectContent>
              {DATABASE_PROVIDERS.map((provider) => (
                <SelectItem key={provider.name} value={provider.name}>
                  <div className="flex items-center justify-between gap-3 w-full">
                    <span>{provider.name}</span>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className={`text-xs ${provider.color}`}>
                        {provider.badge}
                      </Badge>
                      <span className="text-xs">{provider.rating}</span>
                    </div>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {selectedDb && (
            <div className="mt-2 flex gap-2">
              <Badge variant="outline" className={`text-xs ${selectedDb.color}`}>
                {selectedDb.badge}
              </Badge>
              <span className="text-xs text-muted-foreground">{selectedDb.rating}</span>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};
