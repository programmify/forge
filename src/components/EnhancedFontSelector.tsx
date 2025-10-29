import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

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

export const EnhancedFontSelector = ({ value, onChange }: EnhancedFontSelectorProps) => {
  const selectedFont = POPULAR_FONTS.find(f => f.name === value);

  return (
    <Card className="p-6 glass-effect border-primary/20">
      <h3 className="text-sm font-medium mb-3">Font Family</h3>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="glass-effect border-primary/20">
          <SelectValue placeholder="Select a font" />
        </SelectTrigger>
        <SelectContent className="max-h-[400px]">
          {POPULAR_FONTS.map((font) => (
            <SelectItem key={font.name} value={font.name} className="py-3">
              <div className="flex flex-col gap-1">
                <div className="flex items-center justify-between gap-3">
                  <span className="font-medium">{font.name}</span>
                  <span className="text-xs text-muted-foreground">{font.category}</span>
                </div>
                <span className="text-xs text-muted-foreground italic">{font.preview}</span>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {selectedFont && (
        <div className="mt-4 p-4 rounded-lg bg-background/50 border border-primary/10">
          <p className="text-xs text-muted-foreground mb-2">Preview:</p>
          <p className={`text-lg ${selectedFont.style}`} style={{ fontFamily: selectedFont.name }}>
            The quick brown fox jumps over the lazy dog
          </p>
          <p className="text-xs text-muted-foreground mt-2">{selectedFont.preview}</p>
        </div>
      )}
    </Card>
  );
};
