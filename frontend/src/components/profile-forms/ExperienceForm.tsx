import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Profile } from '@/lib/api';
import { Plus, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { LinksField } from './LinksField';

interface ExperienceFormProps {
  initialData: Profile['experiences'];
  onSave: (data: Profile['experiences']) => Promise<void>;
  onCancel: () => void;
}

export const ExperienceForm = ({
  initialData,
  onSave,
  onCancel,
}: ExperienceFormProps) => {
  const [experienceList, setExperienceList] = useState(initialData || []);
  const [isSaving, setIsSaving] = useState(false);

  const addExperience = () => {
    setExperienceList([
      ...experienceList,
      {
        jobTitle: '',
        companyName: '',
        startDate: '',
        endDate: '',
        currentlyWorking: false,
        description: '',
        employmentType: '',
        location: '',
        links: [],
      },
    ]);
  };

  const removeExperience = (index: number) => {
    setExperienceList(experienceList.filter((_, i) => i !== index));
  };

  const updateExperience = (index: number, field: string, value: any) => {
    const newList = [...experienceList];
    newList[index] = { ...newList[index], [field]: value };
    setExperienceList(newList);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await onSave(experienceList);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4 border rounded-lg">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Edit Experience</h3>
        <Button type="button" size="sm" onClick={addExperience}>
          <Plus className="mr-2 h-4 w-4" />
          Add Experience
        </Button>
      </div>

      <div className="space-y-4">
        {experienceList.map((exp, index) => (
          <Card key={index} className="p-4 relative">
            <Button
              type="button"
              variant="destructive"
              size="icon"
              className="absolute top-2 right-2 h-8 w-8"
              onClick={() => removeExperience(index)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>

            <div className="space-y-4 pr-10">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>Job Title *</Label>
                  <Input
                    value={exp.jobTitle}
                    onChange={(e) =>
                      updateExperience(index, 'jobTitle', e.target.value)
                    }
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label>Company Name *</Label>
                  <Input
                    value={exp.companyName}
                    onChange={(e) =>
                      updateExperience(index, 'companyName', e.target.value)
                    }
                    required
                  />
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>Employment Type</Label>
                  <Input
                    value={exp.employmentType || ''}
                    onChange={(e) =>
                      updateExperience(index, 'employmentType', e.target.value)
                    }
                    placeholder="e.g. Full-time"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Location</Label>
                  <Input
                    value={exp.location || ''}
                    onChange={(e) =>
                      updateExperience(index, 'location', e.target.value)
                    }
                  />
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>Start Date *</Label>
                  <Input
                    value={exp.startDate}
                    onChange={(e) =>
                      updateExperience(index, 'startDate', e.target.value)
                    }
                    placeholder="YYYY-MM"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label>End Date</Label>
                  <Input
                    value={exp.endDate || ''}
                    onChange={(e) =>
                      updateExperience(index, 'endDate', e.target.value)
                    }
                    placeholder="YYYY-MM"
                    disabled={exp.currentlyWorking}
                  />
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id={`current-exp-${index}`}
                  checked={exp.currentlyWorking || false}
                  onCheckedChange={(checked) =>
                    updateExperience(index, 'currentlyWorking', checked)
                  }
                />
                <Label htmlFor={`current-exp-${index}`}>Currently Working</Label>
              </div>

              <div className="space-y-2">
                <Label>Description</Label>
                <Textarea
                  value={exp.description || ''}
                  onChange={(e) =>
                    updateExperience(index, 'description', e.target.value)
                  }
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <LinksField
                  links={exp.links || []}
                  onChange={(links) => updateExperience(index, 'links', links)}
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
