import { ActivitiesForm } from '@/components/profile-forms/ActivitiesForm';
import { BasicInfoForm } from '@/components/profile-forms/BasicInfoForm';
import { CertificatesForm } from '@/components/profile-forms/CertificatesForm';
import { EducationForm } from '@/components/profile-forms/EducationForm';
import { ExperienceForm } from '@/components/profile-forms/ExperienceForm';
import { LinksForm } from '@/components/profile-forms/LinksForm';
import { ProjectsForm } from '@/components/profile-forms/ProjectsForm';
import { SkillsForm } from '@/components/profile-forms/SkillsForm';
import { VolunteeringForm } from '@/components/profile-forms/VolunteeringForm';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { Profile, profilesApi } from '@/lib/api';
import {
  Activity,
  ArrowLeft,
  Award,
  Briefcase,
  Edit,
  FileText,
  GraduationCap,
  HeartHandshake,
  History,
  LayoutDashboard,
  Mail,
  MapPin,
  Phone,
  Trash2,
  User,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const ProfileDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [editingSection, setEditingSection] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      loadProfile();
    }
  }, [id]);

  const loadProfile = async () => {
    try {
      setIsLoading(true);
      const data = await profilesApi.getById(Number(id));
      setProfile(data);
    } catch (error) {
      toast({
        title: 'Error',
        description:
          error instanceof Error
            ? error.message
            : 'Failed to load profile. Please try again.',
        variant: 'destructive',
      });
      navigate('/');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async (data: Partial<Profile>) => {
    if (!profile) return;
    try {
      const updatedProfile = await profilesApi.update(profile.id, data);
      setProfile(updatedProfile);
      setEditingSection(null);
      toast({
        title: 'Success',
        description: 'Profile updated successfully.',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update profile.',
        variant: 'destructive',
      });
    }
  };

  const handleDelete = async () => {
    try {
      await profilesApi.delete(Number(id));
      toast({
        title: 'Profile Deleted',
        description: 'The profile has been deleted successfully.',
      });
      navigate('/');
    } catch (error) {
      toast({
        title: 'Error',
        description:
          error instanceof Error
            ? error.message
            : 'Failed to delete profile. Please try again.',
        variant: 'destructive',
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  if (!profile) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-subtle py-8 px-6">
      <div className="container mx-auto max-w-6xl">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <Button variant="ghost" onClick={() => navigate('/')}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Button>

          <div className="flex gap-3">
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive">
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete
                    your profile and all associated data.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleDelete}>
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Sidebar */}
          <div className="space-y-6">
            <Card className="overflow-hidden relative group">
              {editingSection === 'basic' ? (
                <BasicInfoForm
                  initialData={profile}
                  onSave={handleSave}
                  onCancel={() => setEditingSection(null)}
                />
              ) : (
                <>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity text-white hover:bg-white/20"
                    onClick={() => setEditingSection('basic')}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <div className="bg-gradient-primary p-6 text-white">
                    <div className="mb-4 inline-flex rounded-full bg-white/20 p-4">
                      <User className="h-8 w-8" />
                    </div>
                    <h2 className="mb-1 text-2xl font-bold">
                      {profile.profileName}
                    </h2>
                    <p className="text-blue-50">{profile.title}</p>
                  </div>

                  <div className="space-y-4 p-6">
                    <div className="flex items-center gap-3 text-sm">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <span>{profile.email}</span>
                    </div>
                    {profile.phone && (
                      <div className="flex items-center gap-3 text-sm">
                        <Phone className="h-4 w-4 text-muted-foreground" />
                        <span>{profile.phone}</span>
                      </div>
                    )}
                    {profile.location && (
                      <div className="flex items-center gap-3 text-sm">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        <span>{profile.location}</span>
                      </div>
                    )}
                  </div>
                </>
              )}
            </Card>

            <Card className="p-6 relative group">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold">Links</h3>
                <Dialog open={editingSection === 'links'} onOpenChange={(open) => setEditingSection(open ? 'links' : null)}>
                  <DialogTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[500px]">
                    <DialogHeader>
                      <DialogTitle>Edit Links</DialogTitle>
                    </DialogHeader>
                    <LinksForm
                      initialData={profile.links}
                      onSave={(links) => handleSave({ links })}
                      onCancel={() => setEditingSection(null)}
                    />
                  </DialogContent>
                </Dialog>
              </div>
              <div className="space-y-2">
                {profile.links && profile.links.length > 0 ? (
                  profile.links.map((link, index) => (
                    <a
                      key={index}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block text-sm text-primary hover:underline"
                    >
                      {link.type}: {link.url}
                    </a>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground">
                    No links added.
                  </p>
                )}
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="mb-4 font-semibold">Quick Actions</h3>
              <div className="space-y-3">
                <Button
                  className="w-full justify-start bg-gradient-primary"
                  onClick={() => navigate(`/generate?profile=${id}`)}
                >
                  <FileText className="mr-2 h-4 w-4" />
                  Generate CV
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => navigate('/history')}
                >
                  <History className="mr-2 h-4 w-4" />
                  View History
                </Button>
              </div>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2">
            <Tabs defaultValue="overview" className="space-y-6">
              <TabsList className="flex w-full overflow-x-auto no-scrollbar justify-start h-auto bg-muted/50 p-1 gap-1 rounded-xl border">
                <TabsTrigger value="overview" className="flex-shrink-0 gap-1.5 text-xs px-2.5 data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-sm">
                  <LayoutDashboard className="h-3.5 w-3.5" />
                  <span className="hidden sm:inline">Overview</span>
                </TabsTrigger>
                <TabsTrigger value="experience" className="flex-shrink-0 gap-1.5 text-xs px-2.5 data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-sm">
                  <Briefcase className="h-3.5 w-3.5" />
                  <span className="hidden sm:inline">Experience</span>
                </TabsTrigger>
                <TabsTrigger value="education" className="flex-shrink-0 gap-1.5 text-xs px-2.5 data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-sm">
                  <GraduationCap className="h-3.5 w-3.5" />
                  <span className="hidden sm:inline">Education</span>
                </TabsTrigger>
                <TabsTrigger value="projects" className="flex-shrink-0 gap-1.5 text-xs px-2.5 data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-sm">
                  <FileText className="h-3.5 w-3.5" />
                  <span className="hidden sm:inline">Projects</span>
                </TabsTrigger>
                <TabsTrigger value="certificates" className="flex-shrink-0 gap-1.5 text-xs px-2.5 data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-sm">
                  <Award className="h-3.5 w-3.5" />
                  <span className="hidden sm:inline">Certificates</span>
                </TabsTrigger>
                <TabsTrigger value="activities" className="flex-shrink-0 gap-1.5 text-xs px-2.5 data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-sm">
                  <Activity className="h-3.5 w-3.5" />
                  <span className="hidden sm:inline">Activities</span>
                </TabsTrigger>
                <TabsTrigger value="volunteering" className="flex-shrink-0 gap-1.5 text-xs px-2.5 data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-sm">
                  <HeartHandshake className="h-3.5 w-3.5" />
                  <span className="hidden sm:inline">Volunteering</span>
                </TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-6">
                <Card className="p-6 relative group">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold">
                      Professional Summary
                    </h3>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => setEditingSection('basic')}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                  </div>
                  {profile.summary ? (
                    <p className="text-muted-foreground">{profile.summary}</p>
                  ) : (
                    <p className="text-muted-foreground italic">
                      No summary added yet.
                    </p>
                  )}
                </Card>

                <Card className="p-6 relative group">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold">Skills</h3>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => setEditingSection('skills')}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                  </div>
                  {editingSection === 'skills' ? (
                    <SkillsForm
                      initialData={profile.skills}
                      onSave={(skills) => handleSave({ skills })}
                      onCancel={() => setEditingSection(null)}
                    />
                  ) : (
                    <div className="flex flex-wrap gap-2">
                      {profile.skills && profile.skills.length > 0 ? (
                        profile.skills.map((skill) => (
                          <Badge
                            key={skill}
                            className="bg-primary/10 text-primary hover:bg-primary/20"
                          >
                            {skill}
                          </Badge>
                        ))
                      ) : (
                        <p className="text-muted-foreground italic">
                          No skills added yet.
                        </p>
                      )}
                    </div>
                  )}
                </Card>
              </TabsContent>

              <TabsContent value="experience" className="space-y-6">
                {editingSection === 'experience' ? (
                  <ExperienceForm
                    initialData={profile.experiences}
                    onSave={(experiences) => handleSave({ experiences })}
                    onCancel={() => setEditingSection(null)}
                  />
                ) : (
                  <div className="space-y-4">
                    <div className="flex justify-end">
                      <Button
                        variant="outline"
                        onClick={() => setEditingSection('experience')}
                      >
                        <Edit className="mr-2 h-4 w-4" />
                        Edit Experience
                      </Button>
                    </div>
                    {profile.experiences && profile.experiences.length > 0 ? (
                      profile.experiences.map((exp, index) => (
                        <Card key={`exp-${index}`} className="p-6">
                          <div className="mb-4 flex items-start gap-4">
                            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                              <Briefcase className="h-6 w-6 text-primary" />
                            </div>
                            <div className="flex-1">
                              <h3 className="text-lg font-semibold">
                                {exp.jobTitle}
                              </h3>
                              <p className="text-muted-foreground">
                                {exp.companyName}
                              </p>
                              <div className="flex gap-2 text-sm text-muted-foreground">
                                <span>
                                  {exp.startDate} -{' '}
                                  {exp.currentlyWorking
                                    ? 'Present'
                                    : exp.endDate}
                                </span>
                                {exp.location && <span>• {exp.location}</span>}
                                {exp.employmentType && (
                                  <span>• {exp.employmentType}</span>
                                )}
                              </div>
                            </div>
                          </div>
                          {exp.description && (
                            <p className="text-muted-foreground">
                              {exp.description}
                            </p>
                          )}
                        </Card>
                      ))
                    ) : (
                      <Card className="p-6 text-center">
                        <p className="text-muted-foreground">
                          No experience added yet.
                        </p>
                      </Card>
                    )}
                  </div>
                )}
              </TabsContent>

              <TabsContent value="education" className="space-y-6">
                {editingSection === 'education' ? (
                  <EducationForm
                    initialData={profile.education}
                    onSave={(education) => handleSave({ education })}
                    onCancel={() => setEditingSection(null)}
                  />
                ) : (
                  <div className="space-y-4">
                    <div className="flex justify-end">
                      <Button
                        variant="outline"
                        onClick={() => setEditingSection('education')}
                      >
                        <Edit className="mr-2 h-4 w-4" />
                        Edit Education
                      </Button>
                    </div>
                    {profile.education && profile.education.length > 0 ? (
                      profile.education.map((edu, index) => (
                        <Card key={`edu-${index}`} className="p-6">
                          <div className="flex items-start gap-4">
                            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-accent/10">
                              <GraduationCap className="h-6 w-6 text-accent" />
                            </div>
                            <div>
                              <h3 className="text-lg font-semibold">
                                {edu.schoolName}
                              </h3>
                              <p className="text-muted-foreground">
                                {edu.degree} in {edu.fieldOfStudy}
                              </p>
                              <div className="flex gap-2 text-sm text-muted-foreground">
                                <span>
                                  {edu.startDate} -{' '}
                                  {edu.currentlyStudying
                                    ? 'Present'
                                    : edu.endDate}
                                </span>
                                {edu.location && <span>• {edu.location}</span>}
                                {edu.grade && <span>• Grade: {edu.grade}</span>}
                              </div>
                              {edu.description && (
                                <p className="mt-2 text-muted-foreground">
                                  {edu.description}
                                </p>
                              )}
                            </div>
                          </div>
                        </Card>
                      ))
                    ) : (
                      <Card className="p-6 text-center">
                        <p className="text-muted-foreground">
                          No education added yet.
                        </p>
                      </Card>
                    )}
                  </div>
                )}
              </TabsContent>

              <TabsContent value="projects" className="space-y-6">
                {editingSection === 'projects' ? (
                  <ProjectsForm
                    initialData={profile.projects}
                    onSave={(projects) => handleSave({ projects })}
                    onCancel={() => setEditingSection(null)}
                  />
                ) : (
                  <div className="space-y-4">
                    <div className="flex justify-end">
                      <Button
                        variant="outline"
                        onClick={() => setEditingSection('projects')}
                      >
                        <Edit className="mr-2 h-4 w-4" />
                        Edit Projects
                      </Button>
                    </div>
                    {profile.projects && profile.projects.length > 0 ? (
                      profile.projects.map((project, index) => (
                        <Card key={`project-${index}`} className="p-6">
                          <div className="mb-4 flex items-start gap-4">
                            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-accent/10">
                              <FileText className="h-6 w-6 text-accent" />
                            </div>
                            <div className="flex-1">
                              <h3 className="text-lg font-semibold">
                                {project.title}
                              </h3>
                              <p className="text-sm text-muted-foreground">
                                {project.startDate} -{' '}
                                {project.currentlyOngoing
                                  ? 'Present'
                                  : project.endDate}
                              </p>
                            </div>
                          </div>
                          {project.description && (
                            <p className="mb-3 text-muted-foreground">
                              {project.description}
                            </p>
                          )}
                          {project.technologies &&
                            project.technologies.length > 0 && (
                              <div className="flex flex-wrap gap-2">
                                {project.technologies.map((tech) => (
                                  <Badge
                                    key={tech}
                                    variant="outline"
                                    className="bg-accent/5"
                                  >
                                    {tech}
                                  </Badge>
                                ))}
                              </div>
                            )}
                        </Card>
                      ))
                    ) : (
                      <Card className="p-6 text-center">
                        <p className="text-muted-foreground">
                          No projects added yet.
                        </p>
                      </Card>
                    )}
                  </div>
                )}
              </TabsContent>

              <TabsContent value="certificates" className="space-y-6">
                {editingSection === 'certificates' ? (
                  <CertificatesForm
                    initialData={profile.certificates}
                    onSave={(certificates) => handleSave({ certificates })}
                    onCancel={() => setEditingSection(null)}
                  />
                ) : (
                  <div className="space-y-4">
                    <div className="flex justify-end">
                      <Button
                        variant="outline"
                        onClick={() => setEditingSection('certificates')}
                      >
                        <Edit className="mr-2 h-4 w-4" />
                        Edit Certificates
                      </Button>
                    </div>
                    {profile.certificates && profile.certificates.length > 0 ? (
                      profile.certificates.map((cert, index) => (
                        <Card key={`cert-${index}`} className="p-6">
                          <div className="mb-4 flex items-start gap-4">
                            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-yellow-500/10">
                              <Award className="h-6 w-6 text-yellow-600" />
                            </div>
                            <div className="flex-1">
                              <h3 className="text-lg font-semibold">
                                {cert.name}
                              </h3>
                              <p className="text-muted-foreground">
                                {cert.issuer}
                              </p>
                              <div className="flex gap-2 text-sm text-muted-foreground">
                                <span>{cert.date}</span>
                              </div>
                              {cert.url && (
                                <a
                                  href={cert.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-sm text-primary hover:underline mt-1 block"
                                >
                                  View Certificate
                                </a>
                              )}
                            </div>
                          </div>
                          {cert.summary && (
                            <p className="text-muted-foreground">
                              {cert.summary}
                            </p>
                          )}
                        </Card>
                      ))
                    ) : (
                      <Card className="p-6 text-center">
                        <p className="text-muted-foreground">
                          No certificates added yet.
                        </p>
                      </Card>
                    )}
                  </div>
                )}
              </TabsContent>

              <TabsContent value="activities" className="space-y-6">
                {editingSection === 'activities' ? (
                  <ActivitiesForm
                    initialData={profile.activities}
                    onSave={(activities) => handleSave({ activities })}
                    onCancel={() => setEditingSection(null)}
                  />
                ) : (
                  <div className="space-y-4">
                    <div className="flex justify-end">
                      <Button
                        variant="outline"
                        onClick={() => setEditingSection('activities')}
                      >
                        <Edit className="mr-2 h-4 w-4" />
                        Edit Activities
                      </Button>
                    </div>
                    {profile.activities && profile.activities.length > 0 ? (
                      profile.activities.map((activity, index) => (
                        <Card key={`activity-${index}`} className="p-6">
                          <div className="mb-4 flex items-start gap-4">
                            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                              <Activity className="h-6 w-6 text-primary" />
                            </div>
                            <div className="flex-1">
                              <h3 className="text-lg font-semibold">
                                {activity.title}
                              </h3>
                              {activity.role && (
                                <p className="text-sm font-medium text-muted-foreground mb-1">
                                  {activity.role}
                                </p>
                              )}
                              <p className="text-sm text-muted-foreground">
                                {activity.startDate} -{' '}
                                {activity.currentlyOngoing
                                  ? 'Present'
                                  : activity.endDate}
                              </p>
                            </div>
                          </div>
                          {activity.description && (
                            <p className="text-muted-foreground">
                              {activity.description}
                            </p>
                          )}
                        </Card>
                      ))
                    ) : (
                      <Card className="p-6 text-center">
                        <p className="text-muted-foreground">
                          No activities added yet.
                        </p>
                      </Card>
                    )}
                  </div>
                )}
              </TabsContent>

              <TabsContent value="volunteering" className="space-y-6">
                {editingSection === 'volunteering' ? (
                  <VolunteeringForm
                    initialData={profile.volunteering}
                    onSave={(volunteering) => handleSave({ volunteering })}
                    onCancel={() => setEditingSection(null)}
                  />
                ) : (
                  <div className="space-y-4">
                    <div className="flex justify-end">
                      <Button
                        variant="outline"
                        onClick={() => setEditingSection('volunteering')}
                      >
                        <Edit className="mr-2 h-4 w-4" />
                        Edit Volunteering
                      </Button>
                    </div>
                    {profile.volunteering && profile.volunteering.length > 0 ? (
                      profile.volunteering.map((vol, index) => (
                        <Card key={`vol-${index}`} className="p-6">
                          <div className="mb-4 flex items-start gap-4">
                            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                              <HeartHandshake className="h-6 w-6 text-primary" />
                            </div>
                            <div className="flex-1">
                              <h3 className="text-lg font-semibold">
                                {vol.organizationName}
                              </h3>
                              {vol.role && (
                                <p className="text-muted-foreground">
                                  {vol.role}
                                </p>
                              )}
                              <div className="flex gap-2 text-sm text-muted-foreground">
                                <span>
                                  {vol.startDate} -{' '}
                                  {vol.currentlyVolunteering
                                    ? 'Present'
                                    : vol.endDate}
                                </span>
                                {vol.location && <span>• {vol.location}</span>}
                              </div>
                            </div>
                          </div>
                          {vol.description && (
                            <p className="text-muted-foreground">
                              {vol.description}
                            </p>
                          )}
                        </Card>
                      ))
                    ) : (
                      <Card className="p-6 text-center">
                        <p className="text-muted-foreground">
                          No volunteering experience added yet.
                        </p>
                      </Card>
                    )}
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileDetail;
