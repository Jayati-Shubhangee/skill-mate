import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMember } from '@/integrations';
import { BaseCrudService } from '@/integrations';
import { Projects } from '@/entities';
import NavBar from '@/components/layout/NavBar';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import SuggestTeamPanel from '@/components/shared/SuggestTeamPanel';
import { motion } from 'framer-motion';
import { useToast } from '@/hooks/use-toast';
import { Rocket } from 'lucide-react';

export default function CreateProjectPage() {
  const { member } = useMember();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [submitting, setSubmitting] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [projectSkills, setProjectSkills] = useState('');

  const [formData, setFormData] = useState({
    projectName: '',
    projectDescription: '',
    projectGoals: '',
    requiredSkills: '',
    hackathonName: '',
    projectStatus: 'Active',
    roleNeeded: '',
    teamSize: '',
    timeCommitment: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    const project: Projects = {
      _id: crypto.randomUUID(),
      projectName: formData.projectName,
      projectDescription: formData.projectDescription,
      projectGoals: formData.projectGoals,
      requiredSkills: formData.requiredSkills,
      hackathonName: formData.hackathonName,
      projectStatus: formData.projectStatus,
      roleNeeded: formData.roleNeeded,
      teamSize: formData.teamSize ? parseInt(formData.teamSize) : undefined,
      timeCommitment: formData.timeCommitment,
      submissionDate: new Date().toISOString(),
    };

    await BaseCrudService.create('projects', project);

    toast({
      title: 'Success!',
      description: 'Your project has been created.',
    });

    setProjectSkills(formData.requiredSkills);
    setShowSuggestions(true);
    setSubmitting(false);
  };

  const handleInvite = async (profileId: string) => {
    toast({
      title: 'Invitation Sent!',
      description: 'The candidate has been invited to your team.',
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <NavBar />

      <div className="max-w-[100rem] mx-auto px-6 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="mb-12">
            <h1 className="font-heading font-bold text-5xl text-textprimary mb-4">
              Create New Project
            </h1>
            <p className="font-paragraph text-lg text-textprimary/70">
              Share your hackathon project idea and find the perfect team members
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-cardbackground rounded-2xl p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center">
                  <Rocket className="w-6 h-6 text-white" />
                </div>
                <h2 className="font-heading font-bold text-2xl text-textprimary">
                  Project Details
                </h2>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <Label htmlFor="projectName" className="font-paragraph text-sm font-semibold text-textprimary mb-2 block">
                    Project Name *
                  </Label>
                  <Input
                    id="projectName"
                    value={formData.projectName}
                    onChange={(e) => setFormData({ ...formData, projectName: e.target.value })}
                    required
                    placeholder="My Awesome Hackathon Project"
                    className="bg-inputbackground border-inputborder"
                  />
                </div>

                <div>
                  <Label htmlFor="hackathonName" className="font-paragraph text-sm font-semibold text-textprimary mb-2 block">
                    Hackathon Name *
                  </Label>
                  <Input
                    id="hackathonName"
                    value={formData.hackathonName}
                    onChange={(e) => setFormData({ ...formData, hackathonName: e.target.value })}
                    required
                    placeholder="TechCrunch Disrupt 2024"
                    className="bg-inputbackground border-inputborder"
                  />
                </div>

                <div>
                  <Label htmlFor="projectDescription" className="font-paragraph text-sm font-semibold text-textprimary mb-2 block">
                    Project Description *
                  </Label>
                  <Textarea
                    id="projectDescription"
                    value={formData.projectDescription}
                    onChange={(e) => setFormData({ ...formData, projectDescription: e.target.value })}
                    required
                    placeholder="Describe your project idea, what problem it solves, and what makes it unique..."
                    rows={4}
                    className="bg-inputbackground border-inputborder"
                  />
                </div>

                <div>
                  <Label htmlFor="projectGoals" className="font-paragraph text-sm font-semibold text-textprimary mb-2 block">
                    Project Goals *
                  </Label>
                  <Textarea
                    id="projectGoals"
                    value={formData.projectGoals}
                    onChange={(e) => setFormData({ ...formData, projectGoals: e.target.value })}
                    required
                    placeholder="What do you want to achieve with this project?"
                    rows={3}
                    className="bg-inputbackground border-inputborder"
                  />
                </div>

                <div>
                  <Label htmlFor="requiredSkills" className="font-paragraph text-sm font-semibold text-textprimary mb-2 block">
                    Required Skills *
                  </Label>
                  <Input
                    id="requiredSkills"
                    value={formData.requiredSkills}
                    onChange={(e) => setFormData({ ...formData, requiredSkills: e.target.value })}
                    required
                    placeholder="React, Node.js, Python, UI Design (comma-separated)"
                    className="bg-inputbackground border-inputborder"
                  />
                  <p className="font-paragraph text-xs text-textprimary/60 mt-2">
                    Enter skills separated by commas. This will help us match you with the right teammates.
                  </p>
                </div>

                <div>
                  <Label htmlFor="roleNeeded" className="font-paragraph text-sm font-semibold text-textprimary mb-2 block">
                    Role Needed *
                  </Label>
                  <Input
                    id="roleNeeded"
                    value={formData.roleNeeded}
                    onChange={(e) => setFormData({ ...formData, roleNeeded: e.target.value })}
                    required
                    placeholder="e.g., Frontend Developer, UI/UX Designer, Backend Engineer"
                    className="bg-inputbackground border-inputborder"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="teamSize" className="font-paragraph text-sm font-semibold text-textprimary mb-2 block">
                      Team Size Needed *
                    </Label>
                    <Input
                      id="teamSize"
                      type="number"
                      value={formData.teamSize}
                      onChange={(e) => setFormData({ ...formData, teamSize: e.target.value })}
                      required
                      placeholder="e.g., 3"
                      min="1"
                      className="bg-inputbackground border-inputborder"
                    />
                  </div>

                  <div>
                    <Label htmlFor="timeCommitment" className="font-paragraph text-sm font-semibold text-textprimary mb-2 block">
                      Time Commitment *
                    </Label>
                    <Input
                      id="timeCommitment"
                      value={formData.timeCommitment}
                      onChange={(e) => setFormData({ ...formData, timeCommitment: e.target.value })}
                      required
                      placeholder="e.g., 20 hours/week"
                      className="bg-inputbackground border-inputborder"
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={submitting}
                  className="w-full bg-buttonbackground text-buttonforeground hover:bg-primary/90 h-12"
                >
                  {submitting ? 'Creating Project...' : 'Create Project & Find Team'}
                </Button>
              </form>
            </div>

            <div className="bg-secondary rounded-2xl p-8">
              <h2 className="font-heading font-bold text-2xl text-textprimary mb-4">
                Why Create a Project?
              </h2>
              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-white font-heading font-bold">1</span>
                  </div>
                  <div>
                    <h3 className="font-heading font-semibold text-lg text-textprimary mb-2">
                      AI-Powered Matching
                    </h3>
                    <p className="font-paragraph text-base text-textprimary/70">
                      Our intelligent system analyzes your project requirements and suggests the most compatible team members based on skills, experience, and availability.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-white font-heading font-bold">2</span>
                  </div>
                  <div>
                    <h3 className="font-heading font-semibold text-lg text-textprimary mb-2">
                      Instant Visibility
                    </h3>
                    <p className="font-paragraph text-base text-textprimary/70">
                      Your project will be visible to thousands of talented developers and designers looking for exciting opportunities.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-white font-heading font-bold">3</span>
                  </div>
                  <div>
                    <h3 className="font-heading font-semibold text-lg text-textprimary mb-2">
                      Build Faster
                    </h3>
                    <p className="font-paragraph text-base text-textprimary/70">
                      Skip the lengthy team formation process and start building immediately with pre-vetted, compatible teammates.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {showSuggestions && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="mt-12"
            >
              <SuggestTeamPanel projectSkills={projectSkills} onInvite={handleInvite} />
            </motion.div>
          )}
        </motion.div>
      </div>

      <Footer />
    </div>
  );
}
