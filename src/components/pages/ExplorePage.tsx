import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Projects, UserProfiles } from '@/entities';
import { BaseCrudService } from '@/integrations';
import NavBar from '@/components/layout/NavBar';
import Footer from '@/components/layout/Footer';
import { Image } from '@/components/ui/image';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import SkillTag from '@/components/shared/SkillTag';
import { Search, Calendar, Target, Rocket } from 'lucide-react';
import { motion } from 'framer-motion';

interface ScoredProject {
  project: Projects;
  matchScore: number;
}

export default function ExplorePage() {
  const [projects, setProjects] = useState<Projects[]>([]);
  const [userProfiles, setUserProfiles] = useState<UserProfiles[]>([]);
  const [filteredProjects, setFilteredProjects] = useState<Projects[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState<'relevance' | 'recent'>('relevance');

  useEffect(() => {
    loadProjects();
  }, []);

  useEffect(() => {
    if (searchQuery.trim() === '') {
      let sorted = [...projects];
      if (sortBy === 'recent') {
        sorted.sort((a, b) => {
          const dateA = new Date(a.submissionDate || 0).getTime();
          const dateB = new Date(b.submissionDate || 0).getTime();
          return dateB - dateA;
        });
      }
      setFilteredProjects(sorted);
    } else {
      const query = searchQuery.toLowerCase();
      const filtered = projects.filter(project =>
        project.projectName?.toLowerCase().includes(query) ||
        project.projectDescription?.toLowerCase().includes(query) ||
        project.requiredSkills?.toLowerCase().includes(query) ||
        project.hackathonName?.toLowerCase().includes(query)
      );

      // Score projects based on skill matches
      const scored: ScoredProject[] = filtered.map(project => {
        const projectSkills = project.requiredSkills?.toLowerCase().split(',').map(s => s.trim()) || [];
        const querySkills = query.split(',').map(s => s.trim());
        
        let matchScore = 0;
        querySkills.forEach(querySkill => {
          if (projectSkills.some(pSkill => pSkill.includes(querySkill) || querySkill.includes(pSkill))) {
            matchScore += 100;
          }
        });

        return {
          project,
          matchScore: Math.min(matchScore, 100),
        };
      });

      // Sort by match score (relevance)
      scored.sort((a, b) => b.matchScore - a.matchScore);
      setFilteredProjects(scored.map(s => s.project));
    }
  }, [searchQuery, projects, sortBy]);

  const loadProjects = async () => {
    setLoading(true);
    const [projectsRes, profilesRes] = await Promise.all([
      BaseCrudService.getAll<Projects>('projects'),
      BaseCrudService.getAll<UserProfiles>('userprofiles'),
    ]);
    setProjects(projectsRes.items);
    setUserProfiles(profilesRes.items);
    setFilteredProjects(projectsRes.items);
    setLoading(false);
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
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-8">
            <div>
              <h1 className="font-heading font-bold text-5xl text-textprimary mb-4">
                Explore Projects
              </h1>
              <p className="font-paragraph text-lg text-textprimary/70">
                Discover exciting hackathon projects and find opportunities that match your skills
              </p>
            </div>
            <Link to="/create-project">
              <Button className="bg-buttonbackground text-buttonforeground hover:bg-primary/90 h-12 gap-2 whitespace-nowrap">
                <Rocket className="w-5 h-5" />
                Create Project
              </Button>
            </Link>
          </div>

          <div className="relative max-w-2xl">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-textprimary/40" />
            <Input
              type="text"
              placeholder="Search by project name, skills, or hackathon..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 h-14 bg-inputbackground border-inputborder rounded-full"
            />
          </div>
        </motion.div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="bg-cardbackground rounded-2xl p-6 h-96 animate-pulse" />
            ))}
          </div>
        ) : filteredProjects.length === 0 ? (
          <div className="text-center py-20">
            <p className="font-paragraph text-lg text-textprimary/60">
              {searchQuery ? 'No projects found matching your search.' : 'No projects available yet.'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProjects.map((project, index) => (
              <motion.div
                key={project._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.05 }}
                className="bg-cardbackground rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow"
              >
                {project.projectImage ? (
                  <Image
                    src={project.projectImage}
                    alt={project.projectName || 'Project'}
                    className="w-full h-48 object-cover"
                    width={400}
                  />
                ) : (
                  <div className="w-full h-48 bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
                    <Target className="w-16 h-16 text-primary/40" />
                  </div>
                )}

                <div className="p-6">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-heading font-bold text-xl text-textprimary">
                      {project.projectName || 'Untitled Project'}
                    </h3>
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

                  {project.hackathonName && (
                    <p className="font-paragraph text-sm text-primary font-semibold mb-3">
                      {project.hackathonName}
                    </p>
                  )}

                  {project.projectDescription && (
                    <p className="font-paragraph text-base text-textprimary/80 mb-4 line-clamp-3">
                      {project.projectDescription}
                    </p>
                  )}

                  {project.projectGoals && (
                    <div className="mb-4 p-3 bg-background rounded-xl">
                      <p className="font-paragraph text-sm text-textprimary/70 line-clamp-2">
                        <span className="font-semibold">Goal:</span> {project.projectGoals}
                      </p>
                    </div>
                  )}

                  {project.requiredSkills && (
                    <div className="mb-4">
                      <p className="font-paragraph text-sm font-semibold text-textprimary mb-2">
                        Required Skills:
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {project.requiredSkills.split(',').slice(0, 3).map((skill, idx) => (
                          <SkillTag key={idx} skill={skill.trim()} size="sm" />
                        ))}
                        {project.requiredSkills.split(',').length > 3 && (
                          <span className="font-paragraph text-xs text-textprimary/60">
                            +{project.requiredSkills.split(',').length - 3} more
                          </span>
                        )}
                      </div>
                    </div>
                  )}

                  {project.roleNeeded && (
                    <div className="mb-4 p-3 bg-background rounded-xl">
                      <p className="font-paragraph text-sm text-textprimary/70">
                        <span className="font-semibold">Role Needed:</span> {project.roleNeeded}
                      </p>
                    </div>
                  )}

                  {project.teamSize && (
                    <div className="mb-4 p-3 bg-background rounded-xl">
                      <p className="font-paragraph text-sm text-textprimary/70">
                        <span className="font-semibold">Team Size:</span> {project.teamSize} members
                      </p>
                    </div>
                  )}

                  {project.timeCommitment && (
                    <div className="mb-4 p-3 bg-background rounded-xl">
                      <p className="font-paragraph text-sm text-textprimary/70">
                        <span className="font-semibold">Time Commitment:</span> {project.timeCommitment}
                      </p>
                    </div>
                  )}

                  {project.submissionDate && (
                    <div className="flex items-center gap-2 text-sm text-textprimary/60 mb-4">
                      <Calendar className="w-4 h-4" />
                      <span className="font-paragraph">
                        {new Date(project.submissionDate).toLocaleDateString()}
                      </span>
                    </div>
                  )}

                  <Button className="w-full bg-buttonbackground text-buttonforeground hover:bg-primary/90">
                    View Details
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}
