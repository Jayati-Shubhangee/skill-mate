import { useEffect, useState } from 'react';
import { Teams, Projects } from '@/entities';
import { BaseCrudService } from '@/integrations';
import { Image } from '@/components/ui/image';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Users, Target, Calendar, X } from 'lucide-react';
import SkillTag from './SkillTag';

interface TeamDashboardModalProps {
  team: Teams;
  isOpen: boolean;
  onClose: () => void;
}

export default function TeamDashboardModal({ team, isOpen, onClose }: TeamDashboardModalProps) {
  const [projects, setProjects] = useState<Projects[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      loadTeamProjects();
    }
  }, [isOpen, team._id]);

  const loadTeamProjects = async () => {
    setLoading(true);
    const { items } = await BaseCrudService.getAll<Projects>('projects');
    // Filter projects created by this team (ongoing projects only)
    const teamProjects = items.filter(
      p => p.hackathonName === team.teamName && p.projectStatus?.toLowerCase() === 'active'
    );
    setProjects(teamProjects);
    setLoading(false);
  };

  const spotsLeft = (team.maximumTeamSize || 0) - (team.currentTeamSize || 0);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <div className="flex-1">Team Dashboard</div>
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
          {/* Team Header */}
          <div className="flex items-start gap-4 pb-6 border-b border-inputborder">
            {team.teamLogo ? (
              <Image
                src={team.teamLogo}
                alt={team.teamName || 'Team logo'}
                className="w-20 h-20 rounded-xl object-cover"
                width={80}
              />
            ) : (
              <div className="w-20 h-20 rounded-xl bg-primary flex items-center justify-center">
                <Users className="w-10 h-10 text-white" />
              </div>
            )}
            <div className="flex-1">
              <h2 className="font-heading font-bold text-2xl text-textprimary mb-2">
                {team.teamName || 'Unnamed Team'}
              </h2>
              {team.description && (
                <p className="font-paragraph text-base text-textprimary/80 mb-3">
                  {team.description}
                </p>
              )}
              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-primary" />
                  <span className="font-paragraph text-textprimary/70">
                    {team.currentTeamSize || 0}/{team.maximumTeamSize || 0} members
                  </span>
                </div>
                {team.lookingForMembers && spotsLeft > 0 && (
                  <span className="px-3 py-1 bg-primary text-white rounded-full text-xs font-paragraph font-semibold">
                    Recruiting
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Team Goal */}
          {team.goal && (
            <div>
              <h3 className="font-heading font-semibold text-lg text-textprimary mb-2">
                Team Goal
              </h3>
              <div className="flex items-start gap-3 p-4 bg-secondary rounded-xl">
                <Target className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                <p className="font-paragraph text-base text-textprimary/80">
                  {team.goal}
                </p>
              </div>
            </div>
          )}

          {/* Skills Needed */}
          {team.skillsNeededDescription && team.lookingForMembers && (
            <div>
              <h3 className="font-heading font-semibold text-lg text-textprimary mb-2">
                Skills Needed
              </h3>
              <p className="font-paragraph text-base text-textprimary/80 p-4 bg-secondary rounded-xl">
                {team.skillsNeededDescription}
              </p>
            </div>
          )}

          {/* Team Projects */}
          <div>
            <h3 className="font-heading font-semibold text-lg text-textprimary mb-4">
              Ongoing Projects ({projects.length})
            </h3>
            {loading ? (
              <div className="space-y-3">
                {[1, 2].map(i => (
                  <div key={i} className="bg-cardbackground rounded-xl p-4 h-32 animate-pulse" />
                ))}
              </div>
            ) : projects.length === 0 ? (
              <div className="text-center py-8 bg-secondary rounded-xl">
                <p className="font-paragraph text-textprimary/60">
                  No ongoing projects yet. This team will create projects soon!
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {projects.map(project => (
                  <div key={project._id} className="bg-cardbackground rounded-xl p-4 border border-inputborder hover:border-primary transition-colors">
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-heading font-semibold text-lg text-textprimary">
                        {project.projectName || 'Untitled Project'}
                      </h4>
                      {project.projectStatus && (
                        <span className={`px-3 py-1 rounded-full text-xs font-paragraph font-semibold ${
                          project.projectStatus.toLowerCase() === 'active'
                            ? 'bg-primary text-white'
                            : 'bg-secondary text-textprimary'
                        }`}>
                          {project.projectStatus}
                        </span>
                      )}
                    </div>
                    {project.projectDescription && (
                      <p className="font-paragraph text-sm text-textprimary/80 mb-3 line-clamp-2">
                        {project.projectDescription}
                      </p>
                    )}
                    {project.requiredSkills && (
                      <div className="flex flex-wrap gap-2">
                        {project.requiredSkills.split(',').slice(0, 4).map((skill, idx) => (
                          <SkillTag key={idx} skill={skill.trim()} size="sm" />
                        ))}
                        {project.requiredSkills.split(',').length > 4 && (
                          <span className="font-paragraph text-xs text-textprimary/60">
                            +{project.requiredSkills.split(',').length - 4} more
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Action Button */}
          {team.lookingForMembers && spotsLeft > 0 && (
            <Button className="w-full bg-buttonbackground text-buttonforeground hover:bg-primary/90 h-12">
              Send Request to Join
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
