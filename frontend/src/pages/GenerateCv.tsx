import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { cvsApi, downloadBlob } from '@/lib/api';
import { ArrowLeft, Download, Sparkles } from 'lucide-react';
import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

const GenerateCv = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const profileId = searchParams.get('profile');
  const { toast } = useToast();

  const [jobDescription, setJobDescription] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedCvBlob, setGeneratedCvBlob] = useState<Blob | null>(null);

  // Helper function to count words
  const getWordCount = (text: string): number => {
    return text.trim().split(/\s+/).filter(word => word.length > 0).length;
  };

  const MIN_WORD_COUNT = 10;
  const wordCount = getWordCount(jobDescription);
  const isJobDescriptionValid = wordCount >= MIN_WORD_COUNT;

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!profileId) {
      toast({
        title: 'Error',
        description: 'No profile selected.',
        variant: 'destructive',
      });
      return;
    }

    if (!isJobDescriptionValid) {
      toast({
        title: 'Job Description Too Short',
        description: `Please provide a more detailed job description. Minimum ${MIN_WORD_COUNT} words required.`,
        variant: 'destructive',
      });
      return;
    }

    setIsGenerating(true);

    try {
      const blob = await cvsApi.generate({
        profileId: Number(profileId),
        jobDescription,
      });
      setGeneratedCvBlob(blob);
      toast({
        title: 'CV Generated!',
        description: 'Your tailored CV is ready to download.',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description:
          error instanceof Error
            ? error.message
            : 'Failed to generate CV. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownload = () => {
    if (generatedCvBlob) {
      const filename = `cv_${new Date().getTime()}.pdf`;
      downloadBlob(generatedCvBlob, filename);
      toast({
        title: 'Downloaded!',
        description: 'Your CV has been downloaded successfully.',
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-subtle py-12 px-6">
      <div className="container mx-auto max-w-4xl">
        <Button
          variant="ghost"
          className="mb-6"
          onClick={() => navigate(`/profiles/${profileId}`)}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Profile
        </Button>

        <Card className="overflow-hidden shadow-xl">
          {/* Header */}
          <div className="bg-gradient-accent p-8 text-white">
            <div className="mb-4 inline-flex rounded-lg bg-white/20 p-3">
              <Sparkles className="h-6 w-6" />
            </div>
            <h1 className="mb-2 text-3xl font-bold">Generate AI-Tailored CV</h1>
            <p className="text-teal-50">
              Paste a job description and let AI customize your CV to match
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleGenerate} className="p-8">
            {!generatedCvBlob ? (
              <div className="space-y-6">
                <div className="space-y-2">
                  <Label
                    htmlFor="jobDescription"
                    className="text-base font-semibold"
                  >
                    Job Description <span className="text-destructive">*</span>
                  </Label>
                  <Textarea
                    id="jobDescription"
                    placeholder="Paste the job description here..."
                    value={jobDescription}
                    onChange={(e) => setJobDescription(e.target.value)}
                    required
                    className="min-h-[300px] text-base"
                  />
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-muted-foreground">
                      Include job requirements, responsibilities, and desired
                      qualifications
                    </p>
                    <p className={`text-sm font-medium ${
                        isJobDescriptionValid
                          ? 'text-green-600'
                          : 'text-muted-foreground'
                      }`}>
                      {wordCount}/{MIN_WORD_COUNT} words
                    </p>
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={isGenerating || !isJobDescriptionValid}
                  className="w-full bg-gradient-accent shadow-lg transition-all hover:scale-105 hover:shadow-xl"
                >
                  <Sparkles className="mr-2 h-5 w-5" />
                  {isGenerating ? 'Generating with AI...' : 'Generate CV'}
                </Button>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="rounded-lg border bg-muted/30 p-6 text-center">
                  <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                    <Download className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="mb-2 text-lg font-semibold">
                    CV Generated Successfully!
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Your tailored CV is ready for download
                  </p>
                </div>

                <div className="flex gap-4">
                  <Button
                    type="button"
                    onClick={handleDownload}
                    className="flex-1 bg-gradient-primary"
                  >
                    <Download className="mr-2 h-5 w-5" />
                    Download PDF
                  </Button>

                  <Button
                    type="button"
                    onClick={() => {
                      setGeneratedCvBlob(null);
                      setJobDescription('');
                    }}
                  >
                    Generate Another
                  </Button>
                </div>
              </div>
            )}
          </form>
        </Card>

        {/* Tips Card */}
        <Card className="mt-6 border-primary/20 bg-primary/5 p-6">
          <h3 className="mb-2 font-semibold text-primary">
            Tips for Best Results
          </h3>
          <ul className="space-y-1 text-sm text-muted-foreground">
            <li>• Include complete job requirements and responsibilities</li>
            <li>• Add company information if available</li>
            <li>• Mention specific technical skills or tools required</li>
            <li>• The more details you provide, the better the CV tailoring</li>
          </ul>
        </Card>
      </div>
    </div>
  );
};

export default GenerateCv;
