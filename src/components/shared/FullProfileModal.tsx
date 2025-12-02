import { UserProfiles, Testimonials } from '@/entities';
import { Image } from '@/components/ui/image';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Github, BookOpen, Award, Zap, Star, Mail, X } from 'lucide-react';
import SkillTag from './SkillTag';

interface FullProfileModalProps {
  profile: UserProfiles;
  testimonials: Testimonials[];
  isOpen: boolean;
  onClose: () => void;
  onInvite: () => void;
}

export default function FullProfileModal({
  profile,
  testimonials,
  isOpen,
  onClose,
  onInvite,
}: FullProfileModalProps) {
  const allSkills = profile.skills?.split(',').map(s => s.trim()).filter(Boolean) || [];
  const profileTestimonials = testimonials.filter(t => t.authorName === profile.fullName);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>Full Profile</span>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="h-8 w-8 p-0"
            >
              <X className="w-4 h-4" />
            </Button>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Profile Header */}
          <div className="flex items-start gap-4 pb-6 border-b border-inputborder">
            {profile.profilePicture ? (
              <Image
                src={profile.profilePicture}
                alt={profile.fullName || 'User profile'}
                className="w-24 h-24 rounded-full object-cover border-4 border-primary"
                width={96}
              />
            ) : (
              <div className="w-24 h-24 rounded-full bg-primary flex items-center justify-center border-4 border-primary">
                <span className="text-white font-heading font-bold text-3xl">
                  {profile.fullName?.charAt(0) || 'U'}
                </span>
              </div>
            )}
            <div className="flex-1">
              <h2 className="font-heading font-bold text-2xl text-textprimary mb-1">
                {profile.fullName || 'Anonymous User'}
              </h2>
              <div className="flex items-center gap-2 mb-3">
                <span className="font-paragraph text-base font-semibold text-primary">
                  {profile.preferredRole || 'Team Member'}
                </span>
                <span className="font-paragraph text-sm text-textprimary/60">•</span>
                <span className="font-paragraph text-sm text-textprimary/70">
                  {profile.experienceLevel || 'Intermediate'}
                </span>
              </div>
              {profile.bio && (
                <p className="font-paragraph text-base text-textprimary/80 mb-3">
                  {profile.bio}
                </p>
              )}
            </div>
          </div>

          {/* Tabs */}
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="skills">Skills</TabsTrigger>
              <TabsTrigger value="testimonials">Testimonials</TabsTrigger>
              <TabsTrigger value="contact">Contact</TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-4">
              {/* Education */}
              {(profile.college || profile.year) && (
                <div className="flex items-start gap-3 p-4 bg-secondary rounded-xl">
                  <BookOpen className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-paragraph text-sm font-semibold text-textprimary/70 mb-1">
                      Education
                    </p>
                    <p className="font-paragraph text-base text-textprimary">
                      {profile.college && profile.year
                        ? `${profile.college} • ${profile.year}`
                        : profile.college || profile.year}
                    </p>
                  </div>
                </div>
              )}

              {/* Hackathon Participation */}
              {profile.hackathonParticipation && (
                <div className="flex items-start gap-3 p-4 bg-secondary rounded-xl">
                  <Zap className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-paragraph text-sm font-semibold text-textprimary/70 mb-1">
                      Hackathon Experience
                    </p>
                    <p className="font-paragraph text-base text-textprimary">
                      {profile.hackathonParticipation}
                    </p>
                  </div>
                </div>
              )}

              {/* Achievements */}
              {profile.achievements && (
                <div className="flex items-start gap-3 p-4 bg-secondary rounded-xl">
                  <Award className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-paragraph text-sm font-semibold text-textprimary/70 mb-1">
                      Achievements
                    </p>
                    <p className="font-paragraph text-base text-textprimary">
                      {profile.achievements}
                    </p>
                  </div>
                </div>
              )}

              {/* Availability */}
              {profile.availability && (
                <div className="p-4 bg-secondary rounded-xl">
                  <p className="font-paragraph text-sm font-semibold text-textprimary/70 mb-1">
                    Availability
                  </p>
                  <p className="font-paragraph text-base text-textprimary">
                    {profile.availability}
                  </p>
                </div>
              )}
            </TabsContent>

            {/* Skills Tab */}
            <TabsContent value="skills" className="space-y-4">
              {allSkills.length > 0 ? (
                <div>
                  <p className="font-paragraph text-sm font-semibold text-textprimary/70 mb-3">
                    Technical & Soft Skills
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {allSkills.map((skill, index) => (
                      <SkillTag key={index} skill={skill} variant="primary" />
                    ))}
                  </div>
                </div>
              ) : (
                <p className="font-paragraph text-textprimary/60 text-center py-8">
                  No skills listed yet
                </p>
              )}
            </TabsContent>

            {/* Testimonials Tab */}
            <TabsContent value="testimonials" className="space-y-4">
              {profileTestimonials.length > 0 ? (
                <div className="space-y-3">
                  {profileTestimonials.map((testimonial, index) => (
                    <div key={index} className="p-4 bg-secondary rounded-xl border border-inputborder">
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <p className="font-paragraph font-semibold text-textprimary">
                            {testimonial.authorRole || 'Colleague'}
                          </p>
                          <p className="font-paragraph text-sm text-textprimary/60">
                            {testimonial.authorName}
                          </p>
                        </div>
                        <div className="flex items-center gap-1">
                          {[...Array(testimonial.rating || 5)].map((_, i) => (
                            <Star key={i} className="w-4 h-4 fill-primary text-primary" />
                          ))}
                        </div>
                      </div>
                      <p className="font-paragraph text-base text-textprimary/80 italic">
                        "{testimonial.testimonialText}"
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="font-paragraph text-textprimary/60 text-center py-8">
                  No testimonials yet
                </p>
              )}
            </TabsContent>

            {/* Contact Tab */}
            <TabsContent value="contact" className="space-y-4">
              <div className="space-y-3">
                {profile.githubUrl && (
                  <a
                    href={profile.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 p-4 bg-secondary rounded-xl hover:bg-secondary/80 transition-colors"
                  >
                    <Github className="w-5 h-5 text-primary" />
                    <div>
                      <p className="font-paragraph text-sm font-semibold text-textprimary/70">
                        GitHub Profile
                      </p>
                      <p className="font-paragraph text-base text-primary hover:underline">
                        View on GitHub
                      </p>
                    </div>
                  </a>
                )}

                <div className="p-4 bg-secondary rounded-xl">
                  <p className="font-paragraph text-sm font-semibold text-textprimary/70 mb-2">
                    Send Invitation
                  </p>
                  <p className="font-paragraph text-sm text-textprimary/60 mb-3">
                    Invite {profile.fullName} to join your team or project
                  </p>
                  <Button
                    onClick={onInvite}
                    className="w-full bg-buttonbackground text-buttonforeground hover:bg-primary/90 gap-2"
                  >
                    <Mail className="w-4 h-4" />
                    Send Invitation
                  </Button>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  );
}
