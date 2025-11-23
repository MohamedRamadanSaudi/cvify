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
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { useToast } from '@/hooks/use-toast';
import { CV, cvsApi, downloadBlob } from '@/lib/api';
import {
  ArrowLeft,
  Download,
  Edit,
  FileText,
  RefreshCw,
  Search,
  Trash2,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const History = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [cvs, setCvs] = useState<CV[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [downloadingId, setDownloadingId] = useState<number | null>(null);
  const [regeneratingId, setRegeneratingId] = useState<number | null>(null);
  const [editingCv, setEditingCv] = useState<CV | null>(null);
  const [cvDataJson, setCvDataJson] = useState<string>('');
  const [jsonError, setJsonError] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProfileId, setSelectedProfileId] = useState<string>('all');

  useEffect(() => {
    loadCvs();
  }, []);

  const loadCvs = async () => {
    try {
      setIsLoading(true);
      const data = await cvsApi.getAll();
      setCvs(data);
    } catch (error) {
      toast({
        title: 'Error',
        description:
          error instanceof Error
            ? error.message
            : 'Failed to load CV history. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownload = async (cv: CV) => {
    try {
      setDownloadingId(cv.id);
      const blob = await cvsApi.download(cv.id);
      const filename = `cv_${cv.id}_${Date.now()}.pdf`;
      downloadBlob(blob, filename);
      toast({
        title: 'Downloaded!',
        description: 'Your CV has been downloaded successfully.',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description:
          error instanceof Error
            ? error.message
            : 'Failed to download CV. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setDownloadingId(null);
    }
  };

  const openEditDialog = (cv: CV) => {
    console.log('Opening edit dialog for CV:', cv.id);
    console.log('CV Data:', cv.cvData);
    setEditingCv(cv);
    setCvDataJson(JSON.stringify(cv.cvData, null, 2));
    setJsonError('');
  };

  const closeEditDialog = () => {
    setEditingCv(null);
    setCvDataJson('');
    setJsonError('');
  };

  const handleJsonChange = (value: string) => {
    setCvDataJson(value);
    setJsonError('');
  };

  const handleSaveAndRegenerate = async () => {
    if (!editingCv) return;

    // Validate JSON
    try {
      const parsedData = JSON.parse(cvDataJson);

      setRegeneratingId(editingCv.id);

      // Update CV data first
      await cvsApi.updateCvData(editingCv.id, parsedData);

      // Then regenerate with new data
      const blob = await cvsApi.regenerate(editingCv.id);
      const filename = `cv_${editingCv.id}_edited_${Date.now()}.pdf`;
      downloadBlob(blob, filename);

      toast({
        title: 'Success!',
        description: 'CV data updated and regenerated successfully.',
      });

      closeEditDialog();
      loadCvs(); // Reload to get updated data
    } catch (error) {
      if (error instanceof SyntaxError) {
        setJsonError('Invalid JSON format. Please check your syntax.');
      } else {
        toast({
          title: 'Error',
          description:
            error instanceof Error
              ? error.message
              : 'Failed to update and regenerate CV.',
          variant: 'destructive',
        });
      }
    } finally {
      setRegeneratingId(null);
    }
  };

  const handleQuickRegenerate = async (cv: CV) => {
    try {
      setRegeneratingId(cv.id);
      const blob = await cvsApi.regenerate(cv.id);
      const filename = `cv_${cv.id}_regenerated_${Date.now()}.pdf`;
      downloadBlob(blob, filename);
      toast({
        title: 'Regenerated!',
        description: 'Your CV has been regenerated successfully.',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description:
          error instanceof Error
            ? error.message
            : 'Failed to regenerate CV. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setRegeneratingId(null);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await cvsApi.delete(id);
      toast({
        title: 'CV Deleted',
        description: 'The CV has been deleted successfully.',
      });
      loadCvs();
    } catch (error) {
      toast({
        title: 'Error',
        description:
          error instanceof Error
            ? error.message
            : 'Failed to delete CV. Please try again.',
        variant: 'destructive',
      });
    }
  };

  // Extract unique profiles for filter
  const uniqueProfiles = Array.from(
    new Map(
      cvs
        .filter((cv) => cv.profile)
        .map((cv) => [cv.profile!.id, cv.profile!])
    ).values()
  );

  // Filter CVs
  const filteredCvs = cvs.filter((cv) => {
    const matchesProfile =
      selectedProfileId === 'all' ||
      cv.profileId.toString() === selectedProfileId;
    const matchesSearch = cv.jobDescription
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    return matchesProfile && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-gradient-subtle py-12 px-6">
      <div className="container mx-auto max-w-7xl">
        <div className="mb-6 flex items-center justify-between">
          <Button variant="ghost" onClick={() => navigate('/')}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Button>
        </div>

        <div className="mb-8 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <h1 className="mb-2 text-3xl font-bold">CV History</h1>
            <p className="text-muted-foreground">
              View and manage all your generated CVs
            </p>
          </div>

          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <div className="w-full sm:w-[200px]">
              <Select
                value={selectedProfileId}
                onValueChange={setSelectedProfileId}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Filter by Profile" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Profiles</SelectItem>
                  {uniqueProfiles.map((profile) => (
                    <SelectItem key={profile.id} value={profile.id.toString()}>
                      {profile.profileName || profile.fullName || 'Unknown Profile'}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="relative w-full sm:w-[300px]">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search job descriptions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>
        </div>

        {isLoading ? (
          <Card className="p-12 text-center">
            <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center">
              <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent" />
            </div>
            <p className="text-muted-foreground">Loading CV history...</p>
          </Card>
        ) : filteredCvs.length === 0 ? (
          <Card className="p-12 text-center">
            <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
              <FileText className="h-10 w-10 text-primary" />
            </div>
            <h3 className="mb-2 text-xl font-semibold">
              {cvs.length === 0 ? 'No CVs yet' : 'No matching CVs'}
            </h3>
            <p className="mb-6 text-muted-foreground">
              {cvs.length === 0
                ? "You haven't generated any CVs yet. Create a profile and generate your first CV!"
                : 'Try adjusting your filters or search query.'}
            </p>
            {cvs.length === 0 && (
              <Button onClick={() => navigate('/')}>Go to Dashboard</Button>
            )}
          </Card>
        ) : (
          <div className="space-y-4">
            {filteredCvs.map((cv) => (
              <Card
                key={cv.id}
                className="overflow-hidden transition-all hover:shadow-lg"
              >
                <div className="p-6">
                  <div className="flex items-start gap-6">
                    <div className="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-lg bg-primary/10">
                      <FileText className="h-8 w-8 text-primary" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="mb-2 flex items-start justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          <h3 className="mb-1 text-lg font-semibold">
                            {cv.profile?.profileName || 'CV'}
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            {cv.profile?.email}
                          </p>
                        </div>
                        <Badge variant="outline" className="flex-shrink-0">
                          ID: {cv.id}
                        </Badge>
                      </div>

                      <div className="mb-4 rounded-lg bg-muted/50 p-3">
                        <p className="text-sm font-medium text-muted-foreground mb-1">
                          Job Description:
                        </p>
                        <p className="text-sm line-clamp-2">
                          {cv.jobDescription}
                        </p>
                      </div>

                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <span>
                          Generated on{' '}
                          {new Date(cv.createdAt).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 flex flex-wrap gap-2 border-t pt-4">
                    <Tooltip delayDuration={0}>
                      <TooltipTrigger asChild>
                        <Button
                          size="sm"
                          onClick={() => handleDownload(cv)}
                          disabled={downloadingId === cv.id}
                          className="bg-gradient-primary"
                        >
                          <Download className="mr-2 h-4 w-4" />
                          {downloadingId === cv.id
                            ? 'Downloading...'
                            : 'Download'}
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Download the saved version of your CV.</p>
                      </TooltipContent>
                    </Tooltip>

                    <Tooltip delayDuration={0}>
                      <TooltipTrigger asChild>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            console.log(
                              'Edit & Regenerate button clicked for CV:',
                              cv.id,
                            );
                            openEditDialog(cv);
                          }}
                          disabled={regeneratingId === cv.id}
                        >
                          <Edit className="mr-2 h-4 w-4" />
                          Edit JSON & Regenerate
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>
                          Modify CV data and regenerate. This saves the changes
                          for future regenerations.
                        </p>
                      </TooltipContent>
                    </Tooltip>

                    <Tooltip delayDuration={0}>
                      <TooltipTrigger asChild>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleQuickRegenerate(cv)}
                          disabled={regeneratingId === cv.id}
                        >
                          <RefreshCw className="mr-2 h-4 w-4" />
                          {regeneratingId === cv.id
                            ? 'Regenerating...'
                            : 'Quick Regenerate'}
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Regenerate the PDF using your latest saved data.</p>
                      </TooltipContent>
                    </Tooltip>

                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => navigate(`/profiles/${cv.profileId}`)}
                    >
                      View Profile
                    </Button>

                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button size="sm" variant="destructive">
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This action cannot be undone. This will permanently
                            delete this CV and its PDF file.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDelete(cv.id)}
                          >
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Edit CV Data Dialog */}
      <Dialog
        open={!!editingCv}
        onOpenChange={(open) => !open && closeEditDialog()}
      >
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <DialogTitle>Edit CV Data</DialogTitle>
            <DialogDescription>
              Modify the CV data in JSON format below. Make sure the JSON is
              valid before saving.
            </DialogDescription>
          </DialogHeader>

          <div className="flex-1 overflow-y-auto space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">CV Data (JSON)</label>
              <Textarea
                value={cvDataJson}
                onChange={(e) => handleJsonChange(e.target.value)}
                className="font-mono text-sm min-h-[400px]"
                placeholder="Enter CV data in JSON format..."
              />
              {jsonError && (
                <p className="text-sm text-destructive">{jsonError}</p>
              )}
            </div>

            <div className="rounded-lg bg-muted p-4 space-y-2">
              <h4 className="text-sm font-semibold">Tips:</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>
                  • Ensure valid JSON syntax (use double quotes for strings)
                </li>
                <li>• Keep the overall structure intact</li>
                <li>• You can modify text content, add/remove items</li>
                <li>• Changes will be saved and the PDF regenerated</li>
              </ul>
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={closeEditDialog}
              disabled={regeneratingId === editingCv?.id}
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={handleSaveAndRegenerate}
              disabled={regeneratingId === editingCv?.id}
              className="bg-gradient-primary"
            >
              <RefreshCw className="mr-2 h-4 w-4" />
              {regeneratingId === editingCv?.id
                ? 'Saving & Regenerating...'
                : 'Save & Regenerate'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default History;
