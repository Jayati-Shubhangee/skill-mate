import { Link } from 'react-router-dom';
import { Github, Linkedin, Twitter } from 'lucide-react';
import { Image } from '@/components/ui/image';

export default function Footer() {
  return (
    <footer className="w-full bg-secondary border-t border-inputborder mt-20">
      <div className="max-w-[120rem] mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <Image
                src="https://static.wixstatic.com/media/cd3b9f_9f9bb44bdc034898a3bf152ac3ec0600~mv2.png?id=skillmate-logo-footer"
                alt="SkillMate Logo"
                className="w-10 h-10"
                width={40}
              />
              <span className="font-heading font-bold text-2xl text-textprimary">SkillMate</span>
            </div>
            <p className="font-paragraph text-base text-textprimary/70 max-w-md">
              Empowering hackathon teams to find the perfect match. Connect with talented individuals, 
              build amazing projects, and bring your ideas to life.
            </p>
          </div>

          <div>
            <h3 className="font-heading font-semibold text-lg text-textprimary mb-4">Quick Links</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/find-teammates" className="font-paragraph text-base text-textprimary/70 hover:text-primary transition-colors">
                  Find Teammates
                </Link>
              </li>
              <li>
                <Link to="/explore" className="font-paragraph text-base text-textprimary/70 hover:text-primary transition-colors">
                  Explore Projects
                </Link>
              </li>
              <li>
                <Link to="/teams" className="font-paragraph text-base text-textprimary/70 hover:text-primary transition-colors">
                  Browse Teams
                </Link>
              </li>
              <li>
                <Link to="/create-project" className="font-paragraph text-base text-textprimary/70 hover:text-primary transition-colors">
                  Create Project
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-heading font-semibold text-lg text-textprimary mb-4">Connect</h3>
            <div className="flex gap-4">
              <a 
                href="https://github.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-10 h-10 bg-background rounded-full flex items-center justify-center hover:bg-primary hover:text-white transition-colors"
              >
                <Github className="w-5 h-5" />
              </a>
              <a 
                href="https://linkedin.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-10 h-10 bg-background rounded-full flex items-center justify-center hover:bg-primary hover:text-white transition-colors"
              >
                <Linkedin className="w-5 h-5" />
              </a>
              <a 
                href="https://twitter.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-10 h-10 bg-background rounded-full flex items-center justify-center hover:bg-primary hover:text-white transition-colors"
              >
                <Twitter className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-inputborder mt-12 pt-8 text-center">
          <p className="font-paragraph text-sm text-textprimary/60">
            © {new Date().getFullYear()} SkillMate. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
