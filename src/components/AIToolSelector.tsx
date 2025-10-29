import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const AI_TOOLS = [
  "Replit",
  "Cursor",
  "Claude CLI",
  "Gemini CLI",
  "Qwen Coder CLI",
  "Bolt.new",
  "Dyad.sh",
  "Warp",
  "Devin",
  "Goose",
  "v0.dev",
  "GitHub Copilot",
];

interface AIToolSelectorProps {
  value: string;
  onChange: (value: string) => void;
}

export const AIToolSelector = ({ value, onChange }: AIToolSelectorProps) => {
  return (
    <Card className="p-6 glass-effect border-primary/20">
      <h3 className="text-sm font-medium mb-3">Target AI Tool</h3>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="glass-effect border-primary/20">
          <SelectValue placeholder="Select AI coding assistant" />
        </SelectTrigger>
        <SelectContent>
          {AI_TOOLS.map((tool) => (
            <SelectItem key={tool} value={tool}>
              {tool}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </Card>
  );
};