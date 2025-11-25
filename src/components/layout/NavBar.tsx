import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useMember } from '@/integrations';
import { User, LogOut } from 'lucide-react';

export default function NavBar() {
  const location = useLocation();
  const { member, isAuthenticated, isLoading, actions } = useMember();

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="w-full bg-background border-b border-inputborder sticky top-0 z-50">
      <nav className="max-w-[120rem] mx-auto px-6 py-4 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
            <span className="text-white font-heading font-bold text-lg">S</span>
          </div>
          <span className="font-heading font-bold text-xl text-textprimary">SkillMate</span>
        </Link>

        <div className="hidden md:flex items-center gap-8">
          <Link 
            to="/" 
            className={`font-paragraph text-base transition-colors ${
              isActive('/') ? 'text-primary font-semibold' : 'text-textprimary hover:text-primary'
            }`}
          >
            Home
          </Link>
          <Link 
            to="/explore" 
            className={`font-paragraph text-base transition-colors ${
              isActive('/explore') ? 'text-primary font-semibold' : 'text-textprimary hover:text-primary'
            }`}
          >
            Explore
          </Link>
          <Link 
            to="/teams" 
            className={`font-paragraph text-base transition-colors ${
              isActive('/teams') ? 'text-primary font-semibold' : 'text-textprimary hover:text-primary'
            }`}
          >
            Teams
          </Link>
          {isAuthenticated && (
            <Link 
              to="/create-project" 
              className={`font-paragraph text-base transition-colors ${
                isActive('/create-project') ? 'text-primary font-semibold' : 'text-textprimary hover:text-primary'
              }`}
            >
              Create Project
            </Link>
          )}
        </div>

        <div className="flex items-center gap-3">
          {isLoading ? (
            <div className="w-20 h-10 bg-secondary animate-pulse rounded-full"></div>
          ) : isAuthenticated ? (
            <>
              <Link to="/profile">
                <Button variant="ghost" size="sm" className="gap-2">
                  <User className="w-4 h-4" />
                  <span className="hidden sm:inline">{member?.profile?.nickname || 'Profile'}</span>
                </Button>
              </Link>
              <Button 
                onClick={actions.logout} 
                variant="outline" 
                size="sm"
                className="gap-2"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">Sign Out</span>
              </Button>
            </>
          ) : (
            <>
              <Button onClick={actions.login} variant="outline" size="sm">
                Log In
              </Button>
              <Button onClick={actions.login} size="sm" className="bg-buttonbackground text-buttonforeground hover:bg-primary/90">
                Sign Up
              </Button>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}
