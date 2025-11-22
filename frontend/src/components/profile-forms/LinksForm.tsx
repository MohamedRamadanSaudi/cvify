import { Button } from '@/components/ui/button';
import { Profile } from '@/lib/api';
import { useState } from 'react';
import { LinksField } from './LinksField';

interface LinksFormProps {
  initialData: Profile['links'];
  onSave: (data: Profile['links']) => Promise<void>;
  onCancel: () => void;
}

export const LinksForm = ({
  initialData,
  onSave,
  onCancel,
}: LinksFormProps) => {
  const [links, setLinks] = useState(initialData || []);
  const [isSaving, setIsSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await onSave(links);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <LinksField links={links} onChange={setLinks} />

      <div className="flex justify-end gap-2 mt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={isSaving}>
          {isSaving ? 'Saving...' : 'Save Changes'}
        </Button>
      </div>
    </form>
  );
};
