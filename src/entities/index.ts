/**
 * Auto-generated entity types
 * Contains all CMS collection interfaces in a single file 
 */

/**
 * Collection ID: projects
 * Interface for Projects
 */
export interface Projects {
  _id: string;
  _createdDate?: Date;
  _updatedDate?: Date;
  /** @wixFieldType text */
  projectName?: string;
  /** @wixFieldType text */
  projectDescription?: string;
  /** @wixFieldType text */
  projectGoals?: string;
  /** @wixFieldType text */
  requiredSkills?: string;
  /** @wixFieldType image */
  projectImage?: string;
  /** @wixFieldType datetime */
  submissionDate?: Date | string;
  /** @wixFieldType text */
  hackathonName?: string;
  /** @wixFieldType text */
  projectStatus?: string;
  /** @wixFieldType text */
  roleNeeded?: string;
  /** @wixFieldType number */
  teamSize?: number;
  /** @wixFieldType text */
  timeCommitment?: string;
}


/**
 * Collection ID: teams
 * Interface for Teams
 */
export interface Teams {
  _id: string;
  _createdDate?: Date;
  _updatedDate?: Date;
  /** @wixFieldType text */
  teamName?: string;
  /** @wixFieldType text */
  description?: string;
  /** @wixFieldType image */
  teamLogo?: string;
  /** @wixFieldType text */
  goal?: string;
  /** @wixFieldType boolean */
  lookingForMembers?: boolean;
  /** @wixFieldType text */
  skillsNeededDescription?: string;
  /** @wixFieldType number */
  currentTeamSize?: number;
  /** @wixFieldType number */
  maximumTeamSize?: number;
}


/**
 * Collection ID: testimonials
 * Interface for Testimonials
 */
export interface Testimonials {
  _id: string;
  _createdDate?: Date;
  _updatedDate?: Date;
  /** @wixFieldType text */
  testimonialText?: string;
  /** @wixFieldType text */
  authorName?: string;
  /** @wixFieldType text */
  authorRole?: string;
  /** @wixFieldType number */
  rating?: number;
  /** @wixFieldType datetime */
  submissionDate?: Date | string;
  /** @wixFieldType image */
  authorAvatar?: string;
}


/**
 * Collection ID: userprofiles
 * Interface for UserProfiles
 */
export interface UserProfiles {
  _id: string;
  _createdDate?: Date;
  _updatedDate?: Date;
  /** @wixFieldType text */
  hackathonParticipation?: string;
  /** @wixFieldType text */
  achievements?: string;
  /** @wixFieldType text */
  fullName?: string;
  /** @wixFieldType text */
  year?: string;
  /** @wixFieldType text */
  college?: string;
  /** @wixFieldType image */
  profilePicture?: string;
  /** @wixFieldType text */
  bio?: string;
  /** @wixFieldType text */
  skills?: string;
  /** @wixFieldType url */
  githubUrl?: string;
  /** @wixFieldType text */
  availability?: string;
  /** @wixFieldType text */
  experienceLevel?: string;
  /** @wixFieldType text */
  preferredRole?: string;
}
