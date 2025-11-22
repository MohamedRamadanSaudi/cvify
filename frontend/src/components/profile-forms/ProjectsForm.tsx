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

interface ProjectsFormProps {
  initialData: Profile['projects'];
  onSave: (data: Profile['projects']) => Promise<void>;
  onCancel: () => void;
}

export const ProjectsForm = ({
  initialData,
  onSave,
  onCancel,
}: ProjectsFormProps) => {
  const [projectList, setProjectList] = useState(initialData || []);
  const [isSaving, setIsSaving] = useState(false);

  const addProject = () => {
    setProjectList([
      ...projectList,
      {
        title: '',
        description: '',
        startDate: '',
        endDate: '',
        currentlyOngoing: false,
        technologies: [],
        links: [],
      },
    ]);
  };

  const removeProject = (index: number) => {
    setProjectList(projectList.filter((_, i) => i !== index));
  };

  const updateProject = (index: number, field: string, value: any) => {
    const newList = [...projectList];
    newList[index] = { ...newList[index], [field]: value };
    setProjectList(newList);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await onSave(projectList);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4 border rounded-lg">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Edit Projects</h3>
        <Button type="button" size="sm" onClick={addProject}>
          <Plus className="mr-2 h-4 w-4" />
          Add Project
        </Button>
      </div>

      <div className="space-y-4">
        {projectList.map((project, index) => (
          <Card key={index} className="p-4 relative">
            <Button
              type="button"
              variant="destructive"
              size="icon"
              className="absolute top-2 right-2 h-8 w-8"
              onClick={() => removeProject(index)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>

            <div className="space-y-4 pr-10">
              <div className="space-y-2">
                <Label>Project Title *</Label>
                <Input
                  value={project.title}
                  onChange={(e) =>
                    updateProject(index, 'title', e.target.value)
                  }
                  required
                />
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>Start Date *</Label>
                  <Input
                    value={project.startDate}
                    onChange={(e) =>
                      updateProject(index, 'startDate', e.target.value)
                    }
                    placeholder="YYYY-MM"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label>End Date</Label>
                  <Input
                    value={project.endDate || ''}
                    onChange={(e) =>
                      updateProject(index, 'endDate', e.target.value)
                    }
                    placeholder="YYYY-MM"
                    disabled={project.currentlyOngoing}
                  />
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id={`current-proj-${index}`}
                  checked={project.currentlyOngoing || false}
                  onCheckedChange={(checked) =>
                    updateProject(index, 'currentlyOngoing', checked)
                  }
                />
                <Label htmlFor={`current-proj-${index}`}>Currently Ongoing</Label>
              </div>

              <div className="space-y-2">
                <Label>Technologies (comma separated)</Label>
                <Input
                  value={project.technologies?.join(', ') || ''}
                  onChange={(e) =>
                    updateProject(
                      index,
                      'technologies',
                      e.target.value.split(',').map((t) => t.trim()).filter(Boolean)
                    )
                  }
                  placeholder="React, Node.js, TypeScript"
                />
              </div>

              <div className="space-y-2">
                <Label>Description</Label>
                <Textarea
                  value={project.description || ''}
                  onChange={(e) =>
                    updateProject(index, 'description', e.target.value)
                  }
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <LinksField
                  links={project.links || []}
                  onChange={(links) => updateProject(index, 'links', links)}
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
