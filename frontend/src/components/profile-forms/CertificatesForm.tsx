import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Profile } from '@/lib/api';
import { Plus, Trash2 } from 'lucide-react';
import { useState } from 'react';

interface CertificatesFormProps {
  initialData: Profile['certificates'];
  onSave: (data: Profile['certificates']) => Promise<void>;
  onCancel: () => void;
}

export const CertificatesForm = ({
  initialData,
  onSave,
  onCancel,
}: CertificatesFormProps) => {
  const [certificatesList, setCertificatesList] = useState(initialData || []);
  const [isSaving, setIsSaving] = useState(false);

  const addCertificate = () => {
    setCertificatesList([
      ...certificatesList,
      {
        name: '',
        issuer: '',
        date: '',
        url: '',
        summary: '',
      },
    ]);
  };

  const removeCertificate = (index: number) => {
    setCertificatesList(certificatesList.filter((_, i) => i !== index));
  };

  const updateCertificate = (index: number, field: string, value: any) => {
    const newList = [...certificatesList];
    newList[index] = { ...newList[index], [field]: value };
    setCertificatesList(newList);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await onSave(certificatesList);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4 border rounded-lg">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Edit Certificates</h3>
        <Button type="button" size="sm" onClick={addCertificate}>
          <Plus className="mr-2 h-4 w-4" />
          Add Certificate
        </Button>
      </div>

      <div className="space-y-4">
        {certificatesList.map((cert, index) => (
          <Card key={index} className="p-4 relative">
            <Button
              type="button"
              variant="destructive"
              size="icon"
              className="absolute top-2 right-2 h-8 w-8"
              onClick={() => removeCertificate(index)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>

            <div className="space-y-4 pr-10">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>Certificate Name *</Label>
                  <Input
                    value={cert.name}
                    onChange={(e) =>
                      updateCertificate(index, 'name', e.target.value)
                    }
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label>Issuer *</Label>
                  <Input
                    value={cert.issuer}
                    onChange={(e) =>
                      updateCertificate(index, 'issuer', e.target.value)
                    }
                    required
                  />
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>Date *</Label>
                  <Input
                    value={cert.date}
                    onChange={(e) =>
                      updateCertificate(index, 'date', e.target.value)
                    }
                    placeholder="YYYY-MM"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label>URL</Label>
                  <Input
                    value={cert.url || ''}
                    onChange={(e) =>
                      updateCertificate(index, 'url', e.target.value)
                    }
                    placeholder="https://..."
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Summary</Label>
                <Textarea
                  value={cert.summary || ''}
                  onChange={(e) =>
                    updateCertificate(index, 'summary', e.target.value)
                  }
                  rows={3}
                />
              </div>
            </div>
          </Card>
        ))}
      </div>

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
