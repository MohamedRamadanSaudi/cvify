import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus, Trash2 } from 'lucide-react';

export interface LinkItem {
  type: string;
  url: string;
}

interface LinksFieldProps {
  links: LinkItem[];
  onChange: (links: LinkItem[]) => void;
}

export const LinksField = ({ links = [], onChange }: LinksFieldProps) => {
  const addLink = () => {
    onChange([...links, { type: '', url: '' }]);
  };

  const removeLink = (index: number) => {
    onChange(links.filter((_, i) => i !== index));
  };

  const updateLink = (index: number, field: keyof LinkItem, value: string) => {
    const newLinks = [...links];
    newLinks[index] = { ...newLinks[index], [field]: value };
    onChange(newLinks);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <Label>Links</Label>
        <Button type="button" size="sm" variant="outline" onClick={addLink}>
          <Plus className="mr-2 h-3 w-3" />
          Add Link
        </Button>
      </div>
      
      {links.length === 0 && (
        <p className="text-sm text-muted-foreground italic">No links added.</p>
      )}

      <div className="space-y-3">
        {links.map((link, index) => (
          <div key={index} className="flex gap-2 items-start">
            <div className="grid gap-2 flex-1 sm:grid-cols-2">
              <Input
                placeholder="Type (e.g. GitHub)"
                value={link.type}
                onChange={(e) => updateLink(index, 'type', e.target.value)}
                className="h-8"
              />
              <Input
                placeholder="URL"
                value={link.url}
                onChange={(e) => updateLink(index, 'url', e.target.value)}
                className="h-8"
              />
            </div>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-destructive hover:text-destructive/90"
              onClick={() => removeLink(index)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
};
