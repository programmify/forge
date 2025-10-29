import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const DESIGN_PATTERNS = [
  {
    name: "Neobrutalism",
    description: "Bold borders, stark colors",
    example: "bg-yellow-400 border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
  },
  {
    name: "Minimalist",
    description: "Clean, simple, focused",
    example: "bg-white border border-gray-200"
  },
  {
    name: "Glassmorphism",
    description: "Frosted glass effect",
    example: "bg-white/10 backdrop-blur-lg border border-white/20"
  },
  {
    name: "Neumorphism",
    description: "Soft UI, subtle shadows",
    example: "bg-gray-200 shadow-[8px_8px_16px_#bebebe,-8px_-8px_16px_#ffffff]"
  },
  {
    name: "Material Design",
    description: "Google's design system",
    example: "bg-blue-500 shadow-lg rounded-lg"
  },
  {
    name: "Flat Design",
    description: "2D, no gradients",
    example: "bg-purple-500"
  },
  {
    name: "Skeuomorphism",
    description: "Real-world mimicry",
    example: "bg-gradient-to-b from-gray-300 to-gray-400 shadow-inner"
  },
  {
    name: "Swiss Style",
    description: "Grid-based, typography",
    example: "bg-white border-l-4 border-red-600"
  },
  {
    name: "Art Deco",
    description: "Geometric, luxurious",
    example: "bg-gradient-to-br from-amber-300 via-yellow-400 to-amber-600 border border-amber-700/30"
  },
  {
    name: "Memphis Design",
    description: "Bold shapes, bright colors",
    example: "bg-gradient-to-r from-pink-500 via-yellow-400 to-cyan-400"
  },
  {
    name: "Bauhaus",
    description: "Form follows function",
    example: "bg-red-600 border-8 border-black"
  },
  {
    name: "Brutalism",
    description: "Raw, unpolished",
    example: "bg-gray-800 border border-gray-600"
  },
  {
    name: "Cyberpunk",
    description: "Neon, futuristic",
    example: "bg-black border-2 border-cyan-400 shadow-[0_0_10px_#00ffff]"
  },
  {
    name: "Vaporwave",
    description: "Retro, pastel, glitch",
    example: "bg-gradient-to-r from-pink-300 via-purple-300 to-blue-300"
  },
  {
    name: "Y2K",
    description: "Early 2000s aesthetic",
    example: "bg-gradient-to-br from-blue-400 via-purple-400 to-pink-400"
  },
];

interface EnhancedDesignPatternSelectorProps {
  value: string[];
  onChange: (value: string[]) => void;
}

export const EnhancedDesignPatternSelector = ({ value, onChange }: EnhancedDesignPatternSelectorProps) => {
  const togglePattern = (pattern: string) => {
    if (value.includes(pattern)) {
      onChange(value.filter((p) => p !== pattern));
    } else {
      onChange([...value, pattern]);
    }
  };

  return (
    <Card className="p-6 glass-effect border-primary/20">
      <h3 className="text-sm font-medium mb-3">Design Patterns</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
        {DESIGN_PATTERNS.map((pattern) => (
          <div
            key={pattern.name}
            onClick={() => togglePattern(pattern.name)}
            className={`
              p-3 rounded-lg border-2 cursor-pointer transition-all hover:scale-[1.02]
              ${value.includes(pattern.name) 
                ? 'border-primary bg-primary/10' 
                : 'border-border/50 bg-background/50'
              }
            `}
          >
            <div className="flex items-center justify-between gap-3">
              <div className="flex-1">
                <div className="font-medium text-sm mb-1">{pattern.name}</div>
                <div className="text-xs text-muted-foreground">{pattern.description}</div>
              </div>
              <div className={`w-12 h-12 rounded ${pattern.example}`} />
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};
