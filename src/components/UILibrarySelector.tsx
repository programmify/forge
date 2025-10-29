import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const UI_LIBRARIES = [
  "shadcn/ui",
  "Magic UI",
  "Aceternity UI",
  "Framer Motion",
  "Three.js",
  "GSAP",
  "Radix UI",
  "Headless UI",
  "React Spring",
  "Chakra UI",
  "Mantine",
  "NextUI",
  "DaisyUI",
  "Ant Design",
  "Material-UI",
];

interface UILibrarySelectorProps {
  value: string[];
  onChange: (value: string[]) => void;
}

export const UILibrarySelector = ({ value, onChange }: UILibrarySelectorProps) => {
  const toggleLibrary = (library: string) => {
    if (value.includes(library)) {
      onChange(value.filter((l) => l !== library));
    } else {
      onChange([...value, library]);
    }
  };

  return (
    <Card className="p-6 glass-effect border-primary/20">
      <h3 className="text-sm font-medium mb-3">UI Libraries</h3>
      <div className="flex flex-wrap gap-2">
        {UI_LIBRARIES.map((library) => (
          <Badge
            key={library}
            variant={value.includes(library) ? "default" : "outline"}
            className="cursor-pointer transition-all hover:scale-105"
            onClick={() => toggleLibrary(library)}
          >
            {library}
          </Badge>
        ))}
      </div>
    </Card>
  );
};