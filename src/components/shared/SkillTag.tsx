interface SkillTagProps {
  skill: string;
  variant?: 'default' | 'primary' | 'outline';
  size?: 'sm' | 'md';
}

export default function SkillTag({ skill, variant = 'default', size = 'md' }: SkillTagProps) {
  const baseClasses = 'font-paragraph rounded-full inline-flex items-center justify-center transition-colors';
  
  const sizeClasses = {
    sm: 'px-3 py-1 text-xs',
    md: 'px-4 py-2 text-sm',
  };

  const variantClasses = {
    default: 'bg-secondary text-textprimary',
    primary: 'bg-primary text-primary-foreground',
    outline: 'border border-inputborder bg-background text-textprimary',
  };

  return (
    <span className={`${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]}`}>
      {skill}
    </span>
  );
}
