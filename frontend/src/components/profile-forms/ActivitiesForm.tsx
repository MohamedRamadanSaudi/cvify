import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Profile } from '@/lib/api';
import { Plus, Trash2 } from 'lucide-react';
import { useState } from 'react';

interface ActivitiesFormProps {
  initialData: Profile['activities'];
  onSave: (data: Profile['activities']) => Promise<void>;
  onCancel: () => void;
}

export const ActivitiesForm = ({
  initialData,
  onSave,
  onCancel,
}: ActivitiesFormProps) => {
  const [activityList, setActivityList] = useState(initialData || []);
  const [isSaving, setIsSaving] = useState(false);

  const addActivity = () => {
    setActivityList([
      ...activityList,
      {
        title: '',
        description: '',
        role: '',
        startDate: '',
        endDate: '',
        currentlyOngoing: false,
      },
    ]);
  };

  const removeActivity = (index: number) => {
    setActivityList(activityList.filter((_, i) => i !== index));
  };

  const updateActivity = (index: number, field: string, value: any) => {
    const newList = [...activityList];
    newList[index] = { ...newList[index], [field]: value };
    setActivityList(newList);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await onSave(activityList);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4 border rounded-lg">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Edit Activities</h3>
        <Button type="button" size="sm" onClick={addActivity}>
          <Plus className="mr-2 h-4 w-4" />
          Add Activity
        </Button>
      </div>

      <div className="space-y-4">
        {activityList.map((activity, index) => (
          <Card key={index} className="p-4 relative">
            <Button
              type="button"
              variant="destructive"
              size="icon"
              className="absolute top-2 right-2 h-8 w-8"
              onClick={() => removeActivity(index)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>

            <div className="space-y-4 pr-10">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>Activity Title *</Label>
                  <Input
                    value={activity.title}
                    onChange={(e) =>
                      updateActivity(index, 'title', e.target.value)
                    }
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label>Role</Label>
                  <Input
                    value={activity.role || ''}
                    onChange={(e) =>
                      updateActivity(index, 'role', e.target.value)
                    }
                  />
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>Start Date *</Label>
                  <Input
                    value={activity.startDate}
                    onChange={(e) =>
                      updateActivity(index, 'startDate', e.target.value)
                    }
                    placeholder="YYYY-MM"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label>End Date</Label>
                  <Input
                    value={activity.endDate || ''}
                    onChange={(e) =>
                      updateActivity(index, 'endDate', e.target.value)
                    }
                    placeholder="YYYY-MM"
                    disabled={activity.currentlyOngoing}
                  />
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id={`current-act-${index}`}
                  checked={activity.currentlyOngoing || false}
                  onCheckedChange={(checked) =>
                    updateActivity(index, 'currentlyOngoing', checked)
                  }
                />
                <Label htmlFor={`current-act-${index}`}>Currently Ongoing</Label>
              </div>

              <div className="space-y-2">
                <Label>Description</Label>
                <Textarea
                  value={activity.description || ''}
                  onChange={(e) =>
                    updateActivity(index, 'description', e.target.value)
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
