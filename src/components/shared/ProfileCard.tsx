import { UserProfiles } from '@/entities';
import { Image } from '@/components/ui/image';
import { Button } from '@/components/ui/button';
import SkillTag from './SkillTag';
import { Github, Mail } from 'lucide-react';

interface ProfileCardProps {
  profile: UserProfiles;
  onViewDetails?: (profile: UserProfiles) => void;
  showActions?: boolean;
  compatibilityScore?: number;
}

export default function ProfileCard({ 
  profile, 
  onViewDetails, 
  showActions = true,
  compatibilityScore 
}: ProfileCardProps) {
  const skills = profile.skills?.split(',').map(s => s.trim()).filter(Boolean) || [];

  return (
    <div className="bg-cardbackground rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-start gap-4 mb-4">
        <div className="relative">
          {profile.profilePicture ? (
            <Image 
              src={profile.profilePicture} 
              alt={profile.fullName || 'User profile'} 
              className="w-16 h-16 rounded-full object-cover"
              width={64}
            />
          ) : (
            <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center">
              <span className="text-white font-heading font-bold text-xl">
                {profile.fullName?.charAt(0) || 'U'}
              </span>
            </div>
          )}
          {compatibilityScore !== undefined && (
            <div className="absolute -top-2 -right-2 bg-primary text-white rounded-full w-8 h-8 flex items-center justify-center text-xs font-bold">
              {compatibilityScore}%
            </div>
          )}
        </div>
        <div className="flex-1">
          <h3 className="font-heading font-semibold text-xl text-textprimary mb-1">
            {profile.fullName || 'Anonymous User'}
          </h3>
          <p className="font-paragraph text-sm text-textprimary/70">
            {profile.preferredRole || 'Team Member'} • {profile.experienceLevel || 'Intermediate'}
          </p>
        </div>
      </div>

      {profile.bio && (
        <p className="font-paragraph text-base text-textprimary/80 mb-4 line-clamp-2">
          {profile.bio}
        </p>
      )}

      {skills.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {skills.slice(0, 4).map((skill, index) => (
            <SkillTag key={index} skill={skill} size="sm" />
          ))}
          {skills.length > 4 && (
            <span className="font-paragraph text-sm text-textprimary/60">
              +{skills.length - 4} more
            </span>
          )}
        </div>
      )}

      <div className="flex items-center gap-2 mb-4 text-sm text-textprimary/70">
        <span className="font-paragraph">
          {profile.availability || 'Availability not set'}
        </span>
      </div>

      {showActions && (
        <div className="flex gap-2">
          {onViewDetails && (
            <Button 
              onClick={() => onViewDetails(profile)} 
              className="flex-1 bg-buttonbackground text-buttonforeground hover:bg-primary/90"
              size="sm"
            >
              View Profile
            </Button>
          )}
          {profile.githubUrl && (
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => window.open(profile.githubUrl, '_blank')}
            >
              <Github className="w-4 h-4" />
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
