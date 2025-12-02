import { Teams } from '@/entities';
import { Image } from '@/components/ui/image';
import { Button } from '@/components/ui/button';
import { Users, Target } from 'lucide-react';
import { Link } from 'react-router-dom';

interface TeamCardProps {
  team: Teams;
  onJoinTeam?: (teamId: string) => void;
  onViewTeam?: (team: Teams) => void;
}

export default function TeamCard({ team, onJoinTeam, onViewTeam }: TeamCardProps) {
  const spotsLeft = (team.maximumTeamSize || 0) - (team.currentTeamSize || 0);
  const isLookingForMembers = team.lookingForMembers && spotsLeft > 0;

  return (
    <div className="bg-cardbackground rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-start gap-4 mb-4">
        {team.teamLogo ? (
          <Image 
            src={team.teamLogo} 
            alt={team.teamName || 'Team logo'} 
            className="w-16 h-16 rounded-xl object-cover"
            width={64}
          />
        ) : (
          <div className="w-16 h-16 rounded-xl bg-primary flex items-center justify-center">
            <Users className="w-8 h-8 text-white" />
          </div>
        )}
        <div className="flex-1">
          <h3 className="font-heading font-semibold text-xl text-textprimary mb-1">
            {team.teamName || 'Unnamed Team'}
          </h3>
          <div className="flex items-center gap-2 text-sm text-textprimary/70">
            <Users className="w-4 h-4" />
            <span className="font-paragraph">
              {team.currentTeamSize || 0}/{team.maximumTeamSize || 0} members
            </span>
          </div>
        </div>
        {isLookingForMembers && (
          <div className="bg-primary text-white px-3 py-1 rounded-full text-xs font-paragraph font-semibold">
            Recruiting
          </div>
        )}
      </div>

      {team.description && (
        <p className="font-paragraph text-base text-textprimary/80 mb-4 line-clamp-2">
          {team.description}
        </p>
      )}

      {team.goal && (
        <div className="flex items-start gap-2 mb-4 p-3 bg-background rounded-xl">
          <Target className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
          <p className="font-paragraph text-sm text-textprimary/80 line-clamp-2">
            {team.goal}
          </p>
        </div>
      )}

      {team.skillsNeededDescription && isLookingForMembers && (
        <div className="mb-4">
          <p className="font-paragraph text-sm text-textprimary/70 mb-2">
            <span className="font-semibold">Looking for:</span> {team.skillsNeededDescription}
          </p>
        </div>
      )}

      {isLookingForMembers && onJoinTeam && (
        <Button 
          onClick={() => onJoinTeam(team._id)} 
          className="w-full bg-buttonbackground text-buttonforeground hover:bg-primary/90"
          size="sm"
        >
          Send Request to Join
        </Button>
      )}

      {onViewTeam && (
        <Button
          onClick={() => onViewTeam(team)}
          variant="outline"
          className="w-full mt-2"
          size="sm"
        >
          View Team
        </Button>
      )}
    </div>
  );
}
