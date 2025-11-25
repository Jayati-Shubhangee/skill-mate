import { UserProfiles, Testimonials } from '@/entities';
import { Image } from '@/components/ui/image';
import { Button } from '@/components/ui/button';
import SkillTag from './SkillTag';
import { Github, Award, BookOpen, Zap, Star } from 'lucide-react';

interface EnhancedProfileCardProps {
  profile: UserProfiles;
  matchScore: number;
  matchedSkills: string[];
  testimonial?: Testimonials;
  onInvite: () => void;
}

export default function EnhancedProfileCard({
  profile,
  matchScore,
  matchedSkills,
  testimonial,
  onInvite,
}: EnhancedProfileCardProps) {
  const allSkills = profile.skills?.split(',').map(s => s.trim()).filter(Boolean) || [];

  return (
    <div className="bg-cardbackground rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col h-full">
      {/* Header with match score */}
      <div className="relative bg-gradient-to-r from-primary/10 to-primary/5 p-6 pb-4">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            {profile.profilePicture ? (
              <Image
                src={profile.profilePicture}
                alt={profile.fullName || 'User profile'}
                className="w-16 h-16 rounded-full object-cover border-4 border-white"
                width={64}
              />
            ) : (
              <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center border-4 border-white">
                <span className="text-white font-heading font-bold text-xl">
                  {profile.fullName?.charAt(0) || 'U'}
                </span>
              </div>
            )}
          </div>
          <div className="text-right">
            <div className="bg-primary text-white rounded-full w-14 h-14 flex items-center justify-center">
              <div className="text-center">
                <div className="font-heading font-bold text-lg">{matchScore}%</div>
                <div className="font-paragraph text-xs">Match</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Profile Info */}
      <div className="px-6 pt-4 pb-3 flex-1">
        <h3 className="font-heading font-bold text-xl text-textprimary mb-1">
          {profile.fullName || 'Anonymous User'}
        </h3>

        <div className="flex items-center gap-2 mb-3">
          <span className="font-paragraph text-sm font-semibold text-primary">
            {profile.preferredRole || 'Team Member'}
          </span>
          <span className="font-paragraph text-sm text-textprimary/60">•</span>
          <span className="font-paragraph text-sm text-textprimary/70">
            {profile.experienceLevel || 'Intermediate'}
          </span>
        </div>

        {/* College & Year */}
        {(profile.college || profile.year) && (
          <div className="flex items-center gap-2 mb-3 text-sm">
            <BookOpen className="w-4 h-4 text-primary/60" />
            <span className="font-paragraph text-sm text-textprimary/70">
              {profile.college && profile.year
                ? `${profile.college} • ${profile.year}`
                : profile.college || profile.year}
            </span>
          </div>
        )}

        {/* Bio */}
        {profile.bio && (
          <p className="font-paragraph text-sm text-textprimary/80 mb-3 line-clamp-2">
            {profile.bio}
          </p>
        )}

        {/* Matched Skills Highlight */}
        {matchedSkills.length > 0 && (
          <div className="mb-3">
            <p className="font-paragraph text-xs font-semibold text-primary mb-2">
              Matched Skills
            </p>
            <div className="flex flex-wrap gap-2">
              {matchedSkills.map((skill, index) => (
                <SkillTag key={index} skill={skill} variant="primary" size="sm" />
              ))}
            </div>
          </div>
        )}

        {/* All Skills */}
        {allSkills.length > 0 && (
          <div className="mb-3">
            <p className="font-paragraph text-xs font-semibold text-textprimary/60 mb-2">
              All Skills
            </p>
            <div className="flex flex-wrap gap-2">
              {allSkills.slice(0, 5).map((skill, index) => (
                <SkillTag
                  key={index}
                  skill={skill}
                  variant={matchedSkills.includes(skill) ? 'primary' : 'default'}
                  size="sm"
                />
              ))}
              {allSkills.length > 5 && (
                <span className="font-paragraph text-xs text-textprimary/60">
                  +{allSkills.length - 5} more
                </span>
              )}
            </div>
          </div>
        )}

        {/* Hackathon Participation */}
        {profile.hackathonParticipation && (
          <div className="flex items-start gap-2 mb-3 p-2 bg-background rounded-lg">
            <Zap className="w-4 h-4 text-primary/60 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-paragraph text-xs font-semibold text-textprimary/60">
                Hackathons
              </p>
              <p className="font-paragraph text-xs text-textprimary/70 line-clamp-1">
                {profile.hackathonParticipation}
              </p>
            </div>
          </div>
        )}

        {/* Achievements */}
        {profile.achievements && (
          <div className="flex items-start gap-2 mb-3 p-2 bg-background rounded-lg">
            <Award className="w-4 h-4 text-primary/60 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-paragraph text-xs font-semibold text-textprimary/60">
                Achievements
              </p>
              <p className="font-paragraph text-xs text-textprimary/70 line-clamp-1">
                {profile.achievements}
              </p>
            </div>
          </div>
        )}

        {/* Testimonial */}
        {testimonial && (
          <div className="mb-3 p-3 bg-secondary rounded-lg border border-inputborder">
            <div className="flex items-center gap-1 mb-2">
              {[...Array(testimonial.rating || 5)].map((_, i) => (
                <Star key={i} className="w-3 h-3 fill-primary text-primary" />
              ))}
            </div>
            <p className="font-paragraph text-xs text-textprimary/80 line-clamp-2 italic">
              "{testimonial.testimonialText}"
            </p>
          </div>
        )}

        {/* Availability */}
        {profile.availability && (
          <div className="text-xs text-textprimary/60 font-paragraph mb-3">
            <span className="inline-block px-2 py-1 bg-background rounded-full">
              {profile.availability}
            </span>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="px-6 pb-6 pt-3 border-t border-inputborder flex gap-2">
        <Button
          onClick={onInvite}
          className="flex-1 bg-buttonbackground text-buttonforeground hover:bg-primary/90 h-11"
        >
          Invite to Team
        </Button>
        {profile.githubUrl && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => window.open(profile.githubUrl, '_blank')}
            className="h-11 px-3"
          >
            <Github className="w-4 h-4" />
          </Button>
        )}
      </div>
    </div>
  );
}
