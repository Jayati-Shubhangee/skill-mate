import { useEffect, useState } from 'react';
import { useMember } from '@/integrations';
import { BaseCrudService } from '@/integrations';
import { UserProfiles } from '@/entities';
import NavBar from '@/components/layout/NavBar';
import Footer from '@/components/layout/Footer';
import { Image } from '@/components/ui/image';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import SkillTag from '@/components/shared/SkillTag';
import { Github, Mail, Edit, Save, X } from 'lucide-react';
import { motion } from 'framer-motion';
import { useToast } from '@/hooks/use-toast';

export default function ProfilePage() {
  const { member } = useMember();
  const [profile, setProfile] = useState<UserProfiles | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    fullName: '',
    bio: '',
    skills: '',
    githubUrl: '',
    availability: '',
    experienceLevel: '',
    preferredRole: '',
    college: '',
    year: '',
    hackathonParticipation: '',
    achievements: '',
  });

  useEffect(() => {
    loadProfile();
  }, [member]);

  const loadProfile = async () => {
    if (!member?.loginEmail) {
      setLoading(false);
      return;
    }

    setLoading(true);
    const { items } = await BaseCrudService.getAll<UserProfiles>('userprofiles');
    const userProfile = items.find(p => p._id === member.loginEmail);

    if (userProfile) {
      setProfile(userProfile);
      setFormData({
        fullName: userProfile.fullName || '',
        bio: userProfile.bio || '',
        skills: userProfile.skills || '',
        githubUrl: userProfile.githubUrl || '',
        availability: userProfile.availability || '',
        experienceLevel: userProfile.experienceLevel || '',
        preferredRole: userProfile.preferredRole || '',
      });
    } else {
      // Create new profile
      const newProfile: UserProfiles = {
        _id: member.loginEmail,
        fullName: member.contact?.firstName 
          ? `${member.contact.firstName} ${member.contact.lastName || ''}`.trim()
          : '',
      };
      await BaseCrudService.create('userprofiles', newProfile);
      setProfile(newProfile);
      setIsEditing(true);
    }
    setLoading(false);
  };

  const handleSave = async () => {
    if (!profile) return;

    setSaving(true);
    const updatedProfile: UserProfiles = {
      ...profile,
      ...formData,
    };

    await BaseCrudService.update('userprofiles', updatedProfile);
    setProfile(updatedProfile);
    setIsEditing(false);
    setSaving(false);

    toast({
      title: 'Success!',
      description: 'Your profile has been updated.',
    });
  };

  const handleCancel = () => {
    if (profile) {
      setFormData({
        fullName: profile.fullName || '',
        bio: profile.bio || '',
        skills: profile.skills || '',
        githubUrl: profile.githubUrl || '',
        availability: profile.availability || '',
        experienceLevel: profile.experienceLevel || '',
        preferredRole: profile.preferredRole || '',
      });
    }
    setIsEditing(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <NavBar />
        <div className="max-w-[100rem] mx-auto px-6 py-12">
          <div className="bg-cardbackground rounded-2xl p-8 h-96 animate-pulse" />
        </div>
      </div>
    );
  }

  const skills = profile?.skills?.split(',').map(s => s.trim()).filter(Boolean) || [];

  return (
    <div className="min-h-screen bg-background">
      <NavBar />

      <div className="max-w-[100rem] mx-auto px-6 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="bg-cardbackground rounded-2xl p-8">
            <div className="flex justify-between items-start mb-8">
              <h1 className="font-heading font-bold text-4xl text-textprimary">
                My Profile
              </h1>
              {!isEditing ? (
                <Button
                  onClick={() => setIsEditing(true)}
                  className="gap-2 bg-buttonbackground text-buttonforeground hover:bg-primary/90"
                >
                  <Edit className="w-4 h-4" />
                  Edit Profile
                </Button>
              ) : (
                <div className="flex gap-2">
                  <Button
                    onClick={handleSave}
                    disabled={saving}
                    className="gap-2 bg-buttonbackground text-buttonforeground hover:bg-primary/90"
                  >
                    <Save className="w-4 h-4" />
                    {saving ? 'Saving...' : 'Save'}
                  </Button>
                  <Button
                    onClick={handleCancel}
                    variant="outline"
                    className="gap-2"
                  >
                    <X className="w-4 h-4" />
                    Cancel
                  </Button>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-1">
                <div className="text-center">
                  {profile?.profilePicture ? (
                    <Image
                      src={profile.profilePicture}
                      alt={profile.fullName || 'Profile'}
                      className="w-40 h-40 rounded-full object-cover mx-auto mb-4"
                      width={160}
                    />
                  ) : (
                    <div className="w-40 h-40 rounded-full bg-primary flex items-center justify-center mx-auto mb-4">
                      <span className="text-white font-heading font-bold text-5xl">
                        {profile?.fullName?.charAt(0) || member?.profile?.nickname?.charAt(0) || 'U'}
                      </span>
                    </div>
                  )}
                  {!isEditing && (
                    <>
                      <h2 className="font-heading font-bold text-2xl text-textprimary mb-2">
                        {profile?.fullName || 'Anonymous User'}
                      </h2>
                      <p className="font-paragraph text-base text-textprimary/70 mb-4">
                        {profile?.preferredRole || 'Team Member'}
                      </p>
                    </>
                  )}
                </div>
              </div>

              <div className="lg:col-span-2 space-y-6">
                {isEditing ? (
                  <>
                    <div>
                      <Label htmlFor="fullName" className="font-paragraph text-sm font-semibold text-textprimary mb-2 block">
                        Full Name
                      </Label>
                      <Input
                        id="fullName"
                        value={formData.fullName}
                        onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                        className="bg-inputbackground border-inputborder"
                      />
                    </div>

                    <div>
                      <Label htmlFor="preferredRole" className="font-paragraph text-sm font-semibold text-textprimary mb-2 block">
                        Preferred Role
                      </Label>
                      <Input
                        id="preferredRole"
                        value={formData.preferredRole}
                        onChange={(e) => setFormData({ ...formData, preferredRole: e.target.value })}
                        placeholder="e.g., Full Stack Developer, UI/UX Designer"
                        className="bg-inputbackground border-inputborder"
                      />
                    </div>

                    <div>
                      <Label htmlFor="bio" className="font-paragraph text-sm font-semibold text-textprimary mb-2 block">
                        Bio
                      </Label>
                      <Textarea
                        id="bio"
                        value={formData.bio}
                        onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                        rows={4}
                        placeholder="Tell us about yourself..."
                        className="bg-inputbackground border-inputborder"
                      />
                    </div>

                    <div>
                      <Label htmlFor="skills" className="font-paragraph text-sm font-semibold text-textprimary mb-2 block">
                        Skills (comma-separated)
                      </Label>
                      <Input
                        id="skills"
                        value={formData.skills}
                        onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
                        placeholder="React, Node.js, Python, UI Design"
                        className="bg-inputbackground border-inputborder"
                      />
                    </div>

                    <div>
                      <Label htmlFor="experienceLevel" className="font-paragraph text-sm font-semibold text-textprimary mb-2 block">
                        Experience Level
                      </Label>
                      <Input
                        id="experienceLevel"
                        value={formData.experienceLevel}
                        onChange={(e) => setFormData({ ...formData, experienceLevel: e.target.value })}
                        placeholder="e.g., Beginner, Intermediate, Advanced, Expert"
                        className="bg-inputbackground border-inputborder"
                      />
                    </div>

                    <div>
                      <Label htmlFor="availability" className="font-paragraph text-sm font-semibold text-textprimary mb-2 block">
                        Availability
                      </Label>
                      <Input
                        id="availability"
                        value={formData.availability}
                        onChange={(e) => setFormData({ ...formData, availability: e.target.value })}
                        placeholder="e.g., Full-time, Part-time, Weekends"
                        className="bg-inputbackground border-inputborder"
                      />
                    </div>

                    <div>
                      <Label htmlFor="githubUrl" className="font-paragraph text-sm font-semibold text-textprimary mb-2 block">
                        GitHub URL
                      </Label>
                      <Input
                        id="githubUrl"
                        value={formData.githubUrl}
                        onChange={(e) => setFormData({ ...formData, githubUrl: e.target.value })}
                        placeholder="https://github.com/username"
                        className="bg-inputbackground border-inputborder"
                      />
                    </div>

                    <div>
                      <Label htmlFor="college" className="font-paragraph text-sm font-semibold text-textprimary mb-2 block">
                        College/University
                      </Label>
                      <Input
                        id="college"
                        value={formData.college}
                        onChange={(e) => setFormData({ ...formData, college: e.target.value })}
                        placeholder="e.g., MIT, Stanford University"
                        className="bg-inputbackground border-inputborder"
                      />
                    </div>

                    <div>
                      <Label htmlFor="year" className="font-paragraph text-sm font-semibold text-textprimary mb-2 block">
                        Year of Study
                      </Label>
                      <Input
                        id="year"
                        value={formData.year}
                        onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                        placeholder="e.g., 2nd Year, Junior, Senior"
                        className="bg-inputbackground border-inputborder"
                      />
                    </div>

                    <div>
                      <Label htmlFor="hackathonParticipation" className="font-paragraph text-sm font-semibold text-textprimary mb-2 block">
                        Hackathon Participation
                      </Label>
                      <Input
                        id="hackathonParticipation"
                        value={formData.hackathonParticipation}
                        onChange={(e) => setFormData({ ...formData, hackathonParticipation: e.target.value })}
                        placeholder="e.g., HackMIT 2023, TechCrunch Disrupt 2024"
                        className="bg-inputbackground border-inputborder"
                      />
                    </div>

                    <div>
                      <Label htmlFor="achievements" className="font-paragraph text-sm font-semibold text-textprimary mb-2 block">
                        Achievements & Awards
                      </Label>
                      <Input
                        id="achievements"
                        value={formData.achievements}
                        onChange={(e) => setFormData({ ...formData, achievements: e.target.value })}
                        placeholder="e.g., Best AI Project, Finalist at HackMIT"
                        className="bg-inputbackground border-inputborder"
                      />
                    </div>
                  </>
                ) : (
                  <>
                    {profile?.bio && (
                      <div>
                        <h3 className="font-heading font-semibold text-lg text-textprimary mb-2">
                          About
                        </h3>
                        <p className="font-paragraph text-base text-textprimary/80">
                          {profile.bio}
                        </p>
                      </div>
                    )}

                    {skills.length > 0 && (
                      <div>
                        <h3 className="font-heading font-semibold text-lg text-textprimary mb-3">
                          Skills
                        </h3>
                        <div className="flex flex-wrap gap-2">
                          {skills.map((skill, index) => (
                            <SkillTag key={index} skill={skill} />
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {profile?.experienceLevel && (
                        <div className="bg-background rounded-xl p-4">
                          <p className="font-paragraph text-sm text-textprimary/60 mb-1">
                            Experience Level
                          </p>
                          <p className="font-heading font-semibold text-base text-textprimary">
                            {profile.experienceLevel}
                          </p>
                        </div>
                      )}

                      {profile?.availability && (
                        <div className="bg-background rounded-xl p-4">
                          <p className="font-paragraph text-sm text-textprimary/60 mb-1">
                            Availability
                          </p>
                          <p className="font-heading font-semibold text-base text-textprimary">
                            {profile.availability}
                          </p>
                        </div>
                      )}

                      {profile?.college && (
                        <div className="bg-background rounded-xl p-4">
                          <p className="font-paragraph text-sm text-textprimary/60 mb-1">
                            College
                          </p>
                          <p className="font-heading font-semibold text-base text-textprimary">
                            {profile.college}
                          </p>
                        </div>
                      )}

                      {profile?.year && (
                        <div className="bg-background rounded-xl p-4">
                          <p className="font-paragraph text-sm text-textprimary/60 mb-1">
                            Year of Study
                          </p>
                          <p className="font-heading font-semibold text-base text-textprimary">
                            {profile.year}
                          </p>
                        </div>
                      )}
                    </div>

                    {profile?.hackathonParticipation && (
                      <div className="bg-background rounded-xl p-4">
                        <p className="font-paragraph text-sm text-textprimary/60 mb-2">
                          Hackathon Participation
                        </p>
                        <p className="font-paragraph text-base text-textprimary">
                          {profile.hackathonParticipation}
                        </p>
                      </div>
                    )}

                    {profile?.achievements && (
                      <div className="bg-background rounded-xl p-4">
                        <p className="font-paragraph text-sm text-textprimary/60 mb-2">
                          Achievements & Awards
                        </p>
                        <p className="font-paragraph text-base text-textprimary">
                          {profile.achievements}
                        </p>
                      </div>
                    )}

                    {profile?.githubUrl && (
                      <div>
                        <Button
                          onClick={() => window.open(profile.githubUrl, '_blank')}
                          variant="outline"
                          className="gap-2"
                        >
                          <Github className="w-4 h-4" />
                          View GitHub Profile
                        </Button>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      <Footer />
    </div>
  );
}
