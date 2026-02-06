import { Mode } from '../../backend';
import { Button } from '@/components/ui/button';
import { getQuickPrompts } from '../modes/modeTypes';

interface QuickPromptsProps {
  mode: Mode;
  onPromptClick: (prompt: string) => void;
}

export default function QuickPrompts({ mode, onPromptClick }: QuickPromptsProps) {
  const prompts = getQuickPrompts(mode);

  return (
    <div className="space-y-2">
      <p className="text-sm font-medium text-muted-foreground">Quick prompts:</p>
      <div className="flex flex-wrap gap-2">
        {prompts.map((prompt, index) => (
          <Button
            key={index}
            variant="outline"
            size="sm"
            onClick={() => onPromptClick(prompt)}
            className="text-xs"
          >
            {prompt}
          </Button>
        ))}
      </div>
    </div>
  );
}
