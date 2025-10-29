import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// Function to load Google Fonts dynamically
const loadGoogleFont = (fontName: string) => {
  const fontNameFormatted = fontName.replace(/\s+/g, '+');
  const fontStyle = `https://fonts.googleapis.com/css2?family=${fontNameFormatted}:wght@300;400;500;600;700&display=swap`;
  
  // Check if the font stylesheet is already loaded
  const existingLink = document.querySelector(`link[href="${fontStyle}"]`) as HTMLLinkElement;
  if (existingLink) return;

  // Create a new link element for the Google Font
  const link = document.createElement("link");
  link.rel = "stylesheet";
  link.href = fontStyle;
  document.head.appendChild(link);
};

const POPULAR_FONTS = [
  { name: "Inter", style: "font-sans", preview: "Modern & Clean", category: "Sans-serif" },
  { name: "Roboto", style: "font-sans", preview: "Professional", category: "Sans-serif" },
  { name: "Open Sans", style: "font-sans", preview: "Friendly & Readable", category: "Sans-serif" },
  { name: "Lato", style: "font-sans", preview: "Warm & Stable", category: "Sans-serif" },
  { name: "Montserrat", style: "font-sans", preview: "Geometric & Bold", category: "Sans-serif" },
  { name: "Poppins", style: "font-sans", preview: "Contemporary", category: "Sans-serif" },
  { name: "Space Grotesk", style: "font-sans", preview: "Tech & Futuristic", category: "Sans-serif" },
  { name: "Playfair Display", style: "font-serif", preview: "Elegant & Classic", category: "Serif" },
  { name: "Merriweather", style: "font-serif", preview: "Traditional", category: "Serif" },
  { name: "Raleway", style: "font-sans", preview: "Sophisticated", category: "Sans-serif" },
  { name: "Nunito", style: "font-sans", preview: "Rounded & Soft", category: "Sans-serif" },
  { name: "Ubuntu", style: "font-sans", preview: "Humanist", category: "Sans-serif" },
  { name: "Quicksand", style: "font-sans", preview: "Playful & Round", category: "Display" },
  { name: "Oswald", style: "font-sans", preview: "Condensed & Strong", category: "Display" },
  { name: "Bebas Neue", style: "font-sans", preview: "Bold & Impactful", category: "Display" },
];

interface EnhancedFontSelectorProps {
  value: string;
  onChange: (value: string) => void;
}

const EnhancedFontSelector = ({ value, onChange }: EnhancedFontSelectorProps) => {
  const [isFontLoaded, setIsFontLoaded] = useState(false);
  const selectedFont = POPULAR_FONTS.find(f => f.name === value);

  useEffect(() => {
    if (value) {
      // Load the selected Google Font
      loadGoogleFont(value);
      setIsFontLoaded(true);
      
      // Reset the loaded state to allow re-triggering the effect if the same font is reselected
      const timer = setTimeout(() => setIsFontLoaded(false), 100);
      return () => clearTimeout(timer);
    }
  }, [value]);

  return (
    <Card className="p-6 glass-effect border-primary/20">
      <h3 className="text-sm font-medium mb-3">Font Family</h3>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="glass-effect border-primary/20">
          <SelectValue placeholder="Select a font" />
        </SelectTrigger>
        <SelectContent className="max-h-[400px]">
          {POPULAR_FONTS.map((font) => (
            <SelectItem 
              key={font.name} 
              value={font.name} 
              className="py-3"
              style={{ fontFamily: font.name }}
            >
              <div className="flex flex-col gap-1">
                <div className="flex items-center justify-between gap-3">
                  <span className="font-medium" style={{ fontFamily: font.name }}>
                    {font.name}
                  </span>
                  <span className="text-xs text-muted-foreground">{font.category}</span>
                </div>
                <span 
                  className="text-xs text-muted-foreground italic" 
                  style={{ fontFamily: font.name }}
                >
                  {font.preview}
                </span>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {selectedFont && (
        <div className="mt-4 p-4 rounded-lg bg-background/50 border border-primary/10 transition-all duration-300">
          <p className="text-xs text-muted-foreground mb-2">Preview:</p>
          <p 
            className={`text-lg ${selectedFont.style} transition-all duration-300`}
            style={{ 
              fontFamily: `"${selectedFont.name}", sans-serif`,
              opacity: isFontLoaded ? 1 : 0.7
            }}
          >
            The quick brown fox jumps over the lazy dog
          </p>
          <p className="text-sm mt-2" style={{ fontFamily: `"${selectedFont.name}", sans-serif` }}>
            Aa Bb Cc Dd Ee Ff Gg Hh Ii Jj Kk Ll Mm Nn Oo Pp Qq Rr Ss Tt Uu Vv Ww Xx Yy Zz
          </p>
          <p className="text-xs text-muted-foreground mt-2">{selectedFont.preview}</p>
        </div>
      )}
    </Card>
  );
};

export { EnhancedFontSelector };
