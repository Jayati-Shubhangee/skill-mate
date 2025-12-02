import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { BaseCrudService } from '@/integrations';
import { Projects } from '@/entities';
import { useToast } from '@/hooks/use-toast';
import { motion } from 'framer-motion';
import { ChevronRight, ChevronLeft, Rocket } from 'lucide-react';

interface ProjectFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onProjectCreated?: (projectSkills: string) => void;
}

export default function ProjectFormModal({ isOpen, onClose, onProjectCreated }: ProjectFormModalProps) {
  const { toast } = useToast();
  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    projectName: '',
    projectDescription: '',
    projectGoals: '',
    requiredSkills: '',
    hackathonName: '',
    roleNeeded: '',
    teamSize: '',
    timeCommitment: '',
    projectStatus: 'Active',
  });

  const totalSteps = 4;

  const handleNext = () => {
    if (validateStep(step)) {
      setStep(step + 1);
    }
  };

  const handlePrevious = () => {
    setStep(step - 1);
  };

  const validateStep = (currentStep: number): boolean => {
    switch (currentStep) {
      case 1:
        if (!formData.projectName.trim()) {
          toast({ title: 'Error', description: 'Please enter a project name' });
          return false;
        }
        if (!formData.hackathonName.trim()) {
          toast({ title: 'Error', description: 'Please enter the hackathon name' });
          return false;
        }
        return true;
      case 2:
        if (!formData.projectDescription.trim()) {
          toast({ title: 'Error', description: 'Please describe your project' });
          return false;
        }
        if (!formData.projectGoals.trim()) {
          toast({ title: 'Error', description: 'Please enter your project goals' });
          return false;
        }
        return true;
      case 3:
        if (!formData.requiredSkills.trim()) {
          toast({ title: 'Error', description: 'Please enter required skills' });
          return false;
        }
        if (!formData.roleNeeded.trim()) {
          toast({ title: 'Error', description: 'Please specify the role needed' });
          return false;
        }
        return true;
      case 4:
        if (!formData.teamSize.trim()) {
          toast({ title: 'Error', description: 'Please enter team size needed' });
          return false;
        }
        if (!formData.timeCommitment.trim()) {
          toast({ title: 'Error', description: 'Please enter time commitment' });
          return false;
        }
        return true;
      default:
        return true;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateStep(step)) return;

    setSubmitting(true);

    try {
      const project: Projects = {
        _id: crypto.randomUUID(),
        projectName: formData.projectName,
        projectDescription: formData.projectDescription,
        projectGoals: formData.projectGoals,
        requiredSkills: formData.requiredSkills,
        hackathonName: formData.hackathonName,
        projectStatus: formData.projectStatus,
        submissionDate: new Date().toISOString(),
      };

      await BaseCrudService.create('projects', project);

      toast({
        title: 'Success!',
        description: 'Your project has been created. Finding matching teammates...',
      });

      if (onProjectCreated) {
        onProjectCreated(formData.requiredSkills);
      }

      // Reset form
      setFormData({
        projectName: '',
        projectDescription: '',
        projectGoals: '',
        requiredSkills: '',
        hackathonName: '',
        roleNeeded: '',
        teamSize: '',
        timeCommitment: '',
        projectStatus: 'Active',
      });
      setStep(1);
      onClose();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to create project. Please try again.',
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-2xl">
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
              <Rocket className="w-6 h-6 text-white" />
            </div>
            Create Your Project
          </DialogTitle>
          <p className="text-sm text-textprimary/60 mt-2">
            Step {step} of {totalSteps}
          </p>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 py-4">
          {/* Step 1: Basic Info */}
          {step === 1 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              <div>
                <Label htmlFor="projectName" className="font-paragraph text-sm font-semibold text-textprimary mb-2 block">
                  What's your project name? *
                </Label>
                <Input
                  id="projectName"
                  value={formData.projectName}
                  onChange={(e) => setFormData({ ...formData, projectName: e.target.value })}
                  placeholder="e.g., AI-Powered Task Manager"
                  className="bg-inputbackground border-inputborder"
                />
              </div>

              <div>
                <Label htmlFor="hackathonName" className="font-paragraph text-sm font-semibold text-textprimary mb-2 block">
                  Which hackathon is this for? *
                </Label>
                <Input
                  id="hackathonName"
                  value={formData.hackathonName}
                  onChange={(e) => setFormData({ ...formData, hackathonName: e.target.value })}
                  placeholder="e.g., TechCrunch Disrupt 2024"
                  className="bg-inputbackground border-inputborder"
                />
              </div>
            </motion.div>
          )}

          {/* Step 2: Project Details */}
          {step === 2 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              <div>
                <Label htmlFor="projectDescription" className="font-paragraph text-sm font-semibold text-textprimary mb-2 block">
                  Describe your project idea *
                </Label>
                <Textarea
                  id="projectDescription"
                  value={formData.projectDescription}
                  onChange={(e) => setFormData({ ...formData, projectDescription: e.target.value })}
                  placeholder="What problem does it solve? What makes it unique?"
                  rows={4}
                  className="bg-inputbackground border-inputborder"
                />
              </div>

              <div>
                <Label htmlFor="projectGoals" className="font-paragraph text-sm font-semibold text-textprimary mb-2 block">
                  What are your project goals? *
                </Label>
                <Textarea
                  id="projectGoals"
                  value={formData.projectGoals}
                  onChange={(e) => setFormData({ ...formData, projectGoals: e.target.value })}
                  placeholder="What do you want to achieve?"
                  rows={3}
                  className="bg-inputbackground border-inputborder"
                />
              </div>
            </motion.div>
          )}

          {/* Step 3: Skills & Roles */}
          {step === 3 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              <div>
                <Label htmlFor="requiredSkills" className="font-paragraph text-sm font-semibold text-textprimary mb-2 block">
                  What skills do you need? *
                </Label>
                <Input
                  id="requiredSkills"
                  value={formData.requiredSkills}
                  onChange={(e) => setFormData({ ...formData, requiredSkills: e.target.value })}
                  placeholder="e.g., React, Node.js, Python, UI Design (comma-separated)"
                  className="bg-inputbackground border-inputborder"
                />
                <p className="font-paragraph text-xs text-textprimary/60 mt-2">
                  Enter skills separated by commas. This helps us match you with the right teammates.
                </p>
              </div>

              <div>
                <Label htmlFor="roleNeeded" className="font-paragraph text-sm font-semibold text-textprimary mb-2 block">
                  What role are you looking for? *
                </Label>
                <Input
                  id="roleNeeded"
                  value={formData.roleNeeded}
                  onChange={(e) => setFormData({ ...formData, roleNeeded: e.target.value })}
                  placeholder="e.g., Frontend Developer, UI/UX Designer, Backend Engineer"
                  className="bg-inputbackground border-inputborder"
                />
              </div>
            </motion.div>
          )}

          {/* Step 4: Team & Time */}
          {step === 4 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="teamSize" className="font-paragraph text-sm font-semibold text-textprimary mb-2 block">
                    Team size needed *
                  </Label>
                  <Input
                    id="teamSize"
                    type="number"
                    value={formData.teamSize}
                    onChange={(e) => setFormData({ ...formData, teamSize: e.target.value })}
                    placeholder="e.g., 3"
                    min="1"
                    className="bg-inputbackground border-inputborder"
                  />
                </div>

                <div>
                  <Label htmlFor="timeCommitment" className="font-paragraph text-sm font-semibold text-textprimary mb-2 block">
                    Time commitment *
                  </Label>
                  <Input
                    id="timeCommitment"
                    value={formData.timeCommitment}
                    onChange={(e) => setFormData({ ...formData, timeCommitment: e.target.value })}
                    placeholder="e.g., 20 hours/week"
                    className="bg-inputbackground border-inputborder"
                  />
                </div>
              </div>

              <div className="bg-secondary rounded-lg p-4">
                <p className="font-paragraph text-sm text-textprimary/70">
                  ✨ Once you submit, we'll analyze your project and suggest the best matching teammates based on their skills and availability.
                </p>
              </div>
            </motion.div>
          )}

          {/* Navigation Buttons */}
          <div className="flex gap-3 pt-6 border-t border-inputborder">
            {step > 1 && (
              <Button
                type="button"
                variant="outline"
                onClick={handlePrevious}
                className="gap-2"
              >
                <ChevronLeft className="w-4 h-4" />
                Previous
              </Button>
            )}

            {step < totalSteps ? (
              <Button
                type="button"
                onClick={handleNext}
                className="ml-auto bg-buttonbackground text-buttonforeground hover:bg-primary/90 gap-2"
              >
                Next
                <ChevronRight className="w-4 h-4" />
              </Button>
            ) : (
              <Button
                type="submit"
                disabled={submitting}
                className="ml-auto bg-buttonbackground text-buttonforeground hover:bg-primary/90 gap-2"
              >
                {submitting ? 'Creating...' : 'Create Project & Find Team'}
                <Rocket className="w-4 h-4" />
              </Button>
            )}
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
