import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Profile } from '@/lib/api';
import { Plus, Trash2 } from 'lucide-react';
import { useState } from 'react';

interface EducationFormProps {
  initialData: Profile['education'];
  onSave: (data: Profile['education']) => Promise<void>;
  onCancel: () => void;
}

export const EducationForm = ({
  initialData,
  onSave,
  onCancel,
}: EducationFormProps) => {
  const [educationList, setEducationList] = useState(initialData || []);
  const [isSaving, setIsSaving] = useState(false);

  const addEducation = () => {
    setEducationList([
      ...educationList,
      {
        schoolName: '',
        degree: '',
        fieldOfStudy: '',
        startDate: '',
        endDate: '',
        currentlyStudying: false,
        description: '',
        grade: '',
        location: '',
      },
    ]);
  };

  const removeEducation = (index: number) => {
    setEducationList(educationList.filter((_, i) => i !== index));
  };

  const updateEducation = (index: number, field: string, value: any) => {
    const newList = [...educationList];
    newList[index] = { ...newList[index], [field]: value };
    setEducationList(newList);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await onSave(educationList);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4 border rounded-lg">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Edit Education</h3>
        <Button type="button" size="sm" onClick={addEducation}>
          <Plus className="mr-2 h-4 w-4" />
          Add Education
        </Button>
      </div>

      <div className="space-y-4">
        {educationList.map((edu, index) => (
          <Card key={index} className="p-4 relative">
            <Button
              type="button"
              variant="destructive"
              size="icon"
              className="absolute top-2 right-2 h-8 w-8"
              onClick={() => removeEducation(index)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>

            <div className="space-y-4 pr-10">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>School Name *</Label>
                  <Input
                    value={edu.schoolName}
                    onChange={(e) =>
                      updateEducation(index, 'schoolName', e.target.value)
                    }
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label>Degree *</Label>
                  <Input
                    value={edu.degree}
                    onChange={(e) =>
                      updateEducation(index, 'degree', e.target.value)
                    }
                    required
                  />
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>Field of Study *</Label>
                  <Input
                    value={edu.fieldOfStudy}
                    onChange={(e) =>
                      updateEducation(index, 'fieldOfStudy', e.target.value)
                    }
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label>Grade</Label>
                  <Input
                    value={edu.grade || ''}
                    onChange={(e) =>
                      updateEducation(index, 'grade', e.target.value)
                    }
                  />
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>Start Date *</Label>
                  <Input
                    value={edu.startDate}
                    onChange={(e) =>
                      updateEducation(index, 'startDate', e.target.value)
                    }
                    placeholder="YYYY-MM"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label>End Date</Label>
                  <Input
                    value={edu.endDate || ''}
                    onChange={(e) =>
                      updateEducation(index, 'endDate', e.target.value)
                    }
                    placeholder="YYYY-MM"
                    disabled={edu.currentlyStudying}
                  />
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id={`current-${index}`}
                  checked={edu.currentlyStudying || false}
                  onCheckedChange={(checked) =>
                    updateEducation(index, 'currentlyStudying', checked)
                  }
                />
                <Label htmlFor={`current-${index}`}>Currently Studying</Label>
              </div>

              <div className="space-y-2">
                <Label>Location</Label>
                <Input
                  value={edu.location || ''}
                  onChange={(e) =>
                    updateEducation(index, 'location', e.target.value)
                  }
                />
              </div>

              <div className="space-y-2">
                <Label>Description</Label>
                <Textarea
                  value={edu.description || ''}
                  onChange={(e) =>
                    updateEducation(index, 'description', e.target.value)
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
