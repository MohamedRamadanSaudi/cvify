import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Profile } from '@/lib/api';
import { Plus, Trash2 } from 'lucide-react';
import { useState } from 'react';

interface VolunteeringFormProps {
  initialData: Profile['volunteering'];
  onSave: (data: Profile['volunteering']) => Promise<void>;
  onCancel: () => void;
}

export const VolunteeringForm = ({
  initialData,
  onSave,
  onCancel,
}: VolunteeringFormProps) => {
  const [volunteeringList, setVolunteeringList] = useState(initialData || []);
  const [isSaving, setIsSaving] = useState(false);

  const addVolunteering = () => {
    setVolunteeringList([
      ...volunteeringList,
      {
        organizationName: '',
        role: '',
        startDate: '',
        endDate: '',
        currentlyVolunteering: false,
        description: '',
        location: '',
      },
    ]);
  };

  const removeVolunteering = (index: number) => {
    setVolunteeringList(volunteeringList.filter((_, i) => i !== index));
  };

  const updateVolunteering = (index: number, field: string, value: any) => {
    const newList = [...volunteeringList];
    newList[index] = { ...newList[index], [field]: value };
    setVolunteeringList(newList);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await onSave(volunteeringList);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4 border rounded-lg">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Edit Volunteering</h3>
        <Button type="button" size="sm" onClick={addVolunteering}>
          <Plus className="mr-2 h-4 w-4" />
          Add Volunteering
        </Button>
      </div>

      <div className="space-y-4">
        {volunteeringList.map((vol, index) => (
          <Card key={index} className="p-4 relative">
            <Button
              type="button"
              variant="destructive"
              size="icon"
              className="absolute top-2 right-2 h-8 w-8"
              onClick={() => removeVolunteering(index)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>

            <div className="space-y-4 pr-10">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>Organization Name *</Label>
                  <Input
                    value={vol.organizationName}
                    onChange={(e) =>
                      updateVolunteering(index, 'organizationName', e.target.value)
                    }
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label>Role *</Label>
                  <Input
                    value={vol.role}
                    onChange={(e) =>
                      updateVolunteering(index, 'role', e.target.value)
                    }
                    required
                  />
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>Location</Label>
                  <Input
                    value={vol.location || ''}
                    onChange={(e) =>
                      updateVolunteering(index, 'location', e.target.value)
                    }
                  />
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>Start Date *</Label>
                  <Input
                    value={vol.startDate}
                    onChange={(e) =>
                      updateVolunteering(index, 'startDate', e.target.value)
                    }
                    placeholder="YYYY-MM"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label>End Date</Label>
                  <Input
                    value={vol.endDate || ''}
                    onChange={(e) =>
                      updateVolunteering(index, 'endDate', e.target.value)
                    }
                    placeholder="YYYY-MM"
                    disabled={vol.currentlyVolunteering}
                  />
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id={`current-vol-${index}`}
                  checked={vol.currentlyVolunteering || false}
                  onCheckedChange={(checked) =>
                    updateVolunteering(index, 'currentlyVolunteering', checked)
                  }
                />
                <Label htmlFor={`current-vol-${index}`}>
                  Currently Volunteering
                </Label>
              </div>

              <div className="space-y-2">
                <Label>Description</Label>
                <Textarea
                  value={vol.description || ''}
                  onChange={(e) =>
                    updateVolunteering(index, 'description', e.target.value)
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
