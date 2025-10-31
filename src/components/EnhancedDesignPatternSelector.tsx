import { useState } from "react";
import { Card } from "@/components/ui/card";
import { X } from "lucide-react";

const DESIGN_PATTERNS = [
  {
    name: "Neobrutalism",
    description: "Bold borders, geometric shapes, strong colors, and intentional 'imperfection'",
    example: () => (
      <div className="w-full h-full bg-secondary/20 p-8 flex items-center justify-center">
        <div className="bg-card border-2 border-primary p-6 rounded-lg shadow-[4px_4px_0px_0px_hsl(var(--primary))] max-w-sm w-full">
          <h2 className="text-2xl font-bold mb-4 text-center text-primary">HELLO!</h2>
          <p className="text-center mb-6 text-foreground">This is neobrutalism in action.</p>
          <button className="bg-primary border-2 border-primary px-8 py-3 font-bold text-primary-foreground rounded-md shadow-[2px_2px_0px_0px_hsl(var(--primary))] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[1px_1px_0px_0px_hsl(var(--primary))] transition-all w-full">
            CLICK ME
          </button>
          <div className="mt-6 bg-secondary/40 border-2 border-primary p-4 rounded-md">
            <p className="font-bold text-center text-foreground">Bold. Raw. Unapologetic.</p>
          </div>
        </div>
      </div>
    )
  },
  {
    name: "Minimalist",
    description: "Clean layout, subtle borders, ample whitespace, simple elements",
    example: () => (
      <div className="w-full h-full bg-card/30 p-8 flex items-center justify-center">
        <div className="bg-card p-8 max-w-sm w-full border border-border">
          <h2 className="text-2xl font-medium mb-8 text-center text-foreground">Simplicity</h2>
          <p className="text-muted-foreground mb-8 leading-relaxed text-center">
            Less is more. Every element serves a purpose. Clean lines and thoughtful spacing create harmony.
          </p>
          <button className="border border-primary px-8 py-2 text-sm text-primary hover:bg-primary hover:text-primary-foreground transition-colors w-full rounded-md">
            Learn More
          </button>
          <div className="mt-12 pt-8 border-t border-border flex justify-center">
            <div className="w-16 h-0.5 bg-primary"></div>
          </div>
        </div>
      </div>
    )
  },
  {
    name: "Glassmorphism",
    description: "Frosted glass effect with transparency, blur, and subtle borders",
    example: () => (
      <div className="w-full h-full bg-gradient-to-br from-primary via-secondary to-accent p-8 flex items-center justify-center relative overflow-hidden">
        <div className="absolute top-10 left-10 w-20 h-20 bg-primary/30 rounded-full blur-2xl"></div>
        <div className="absolute bottom-10 right-10 w-30 h-30 bg-secondary/30 rounded-full blur-2xl"></div>
        <div className="glass-effect border border-primary/30 p-6 max-w-sm w-full shadow-lg rounded-lg">
          <h2 className="text-2xl font-medium mb-4 text-primary-foreground text-center">Glass Effect</h2>
          <p className="text-primary-foreground/90 mb-6 text-center">
            Transparent layers with backdrop blur create depth and modern aesthetics.
          </p>
          <button className="glass-effect border border-primary/40 px-6 py-3 rounded-md text-primary-foreground hover:bg-primary/20 transition-all w-full">
            Explore
          </button>
          <div className="mt-6 glass-effect p-4 border border-primary/20 rounded-md">
            <p className="text-primary-foreground text-center">Layered transparency ✨</p>
          </div>
        </div>
      </div>
    )
  },
  {
    name: "Neumorphism",
    description: "Soft shadows creating inset/outset appearance, subtle and tactile",
    example: () => (
      <div className="w-full h-full bg-card p-8 flex items-center justify-center">
        <div className="bg-card rounded-xl p-8 max-w-sm w-full shadow-[10px_10px_20px_hsl(var(--border)/0.3),-10px_-10px_20px_hsl(var(--background)/0.8)]">
          <h2 className="text-2xl font-medium mb-4 text-center text-foreground">Soft UI</h2>
          <p className="text-center mb-6 text-muted-foreground">
            Elements appear to extrude from or sink into the background.
          </p>
          <button className="bg-card px-6 py-3 rounded-lg text-foreground font-medium w-full shadow-[5px_5px_10px_hsl(var(--border)/0.3),-5px_-5px_10px_hsl(var(--background)/0.8)]">
            Press Me
          </button>
          <div className="mt-6 bg-card rounded-lg p-4 shadow-[inset_5px_5px_10px_hsl(var(--border)/0.3),inset_-5px_-5px_10px_hsl(var(--background)/0.8)]">
            <p className="text-center text-muted-foreground">Inset shadow effect</p>
          </div>
        </div>
      </div>
    )
  },
  {
    name: "Material Design",
    description: "Layered elements with elevation shadows, inspired by paper and ink",
    example: () => (
      <div className="w-full h-full bg-card/30 p-8 flex items-center justify-center">
        <div className="bg-card rounded-lg shadow-lg p-8 max-w-sm w-full">
          <h2 className="text-2xl font-medium mb-4 text-center text-foreground">Material Card</h2>
          <p className="text-muted-foreground mb-6 text-center">
            Elevation and motion create hierarchy and focus through depth.
          </p>
          <button className="bg-primary px-6 py-3 rounded text-primary-foreground font-medium shadow-md hover:shadow-xl hover:bg-primary/90 transition-all w-full">
            ACTION
          </button>
          <div className="mt-6 bg-muted rounded p-4 shadow-inner">
            <div className="flex items-center justify-center space-x-4">
              <div className="w-16 h-16 bg-secondary rounded-full shadow-md"></div>
              <div>
                <p className="font-medium text-foreground">Elevated Element</p>
                <p className="text-sm text-muted-foreground">With shadow depth</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  },
  {
    name: "Flat Design",
    description: "Simple 2D elements without gradients or shadows, clean and direct",
    example: () => (
      <div className="w-full h-full bg-primary/20 p-8 flex items-center justify-center">
        <div className="bg-card p-8 max-w-sm w-full">
          <h2 className="text-3xl font-bold mb-4 text-center text-foreground">Flat & Direct</h2>
          <p className="text-center mb-6 text-muted-foreground">
            No shadows. No gradients. Just pure, functional design.
          </p>
          <button className="bg-secondary px-6 py-3 text-foreground font-bold hover:bg-secondary/80 transition-colors w-full rounded-md">
            GET STARTED
          </button>
          <div className="mt-6 flex justify-center space-x-4">
            <div className="w-20 h-20 bg-primary"></div>
            <div className="w-20 h-20 bg-secondary"></div>
            <div className="w-20 h-20 bg-accent"></div>
          </div>
        </div>
      </div>
    )
  },
  {
    name: "Skeuomorphism",
    description: "Elements mimic real-world textures and objects with realistic details",
    example: () => (
      <div className="w-full h-full bg-gradient-to-b from-card to-muted p-8 flex items-center justify-center">
        <div className="bg-gradient-to-b from-muted to-card rounded-xl p-8 max-w-sm w-full border border-border">
          <h2 className="text-2xl font-bold mb-4 text-foreground text-center">Leather Wallet</h2>
          <p className="text-muted-foreground mb-6 text-center">
            Design that mimics physical materials and textures.
          </p>
          <button className="bg-gradient-to-b from-primary to-primary/80 px-6 py-3 rounded-lg text-primary-foreground font-bold border border-primary/40 w-full">
            Open
          </button>
          <div className="mt-6 bg-gradient-to-b from-accent to-accent/80 rounded-lg p-4 border border-border/50">
            <p className="text-accent-foreground text-center">Wood texture effect</p>
          </div>
        </div>
      </div>
    )
  },
  {
    name: "Swiss Style",
    description: "Clean grid-based typography layout, asymmetrical composition",
    example: () => (
      <div className="w-full h-full bg-card p-8 flex items-center justify-center">
        <div className="max-w-2xl w-full grid grid-cols-12 gap-4">
          <div className="col-span-1 bg-primary h-full"></div>
          <div className="col-span-11">
            <h2 className="text-4xl font-bold mb-2 text-foreground leading-none tracking-tight">SWISS</h2>
            <h3 className="text-2xl font-medium text-muted-foreground mb-6">Typography</h3>
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="col-span-2">
                <p className="text-sm text-foreground leading-relaxed">
                  Grid systems organize information with mathematical precision. Typography is the primary design element.
                </p>
              </div>
              <div className="bg-foreground h-20"></div>
            </div>
            <div className="grid grid-cols-4 gap-2">
              <div className="bg-muted h-12"></div>
              <div className="bg-foreground h-12 col-span-2"></div>
              <div className="bg-primary h-12"></div>
            </div>
          </div>
        </div>
      </div>
    )
  },
  {
    name: "Art Deco",
    description: "Geometric patterns with luxurious styling and golden accents",
    example: () => (
      <div className="w-full h-full bg-gradient-to-b from-card to-muted p-8 flex items-center justify-center">
        <div className="bg-gradient-to-b from-muted to-card p-8 max-w-sm w-full relative overflow-hidden border border-accent">
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-accent to-primary"></div>
          <h2 className="text-3xl font-bold mb-4 text-accent text-center">GLAMOUR</h2>
          <p className="text-muted-foreground mb-6 italic text-center">
            Luxurious geometric patterns inspired by the roaring twenties.
          </p>
          <button className="bg-gradient-to-r from-accent to-primary px-8 py-3 text-foreground font-bold border border-accent/50 w-full rounded-md">
            ENTER
          </button>
          <div className="mt-6 border border-accent/50 p-4">
            <p className="text-accent text-center font-bold">★ PREMIUM ★</p>
          </div>
        </div>
      </div>
    )
  },
  {
    name: "Memphis Design",
    description: "Bold shapes, bright colors, and playful geometric patterns",
    example: () => (
      <div className="w-full h-full bg-primary/20 p-8 flex items-center justify-center relative overflow-hidden">
        <div className="absolute top-10 left-10 w-24 h-24 bg-secondary rounded-full"></div>
        <div className="absolute bottom-10 right-10 w-32 h-32 bg-accent rotate-45"></div>
        <div className="absolute top-1/2 left-10 w-1 h-40 bg-foreground"></div>
        <div className="bg-card p-8 max-w-sm w-full border border-foreground relative z-10">
          <h2 className="text-4xl font-bold mb-4 text-center text-foreground">MEMPHIS</h2>
          <p className="text-foreground mb-6 font-bold text-center">
            Chaotic fun with geometric shapes and vibrant colors!
          </p>
          <button className="bg-secondary px-6 py-3 text-foreground font-bold border border-foreground relative w-full">
            GO WILD
          </button>
          <div className="mt-6 flex justify-center space-x-2">
            <div className="w-16 h-16 bg-accent border border-foreground"></div>
            <div className="w-16 h-16 bg-secondary rounded-full border border-foreground"></div>
            <div className="w-16 h-16 bg-primary border border-foreground rotate-45"></div>
          </div>
        </div>
      </div>
    )
  },
  {
    name: "Bauhaus",
    description: "Geometric forms with primary colors, form follows function",
    example: () => (
      <div className="w-full h-full bg-card/30 p-8 flex items-center justify-center">
        <div className="max-w-sm w-full">
          <div className="flex justify-center space-x-4 mb-8">
            <div className="w-24 h-24 bg-primary rounded-full"></div>
            <div className="w-24 h-24 bg-secondary"></div>
            <div className="w-24 h-24 bg-accent" style={{ clipPath: 'polygon(50% 0%, 100% 100%, 0% 100%)' }}></div>
          </div>
          <h2 className="text-4xl font-bold mb-4 text-center text-foreground">BAUHAUS</h2>
          <p className="text-muted-foreground mb-6 font-medium text-center">
            Form follows function. Simple geometric shapes create balance.
          </p>
          <button className="bg-primary px-8 py-3 text-primary-foreground font-bold w-full rounded-md">
            DISCOVER
          </button>
          <div className="mt-6 grid grid-cols-3 gap-2">
            <div className="h-20 bg-primary"></div>
            <div className="h-20 bg-secondary"></div>
            <div className="h-20 bg-accent"></div>
          </div>
        </div>
      </div>
    )
  },
  {
    name: "Brutalism",
    description: "Raw, unpolished aesthetic with exposed structure",
    example: () => (
      <div className="w-full h-full bg-card/30 p-8 flex items-center justify-center font-mono">
        <div className="bg-card border border-foreground p-8 max-w-sm w-full">
          <div className="border border-foreground p-2 mb-4 inline-block">
            <h2 className="text-2xl font-bold text-foreground">[BRUTALISM]</h2>
          </div>
          <p className="text-foreground mb-6 text-center leading-tight">
            {'> RAW_HTML\n> NO_POLISH\n> FUNCTION_OVER_FORM\n> EXPOSED_STRUCTURE'}
          </p>
          <div className="bg-foreground text-card p-3 mb-4 font-bold text-center">
            $ CLICK_HERE
          </div>
          <div className="border border-foreground p-4">
            <div className="flex justify-between text-center">
              <span>[LEFT]</span>
              <span>[CENTER]</span>
              <span>[RIGHT]</span>
            </div>
          </div>
          <div className="mt-4 text-center text-muted-foreground">
            INDEX.HTML / STYLE: NONE
          </div>
        </div>
      </div>
    )
  },
  {
    name: "Cyberpunk",
    description: "Neon colors with futuristic elements and dark backgrounds",
    example: () => (
      <div className="w-full h-full bg-card p-8 flex items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/20 via-card to-accent/20"></div>
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-400 via-pink-500 to-purple-500"></div>
        <div className="relative z-10 bg-card border border-primary p-8 max-w-sm w-full neon-glow">
          <h2 className="text-2xl font-bold mb-4 text-primary text-center">
            CYBER//PUNK
          </h2>
          <p className="text-accent mb-6 font-mono text-center">
            {'> WELCOME TO THE FUTURE\n> NEON_LIGHTS = TRUE\n> MATRIX_MODE = ON'}
          </p>
          <button className="bg-gradient-to-r from-primary to-accent px-6 py-3 text-primary-foreground font-bold border border-primary w-full rounded-md">
            JACK IN
          </button>
          <div className="mt-6 border border-primary p-4 bg-primary/10">
            <div className="flex items-center justify-center space-x-2">
              <div className="w-4 h-4 bg-primary animate-pulse"></div>
              <p className="text-primary font-mono">SYSTEM_ONLINE</p>
            </div>
          </div>
        </div>
      </div>
    )
  },
  {
    name: "Vaporwave",
    description: "Pastel gradients with retro elements and surreal aesthetics",
    example: () => (
      <div className="w-full h-full bg-gradient-to-br from-primary/10 via-secondary/10 to-accent/10 p-8 flex items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0" style={{ backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, hsla(0,0%,100%,0.1) 2px, hsla(0,0%,100%,0.1) 4px)' }}></div>
        </div>
        <div className="relative z-10 bg-gradient-to-br from-primary/10 to-secondary/10 backdrop-blur-sm p-8 max-w-sm w-full border border-border/30 rounded-lg">
          <h2 className="text-3xl font-bold mb-4 text-primary text-center">
            ｖａｐｏｒｗａｖｅ
          </h2>
          <p className="text-secondary mb-6 italic text-center">
            Nostalgic dreams of a digital paradise that never existed
          </p>
          <button className="bg-gradient-to-r from-primary to-secondary px-6 py-3 text-foreground font-medium rounded-md border border-border w-full">
            ✧ Enter ✧
          </button>
          <div className="mt-6 bg-background/40 rounded p-4 border border-border/30">
            <p className="text-secondary text-center font-mono">
              ░ ▒ ▓ █ A E S T H E T I C █ ▓ ▒ ░
            </p>
          </div>
        </div>
      </div>
    )
  },
  {
    name: "Y2K",
    description: "Early 2000s aesthetic with bright gradients and metallic effects",
    example: () => (
      <div className="w-full h-full bg-gradient-to-br from-primary/30 via-secondary/30 to-accent/30 p-8 flex items-center justify-center relative overflow-hidden">
        <div className="absolute top-10 left-10 text-2xl opacity-20">✨</div>
        <div className="absolute bottom-10 right-10 text-2xl opacity-20">💫</div>
        <div className="relative z-10 bg-gradient-to-br from-card to-primary/10 p-8 max-w-sm w-full rounded-xl border border-border/50 glass-effect">
          <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent text-center">
            Y2K Vibes
          </h2>
          <p className="text-foreground mb-6 font-medium text-center">
            Shiny chrome, bright gradients, and butterfly clips! ✨
          </p>
          <button className="bg-gradient-to-r from-primary to-secondary px-6 py-3 text-primary-foreground font-bold rounded-md border border-border w-full glass-effect">
            Click Me! 🦋
          </button>
          <div className="mt-6 bg-gradient-to-r from-secondary/20 to-accent/20 rounded-lg p-4 border border-border/50">
            <p className="text-secondary text-center font-bold">⭐ Super Cool! ⭐</p>
          </div>
        </div>
      </div>
    )
  }
];

interface EnhancedDesignPatternSelectorProps {
  value: string[];
  onChange: (value: string[]) => void;
}

export const EnhancedDesignPatternSelector = ({ value, onChange }: EnhancedDesignPatternSelectorProps) => {
  const [previewPattern, setPreviewPattern] = useState<string | null>(null);

  const togglePattern = (pattern: string) => {
    if (value.includes(pattern)) {
      onChange(value.filter((p) => p !== pattern));
    } else {
      onChange([...value, pattern]);
    }
  };

  const selectedPattern = DESIGN_PATTERNS.find(p => p.name === previewPattern);

  return (
    <>
      <Card className="p-6 glass-effect border-primary/20">
        <h3 className="text-lg font-semibold mb-4 text-foreground">Design Patterns</h3>
        <p className="text-sm text-muted-foreground mb-6">Click on any card to preview the design pattern in full size</p>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {DESIGN_PATTERNS.map((pattern) => {
            const isSelected = value.includes(pattern.name);
            
            return (
              <div
                key={pattern.name}
                className={`
                  relative rounded-lg border transition-all cursor-pointer group
                  ${isSelected 
                    ? 'border-primary ring-2 ring-primary/30 bg-primary/5' 
                    : 'border-border hover:border-primary/50'
                  }
                `}
              >
                {/* Preview thumbnail */}
                <div 
                  className="h-48 rounded-lg overflow-hidden relative"
                  onClick={() => setPreviewPattern(pattern.name)}
                >
                  <div className="w-full h-full scale-100 origin-top-left">
                    {pattern.example()}
                  </div>
                  <div className="absolute inset-0 bg-card bg-opacity-0 group-hover:bg-opacity-30 transition-all flex items-center justify-center">
                    <div className="bg-foreground text-card px-4 py-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity text-sm font-medium">
                      Click to preview
                    </div>
                  </div>
                </div>

                {/* Card footer with checkbox */}
                <div 
                  className="p-3 bg-card rounded-b-lg"
                  onClick={(e) => {
                    e.stopPropagation();
                    togglePattern(pattern.name);
                  }}
                >
                  <div className="flex items-start space-x-2">
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => togglePattern(pattern.name)}
                      className="mt-1 w-4 h-4 rounded border-border text-primary focus:ring-primary"
                      onClick={(e) => e.stopPropagation()}
                    />
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-sm truncate text-foreground">{pattern.name}</div>
                      <div className="text-xs text-muted-foreground line-clamp-2 mt-1">{pattern.description}</div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {value.length > 0 && (
          <div className="mt-4 p-3 bg-muted rounded-lg border border-border text-center">
            <p className="text-xs text-muted-foreground">
              {value.length} pattern{value.length !== 1 ? 's' : ''} selected: {value.join(', ')}
            </p>
          </div>
        )}
      </Card>

      {/* Full preview modal */}
      {previewPattern && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center p-4"
          onClick={() => setPreviewPattern(null)}
        >
          <div className="relative w-full max-w-4xl" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => setPreviewPattern(null)}
              className="absolute -top-10 right-0 text-foreground hover:text-muted-foreground transition-colors flex items-center space-x-2"
            >
              <span className="text-sm font-medium">Close</span>
              <X size={20} />
            </button>
            
            <div className="glass-effect border border-border rounded-lg overflow-hidden shadow-xl">
              <div className="p-4 border-b border-border">
                <h3 className="text-xl font-semibold text-foreground">{selectedPattern?.name}</h3>
                <p className="text-sm text-muted-foreground mt-1">{selectedPattern?.description}</p>
              </div>
              
              <div className="h-96 overflow-auto">
                {selectedPattern?.example()}
              </div>
              
              <div className="p-4 border-t border-border flex justify-end space-x-2">
                <button
                  onClick={() => setPreviewPattern(null)}
                  className="px-4 py-2 rounded-md font-medium text-sm border border-border hover:bg-accent text-foreground transition-all"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    togglePattern(selectedPattern!.name);
                  }}
                  className={`
                    px-4 py-2 rounded-md font-medium text-sm transition-all border
                    ${value.includes(selectedPattern!.name)
                      ? 'border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground'
                      : 'border-primary text-primary hover:bg-primary hover:text-primary-foreground'
                    }
                  `}
                >
                  {value.includes(selectedPattern!.name) ? 'Remove' : 'Add'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default EnhancedDesignPatternSelector;