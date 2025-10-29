import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Star } from "lucide-react";

interface GithubStarsProps {
  repo?: string; // e.g., "owner/repo"
  className?: string;
}

export const GithubStars: React.FC<GithubStarsProps> = ({ repo, className }) => {
  const [stars, setStars] = useState<number | null>(null);
  const [href, setHref] = useState<string>("#");

  useEffect(() => {
    const repoPath = repo || import.meta.env.VITE_GITHUB_REPO || "programmify/forge";
    if (!repoPath) return;
    setHref(`https://github.com/${repoPath}`);

    const controller = new AbortController();
    fetch(`https://api.github.com/repos/${repoPath}`, { signal: controller.signal })
      .then((r) => r.ok ? r.json() : null)
      .then((data) => {
        if (data && typeof data.stargazers_count === "number") {
          setStars(data.stargazers_count);
        }
      })
      .catch(() => {
        // ignore network/API errors; leave stars null
      });

    return () => controller.abort();
  }, [repo]);

  return (
    <Button 
      variant="outline" 
      className="gap-2 h-9 px-3 glass-effect border-primary/20"
      asChild
    >
      <a 
        href="https://github.com/programmify/forge" 
        target="_blank" 
        rel="noopener noreferrer"
      >
        <>
          <Star className="w-4 h-4" fill="currentColor" />
          <span>Star on GitHub</span>
          {stars !== null && (
            <span className="bg-white/20 px-2 py-0.5 rounded-full text-xs">
              {stars}
            </span>
          )}
        </>
      </a>
    </Button>
  );
};

export default GithubStars;


