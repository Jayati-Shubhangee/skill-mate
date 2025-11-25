import { useEffect, useState } from 'react';
import { UserProfiles, Testimonials } from '@/entities';
import { BaseCrudService } from '@/integrations';
import NavBar from '@/components/layout/NavBar';
import Footer from '@/components/layout/Footer';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import { useToast } from '@/hooks/use-toast';
import EnhancedProfileCard from '@/components/shared/EnhancedProfileCard';

interface ScoredProfile {
  profile: UserProfiles;
  score: number;
  matchedSkills: string[];
}

export default function FindTeammatesPage() {
  const [allProfiles, setAllProfiles] = useState<UserProfiles[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonials[]>([]);
  const [filteredProfiles, setFilteredProfiles] = useState<ScoredProfile[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [searching, setSearching] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    const [profilesRes, testimonialsRes] = await Promise.all([
      BaseCrudService.getAll<UserProfiles>('userprofiles'),
      BaseCrudService.getAll<Testimonials>('testimonials'),
    ]);
    setAllProfiles(profilesRes.items);
    setTestimonials(testimonialsRes.items);
    setLoading(false);
  };

  const calculateMatchScore = (profile: UserProfiles, keywords: string[]): { score: number; matched: string[] } => {
    if (keywords.length === 0) return { score: 0, matched: [] };

    const profileSkills = profile.skills?.toLowerCase().split(',').map(s => s.trim()) || [];
    const profileBio = profile.bio?.toLowerCase() || '';
    const profileRole = profile.preferredRole?.toLowerCase() || '';
    const profileCollege = profile.college?.toLowerCase() || '';
    const profileYear = profile.year?.toLowerCase() || '';
    const profileAchievements = profile.achievements?.toLowerCase() || '';

    let totalScore = 0;
    const matchedSkills: string[] = [];

    keywords.forEach(keyword => {
      const lowerKeyword = keyword.toLowerCase();

      // Exact skill match (highest weight)
      if (profileSkills.some(skill => skill.includes(lowerKeyword) || lowerKeyword.includes(skill))) {
        totalScore += 100;
        const matched = profileSkills.find(skill => skill.includes(lowerKeyword) || lowerKeyword.includes(skill));
        if (matched && !matchedSkills.includes(matched)) {
          matchedSkills.push(matched);
        }
      }
      // Role match
      else if (profileRole.includes(lowerKeyword)) {
        totalScore += 80;
      }
      // Bio match
      else if (profileBio.includes(lowerKeyword)) {
        totalScore += 60;
      }
      // College match
      else if (profileCollege.includes(lowerKeyword)) {
        totalScore += 40;
      }
      // Year match
      else if (profileYear.includes(lowerKeyword)) {
        totalScore += 40;
      }
      // Achievements match
      else if (profileAchievements.includes(lowerKeyword)) {
        totalScore += 50;
      }
    });

    // Normalize score to 0-100
    const normalizedScore = Math.min(totalScore, 100);
    return { score: normalizedScore, matched: matchedSkills };
  };

  const handleSearch = () => {
    if (!searchQuery.trim()) {
      setFilteredProfiles([]);
      return;
    }

    setSearching(true);
    const keywords = searchQuery
      .split(',')
      .map(k => k.trim())
      .filter(k => k.length > 0);

    const scored = allProfiles
      .map(profile => {
        const { score, matched } = calculateMatchScore(profile, keywords);
        return {
          profile,
          score,
          matchedSkills: matched,
        };
      })
      .filter(item => item.score > 0)
      .sort((a, b) => b.score - a.score);

    setFilteredProfiles(scored);
    setSearching(false);

    if (scored.length === 0) {
      toast({
        title: 'No matches found',
        description: 'Try different keywords or skills.',
      });
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handleInvite = (profileId: string, profileName: string) => {
    toast({
      title: 'Invitation sent!',
      description: `You've sent an invite to ${profileName}. They'll receive a notification.`,
    });
  };

  const getTestimonialForProfile = (profileId: string) => {
    return testimonials.find(t => t.authorName === allProfiles.find(p => p._id === profileId)?.fullName);
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
          <div className="text-center mb-8">
            <h1 className="font-heading font-bold text-5xl text-textprimary mb-4">
              Find Your Perfect Teammates
            </h1>
            <p className="font-paragraph text-lg text-textprimary/70 max-w-2xl mx-auto">
              Search by skills, interests, or expertise. Our smart matching algorithm finds the best teammates for your hackathon project.
            </p>
          </div>

          <div className="max-w-3xl mx-auto">
            <div className="flex gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-textprimary/40" />
                <Input
                  type="text"
                  placeholder="Search by skills (e.g., 'backend, React, Python') or interests..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="pl-12 h-14 bg-inputbackground border-inputborder rounded-full text-base"
                />
              </div>
              <Button
                onClick={handleSearch}
                disabled={searching || !searchQuery.trim()}
                className="bg-buttonbackground text-buttonforeground hover:bg-primary/90 h-14 px-8 rounded-full gap-2"
              >
                <Sparkles className="w-5 h-5" />
                <span className="hidden sm:inline">Search</span>
              </Button>
            </div>

            <p className="font-paragraph text-sm text-textprimary/60 mt-3 text-center">
              💡 Tip: Use commas to search for multiple skills (e.g., "backend, machine learning, leadership")
            </p>
          </div>
        </motion.div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="bg-cardbackground rounded-2xl p-6 h-96 animate-pulse" />
            ))}
          </div>
        ) : filteredProfiles.length === 0 && searchQuery ? (
          <div className="text-center py-20">
            <Sparkles className="w-16 h-16 text-primary/20 mx-auto mb-4" />
            <p className="font-paragraph text-lg text-textprimary/60 mb-2">
              No teammates found matching "{searchQuery}"
            </p>
            <p className="font-paragraph text-base text-textprimary/50">
              Try different keywords or browse all profiles
            </p>
          </div>
        ) : filteredProfiles.length > 0 ? (
          <div>
            <div className="mb-6 flex items-center justify-between">
              <h2 className="font-heading font-bold text-2xl text-textprimary">
                Found {filteredProfiles.length} match{filteredProfiles.length !== 1 ? 'es' : ''}
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProfiles.map((item, index) => (
                <motion.div
                  key={item.profile._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.05 }}
                >
                  <EnhancedProfileCard
                    profile={item.profile}
                    matchScore={item.score}
                    matchedSkills={item.matchedSkills}
                    testimonial={getTestimonialForProfile(item.profile._id)}
                    onInvite={() => handleInvite(item.profile._id, item.profile.fullName || 'User')}
                  />
                </motion.div>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center py-20">
            <Sparkles className="w-16 h-16 text-primary/20 mx-auto mb-4" />
            <p className="font-paragraph text-lg text-textprimary/60">
              Start searching to find amazing teammates
            </p>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}
