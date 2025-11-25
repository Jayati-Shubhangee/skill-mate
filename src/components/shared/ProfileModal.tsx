import { UserProfiles } from '@/entities';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Image } from '@/components/ui/image';
import { Button } from '@/components/ui/button';
import SkillTag from './SkillTag';
import { Github, Mail, Calendar, Award } from 'lucide-react';

interface ProfileModalProps {
  profile: UserProfiles | null;
  isOpen: boolean;
  onClose: () => void;
  onInvite?: (profileId: string) => void;
  compatibilityBreakdown?: {
    skillMatch: number;
    availabilityMatch: number;
    experienceMatch: number;
    overall: number;
  };
}

export default function ProfileModal({ 
  profile, 
  isOpen, 
  onClose, 
  onInvite,
  compatibilityBreakdown 
}: ProfileModalProps) {
  if (!profile) return null;

  const skills = profile.skills?.split(',').map(s => s.trim()).filter(Boolean) || [];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-heading text-2xl">Profile Details</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <div className="flex items-start gap-6">
            {profile.profilePicture ? (
              <Image 
                src={profile.profilePicture} 
                alt={profile.fullName || 'User profile'} 
                className="w-24 h-24 rounded-full object-cover"
                width={96}
              />
            ) : (
              <div className="w-24 h-24 rounded-full bg-primary flex items-center justify-center">
                <span className="text-white font-heading font-bold text-3xl">
                  {profile.fullName?.charAt(0) || 'U'}
                </span>
              </div>
            )}
            <div className="flex-1">
              <h2 className="font-heading font-bold text-2xl text-textprimary mb-2">
                {profile.fullName || 'Anonymous User'}
              </h2>
              <div className="space-y-1">
                <p className="font-paragraph text-base text-textprimary/70">
                  <span className="font-semibold">Role:</span> {profile.preferredRole || 'Team Member'}
                </p>
                <p className="font-paragraph text-base text-textprimary/70">
                  <span className="font-semibold">Experience:</span> {profile.experienceLevel || 'Intermediate'}
                </p>
                <p className="font-paragraph text-base text-textprimary/70">
                  <span className="font-semibold">Availability:</span> {profile.availability || 'Not specified'}
                </p>
              </div>
            </div>
          </div>

          {profile.bio && (
            <div>
              <h3 className="font-heading font-semibold text-lg text-textprimary mb-2">About</h3>
              <p className="font-paragraph text-base text-textprimary/80">
                {profile.bio}
              </p>
            </div>
          )}

          {skills.length > 0 && (
            <div>
              <h3 className="font-heading font-semibold text-lg text-textprimary mb-3">Skills</h3>
              <div className="flex flex-wrap gap-2">
                {skills.map((skill, index) => (
                  <SkillTag key={index} skill={skill} />
                ))}
              </div>
            </div>
          )}

          {compatibilityBreakdown && (
            <div className="bg-secondary rounded-xl p-4">
              <h3 className="font-heading font-semibold text-lg text-textprimary mb-3">
                Compatibility Analysis
              </h3>
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="font-paragraph text-sm text-textprimary/70">Skill Match</span>
                    <span className="font-paragraph text-sm font-semibold text-textprimary">
                      {compatibilityBreakdown.skillMatch}%
                    </span>
                  </div>
                  <div className="w-full bg-background rounded-full h-2">
                    <div 
                      className="bg-primary h-2 rounded-full transition-all" 
                      style={{ width: `${compatibilityBreakdown.skillMatch}%` }}
                    />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="font-paragraph text-sm text-textprimary/70">Availability Match</span>
                    <span className="font-paragraph text-sm font-semibold text-textprimary">
                      {compatibilityBreakdown.availabilityMatch}%
                    </span>
                  </div>
                  <div className="w-full bg-background rounded-full h-2">
                    <div 
                      className="bg-primary h-2 rounded-full transition-all" 
                      style={{ width: `${compatibilityBreakdown.availabilityMatch}%` }}
                    />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="font-paragraph text-sm text-textprimary/70">Experience Match</span>
                    <span className="font-paragraph text-sm font-semibold text-textprimary">
                      {compatibilityBreakdown.experienceMatch}%
                    </span>
                  </div>
                  <div className="w-full bg-background rounded-full h-2">
                    <div 
                      className="bg-primary h-2 rounded-full transition-all" 
                      style={{ width: `${compatibilityBreakdown.experienceMatch}%` }}
                    />
                  </div>
                </div>
                <div className="pt-2 border-t border-inputborder">
                  <div className="flex justify-between">
                    <span className="font-paragraph text-base font-semibold text-textprimary">Overall Match</span>
                    <span className="font-heading text-xl font-bold text-primary">
                      {compatibilityBreakdown.overall}%
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="flex gap-3">
            {onInvite && (
              <Button 
                onClick={() => onInvite(profile._id)} 
                className="flex-1 bg-buttonbackground text-buttonforeground hover:bg-primary/90"
              >
                Invite to Team
              </Button>
            )}
            {profile.githubUrl && (
              <Button 
                variant="outline"
                onClick={() => window.open(profile.githubUrl, '_blank')}
                className="gap-2"
              >
                <Github className="w-4 h-4" />
                GitHub
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
