import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Profile, profilesApi } from '@/lib/api';
import { FileText, History, Plus, Settings } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    loadProfiles();
  }, []);

  const loadProfiles = async () => {
    try {
      setIsLoading(true);
      const data = await profilesApi.getAll();
      setProfiles(data);
    } catch (error) {
      toast({
        title: 'Error',
        description:
          error instanceof Error
            ? error.message
            : 'Failed to load profiles. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen">
      {/* Hero Header */}
      <header className="relative overflow-hidden border-b bg-gradient-subtle px-6 py-16 sm:py-24">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiM2MzY2RjEiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDM0djItMnptMC0ydi0yaDJ2Mmgtem0tMiAwdi0yaDJ2Mmgtem0wIDJ2LTJoMnYyaC0yem0tMiAwdi0yaDJ2Mmgtem0wLTJ2LTJoMnYyaC0yem0tMiAwdi0yaDJ2Mmgtem0wIDJ2LTJoMnYyaC0yem0tMiAwdi0yaDJ2Mmgtem0wLTJ2LTJoMnYyaC0yem0tMiAwdi0yaDJ2Mmgtem0wIDJ2LTJoMnYyaC0yeiIvPjwvZz48L2c+PC9zdmc+')] opacity-30" />

        <div className="container relative mx-auto max-w-5xl text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm font-medium text-primary">
            <FileText className="h-4 w-4" />
            AI-Powered CV Generator
          </div>

          <h1 className="mb-4 text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
            Welcome to{' '}
            <span className="bg-gradient-primary bg-clip-text text-transparent">
              Cvify
            </span>
          </h1>

          <p className="mx-auto mb-8 max-w-2xl text-lg text-muted-foreground">
            Create professional, AI-tailored CVs in minutes. Manage multiple
            profiles and generate customized resumes for every job opportunity.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4">
            <Button
              asChild
              size="lg"
              className="bg-gradient-primary shadow-lg transition-all hover:scale-105 hover:shadow-xl"
            >
              <Link to="/profiles/new">
                <Plus className="mr-2 h-5 w-5" />
                Create New Profile
              </Link>
            </Button>

            <Button asChild variant="outline" size="lg" className="shadow-sm">
              <Link to="/history">
                <History className="mr-2 h-5 w-5" />
                View History
              </Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Profiles Section */}
      <section className="container mx-auto max-w-7xl px-6 py-12">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">Your Profiles</h2>
            <p className="text-muted-foreground">
              Manage and generate CVs from your saved profiles
            </p>
          </div>

          <Button variant="outline" onClick={() => {}}>
            <Settings className="mr-2 h-4 w-4" />
            Settings
          </Button>
        </div>

        {isLoading ? (
          <Card className="p-12 text-center">
            <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center">
              <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent" />
            </div>
            <p className="text-muted-foreground">Loading profiles...</p>
          </Card>
        ) : profiles.length === 0 ? (
          <Card className="p-12 text-center">
            <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
              <FileText className="h-10 w-10 text-primary" />
            </div>
            <h3 className="mb-2 text-xl font-semibold">No profiles yet</h3>
            <p className="mb-6 text-muted-foreground">
              Create your first profile to start generating professional CVs
            </p>
            <Button asChild className="bg-gradient-primary">
              <Link to="/profiles/new">
                <Plus className="mr-2 h-5 w-5" />
                Create Your First Profile
              </Link>
            </Button>
          </Card>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {profiles.map((profile) => (
              <Card
                key={profile.id}
                className="group relative overflow-hidden transition-all hover:shadow-lg"
              >
                <Link to={`/profiles/${profile.id}`}>
                  <div className="absolute inset-0 bg-gradient-primary opacity-0 transition-opacity group-hover:opacity-5" />

                  <div className="p-6">
                    <div className="mb-4 flex items-start justify-between">
                      <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                        <FileText className="h-6 w-6" />
                      </div>
                    </div>

                    <h3 className="mb-2 line-clamp-2 text-lg font-semibold group-hover:text-primary">
                      {profile.profileName}
                    </h3>

                    <p className="mb-4 text-sm text-muted-foreground">
                      {profile.email}
                    </p>

                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span>
                        Created{' '}
                        {new Date(profile.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                  <div className="border-t bg-muted/30 px-6 py-3">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="w-full justify-start text-primary hover:bg-primary/10"
                    >
                      View Details →
                    </Button>
                  </div>
                </Link>
              </Card>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default Dashboard;
