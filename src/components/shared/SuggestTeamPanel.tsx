import { useState, useEffect } from 'react';
import { UserProfiles } from '@/entities';
import { BaseCrudService } from '@/integrations';
import ProfileCard from './ProfileCard';
import ProfileModal from './ProfileModal';
import { Sparkles } from 'lucide-react';

interface SuggestTeamPanelProps {
  projectSkills?: string;
  onInvite?: (profileId: string) => void;
}

interface CompatibilityScore {
  profile: UserProfiles;
  score: number;
  breakdown: {
    skillMatch: number;
    availabilityMatch: number;
    experienceMatch: number;
    overall: number;
  };
}

export default function SuggestTeamPanel({ projectSkills, onInvite }: SuggestTeamPanelProps) {
  const [suggestions, setSuggestions] = useState<CompatibilityScore[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProfile, setSelectedProfile] = useState<UserProfiles | null>(null);
  const [selectedBreakdown, setSelectedBreakdown] = useState<any>(null);

  useEffect(() => {
    loadSuggestions();
  }, [projectSkills]);

  const loadSuggestions = async () => {
    setLoading(true);
    const { items } = await BaseCrudService.getAll<UserProfiles>('userprofiles');
    
    // Simple ML-like scoring algorithm
    const scored = items.map(profile => {
      const profileSkills = profile.skills?.toLowerCase().split(',').map(s => s.trim()) || [];
      const requiredSkills = projectSkills?.toLowerCase().split(',').map(s => s.trim()) || [];
      
      // Skill match calculation
      const matchingSkills = profileSkills.filter(skill => 
        requiredSkills.some(req => skill.includes(req) || req.includes(skill))
      );
      const skillMatch = requiredSkills.length > 0 
        ? Math.round((matchingSkills.length / requiredSkills.length) * 100)
        : 50;

      // Availability match (simple heuristic)
      const availabilityMatch = profile.availability?.toLowerCase().includes('full') ? 100 : 
                                profile.availability?.toLowerCase().includes('part') ? 70 : 50;

      // Experience match (weighted scoring)
      const experienceMatch = profile.experienceLevel?.toLowerCase() === 'expert' ? 100 :
                             profile.experienceLevel?.toLowerCase() === 'advanced' ? 85 :
                             profile.experienceLevel?.toLowerCase() === 'intermediate' ? 70 : 60;

      // Overall score (weighted average)
      const overall = Math.round(
        (skillMatch * 0.5) + (availabilityMatch * 0.3) + (experienceMatch * 0.2)
      );

      return {
        profile,
        score: overall,
        breakdown: {
          skillMatch,
          availabilityMatch,
          experienceMatch,
          overall
        }
      };
    });

    // Sort by score and take top 6
    const topSuggestions = scored
      .sort((a, b) => b.score - a.score)
      .slice(0, 6);

    setSuggestions(topSuggestions);
    setLoading(false);
  };

  const handleViewDetails = (profile: UserProfiles) => {
    const suggestion = suggestions.find(s => s.profile._id === profile._id);
    setSelectedProfile(profile);
    setSelectedBreakdown(suggestion?.breakdown);
  };

  if (loading) {
    return (
      <div className="bg-secondary rounded-2xl p-8">
        <div className="flex items-center gap-2 mb-6">
          <Sparkles className="w-6 h-6 text-primary" />
          <h2 className="font-heading font-bold text-2xl text-textprimary">
            AI-Powered Team Suggestions
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="bg-cardbackground rounded-2xl p-6 h-64 animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="bg-secondary rounded-2xl p-8">
        <div className="flex items-center gap-2 mb-2">
          <Sparkles className="w-6 h-6 text-primary" />
          <h2 className="font-heading font-bold text-2xl text-textprimary">
            AI-Powered Team Suggestions
          </h2>
        </div>
        <p className="font-paragraph text-base text-textprimary/70 mb-6">
          Based on skill overlap, availability, and experience level
        </p>
        
        {suggestions.length === 0 ? (
          <p className="font-paragraph text-base text-textprimary/60 text-center py-8">
            No suggestions available at the moment.
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {suggestions.map(({ profile, score }) => (
              <ProfileCard
                key={profile._id}
                profile={profile}
                compatibilityScore={score}
                onViewDetails={handleViewDetails}
              />
            ))}
          </div>
        )}
      </div>

      <ProfileModal
        profile={selectedProfile}
        isOpen={!!selectedProfile}
        onClose={() => {
          setSelectedProfile(null);
          setSelectedBreakdown(null);
        }}
        onInvite={onInvite}
        compatibilityBreakdown={selectedBreakdown}
      />
    </>
  );
}
