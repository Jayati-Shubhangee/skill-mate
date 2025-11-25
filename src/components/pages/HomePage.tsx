import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Image } from '@/components/ui/image';
import NavBar from '@/components/layout/NavBar';
import Footer from '@/components/layout/Footer';
import { Testimonials } from '@/entities';
import { BaseCrudService } from '@/integrations';
import { Users, Target, Sparkles, Star, ArrowRight } from 'lucide-react';

export default function HomePage() {
  const [testimonials, setTestimonials] = useState<Testimonials[]>([]);

  useEffect(() => {
    loadTestimonials();
  }, []);

  const loadTestimonials = async () => {
    const { items } = await BaseCrudService.getAll<Testimonials>('testimonials');
    setTestimonials(items.slice(0, 3));
  };

  return (
    <div className="min-h-screen bg-background">
      <NavBar />

      {/* Hero Section - Full Bleed */}
      <section className="w-full max-w-[120rem] mx-auto px-6 pt-20 pb-32 relative overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="font-heading font-bold text-6xl lg:text-7xl text-textprimary mb-6">
              Build your dream team{' '}
              <span className="text-primary">for any hackathon</span>
            </h1>
            <p className="font-paragraph text-lg text-textprimary/70 mb-8 max-w-xl">
              Discover talented developers, designers, and innovators. Match with the perfect teammates 
              using AI-powered recommendations based on skills, availability, and experience.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to="/find-teammates">
                <Button size="lg" className="bg-buttonbackground text-buttonforeground hover:bg-primary/90 h-14 px-8 rounded-full">
                  Find Teammates
                </Button>
              </Link>
              <Link to="/explore">
                <Button size="lg" variant="outline" className="h-14 px-8 rounded-full">
                  Explore Projects
                </Button>
              </Link>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative"
          >
            <div className="bg-gradient-to-br from-primary/20 via-secondary to-primary/10 rounded-3xl p-8 backdrop-blur-sm">
              <div className="bg-background rounded-2xl p-6 shadow-lg">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center">
                    <Sparkles className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="font-heading font-semibold text-lg text-textprimary">
                      AI-Powered Matching
                    </p>
                    <p className="font-paragraph text-sm text-textprimary/60">
                      Find your perfect teammates instantly
                    </p>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-secondary rounded-xl">
                    <span className="font-paragraph text-sm text-textprimary/70">Skill Match</span>
                    <span className="font-heading font-bold text-primary">95%</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-secondary rounded-xl">
                    <span className="font-paragraph text-sm text-textprimary/70">Availability</span>
                    <span className="font-heading font-bold text-primary">88%</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-secondary rounded-xl">
                    <span className="font-paragraph text-sm text-textprimary/70">Experience</span>
                    <span className="font-heading font-bold text-primary">92%</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="w-full bg-secondary py-20">
        <div className="max-w-[100rem] mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="font-heading font-bold text-4xl text-textprimary mb-4">
              Everything you need to succeed
            </h2>
            <p className="font-paragraph text-lg text-textprimary/70 max-w-2xl mx-auto">
              SkillMate provides powerful tools to help you find, connect, and collaborate with the best talent.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="bg-cardbackground rounded-2xl p-8"
            >
              <div className="w-14 h-14 bg-primary rounded-2xl flex items-center justify-center mb-6">
                <Users className="w-7 h-7 text-white" />
              </div>
              <h3 className="font-heading font-bold text-xl text-textprimary mb-3">
                Smart Team Matching
              </h3>
              <p className="font-paragraph text-base text-textprimary/70">
                Our AI analyzes skills, experience, and availability to suggest the most compatible teammates for your project.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="bg-cardbackground rounded-2xl p-8"
            >
              <div className="w-14 h-14 bg-primary rounded-2xl flex items-center justify-center mb-6">
                <Target className="w-7 h-7 text-white" />
              </div>
              <h3 className="font-heading font-bold text-xl text-textprimary mb-3">
                Project Discovery
              </h3>
              <p className="font-paragraph text-base text-textprimary/70">
                Browse exciting hackathon projects and find opportunities that match your interests and expertise.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="bg-cardbackground rounded-2xl p-8"
            >
              <div className="w-14 h-14 bg-primary rounded-2xl flex items-center justify-center mb-6">
                <Sparkles className="w-7 h-7 text-white" />
              </div>
              <h3 className="font-heading font-bold text-xl text-textprimary mb-3">
                Skill-Based Recommendations
              </h3>
              <p className="font-paragraph text-base text-textprimary/70">
                Get personalized suggestions based on your unique skill set and the requirements of each project.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      {testimonials.length > 0 && (
        <section className="w-full py-20">
          <div className="max-w-[100rem] mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="font-heading font-bold text-4xl text-textprimary mb-4">
                What our users say
              </h2>
              <p className="font-paragraph text-lg text-textprimary/70">
                Join thousands of developers who found their perfect team
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {testimonials.map((testimonial, index) => (
                <motion.div
                  key={testimonial._id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="bg-cardbackground rounded-2xl p-6"
                >
                  <div className="flex gap-1 mb-4">
                    {[...Array(testimonial.rating || 5)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 fill-primary text-primary" />
                    ))}
                  </div>
                  <p className="font-paragraph text-base text-textprimary/80 mb-6">
                    "{testimonial.testimonialText}"
                  </p>
                  <div className="flex items-center gap-3">
                    {testimonial.authorAvatar ? (
                      <Image
                        src={testimonial.authorAvatar}
                        alt={testimonial.authorName || 'User'}
                        className="w-12 h-12 rounded-full object-cover"
                        width={48}
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center">
                        <span className="text-white font-heading font-bold">
                          {testimonial.authorName?.charAt(0) || 'U'}
                        </span>
                      </div>
                    )}
                    <div>
                      <p className="font-heading font-semibold text-base text-textprimary">
                        {testimonial.authorName}
                      </p>
                      <p className="font-paragraph text-sm text-textprimary/60">
                        {testimonial.authorRole}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="w-full bg-primary py-20">
        <div className="max-w-[100rem] mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="font-heading font-bold text-4xl text-white mb-6">
              Ready to find your perfect team?
            </h2>
            <p className="font-paragraph text-lg text-white/90 mb-8 max-w-2xl mx-auto">
              Join SkillMate today and connect with talented individuals who share your passion for innovation.
            </p>
            <Link to="/find-teammates">
              <Button 
                size="lg" 
                className="bg-white text-primary hover:bg-white/90 h-14 px-8 rounded-full gap-2"
              >
                Start Finding Teammates
                <ArrowRight className="w-5 h-5" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
