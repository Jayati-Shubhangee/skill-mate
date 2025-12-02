import { useEffect, useState } from 'react';
import { Teams } from '@/entities';
import { BaseCrudService } from '@/integrations';
import NavBar from '@/components/layout/NavBar';
import Footer from '@/components/layout/Footer';
import TeamCard from '@/components/shared/TeamCard';
import TeamDashboardModal from '@/components/shared/TeamDashboardModal';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Filter } from 'lucide-react';
import { motion } from 'framer-motion';
import { useToast } from '@/hooks/use-toast';

export default function TeamsPage() {
  const [teams, setTeams] = useState<Teams[]>([]);
  const [filteredTeams, setFilteredTeams] = useState<Teams[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showOnlyRecruiting, setShowOnlyRecruiting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [selectedTeam, setSelectedTeam] = useState<Teams | null>(null);
  const [showDashboard, setShowDashboard] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadTeams();
  }, []);

  useEffect(() => {
    let filtered = teams;

    if (searchQuery.trim() !== '') {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(team =>
        team.teamName?.toLowerCase().includes(query) ||
        team.description?.toLowerCase().includes(query) ||
        team.skillsNeededDescription?.toLowerCase().includes(query)
      );
    }

    if (showOnlyRecruiting) {
      filtered = filtered.filter(team => {
        const spotsLeft = (team.maximumTeamSize || 0) - (team.currentTeamSize || 0);
        return team.lookingForMembers && spotsLeft > 0;
      });
    }

    setFilteredTeams(filtered);
  }, [searchQuery, showOnlyRecruiting, teams]);

  const loadTeams = async () => {
    setLoading(true);
    const { items } = await BaseCrudService.getAll<Teams>('teams');
    setTeams(items);
    setFilteredTeams(items);
    setLoading(false);
  };

  const handleJoinTeam = async (teamId: string) => {
    toast({
      title: 'Interest Expressed!',
      description: 'The team has been notified of your interest.',
    });
  };

  const handleViewTeam = (team: Teams) => {
    setSelectedTeam(team);
    setShowDashboard(true);
  };

  return (
    <div className="min-h-screen bg-background">
      <NavBar />

      <div className="max-w-[100rem] mx-auto px-6 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-12"
        >
          <h1 className="font-heading font-bold text-5xl text-textprimary mb-4">
            Browse Teams
          </h1>
          <p className="font-paragraph text-lg text-textprimary/70 mb-8">
            Find teams looking for talented members or create your own
          </p>

          <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
            <div className="relative flex-1 max-w-2xl">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-textprimary/40" />
              <Input
                type="text"
                placeholder="Search teams by name, description, or skills..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 h-14 bg-inputbackground border-inputborder rounded-full"
              />
            </div>

            <Button
              variant={showOnlyRecruiting ? 'default' : 'outline'}
              onClick={() => setShowOnlyRecruiting(!showOnlyRecruiting)}
              className={`gap-2 h-14 px-6 rounded-full ${
                showOnlyRecruiting ? 'bg-buttonbackground text-buttonforeground' : ''
              }`}
            >
              <Filter className="w-4 h-4" />
              Recruiting Only
            </Button>
          </div>
        </motion.div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="bg-cardbackground rounded-2xl p-6 h-80 animate-pulse" />
            ))}
          </div>
        ) : filteredTeams.length === 0 ? (
          <div className="text-center py-20">
            <p className="font-paragraph text-lg text-textprimary/60">
              {searchQuery || showOnlyRecruiting 
                ? 'No teams found matching your criteria.' 
                : 'No teams available yet.'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTeams.map((team, index) => (
              <motion.div
                key={team._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.05 }}
              >
                <TeamCard 
                  team={team} 
                  onJoinTeam={handleJoinTeam}
                  onViewTeam={handleViewTeam}
                />
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {selectedTeam && (
        <TeamDashboardModal
          team={selectedTeam}
          isOpen={showDashboard}
          onClose={() => setShowDashboard(false)}
        />
      )}

      <Footer />
    </div>
  );
}
