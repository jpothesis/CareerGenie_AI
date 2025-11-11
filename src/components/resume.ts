// src/types/resume.ts

export type Experience = { 
  id: string; 
  role: string; 
  company: string; 
  duration: string; 
  description: string; 
};
export type Education = { 
  id: string; 
  degree: string; 
  institution: string; 
  year: string; 
  gpa?: string; 
};
export type Project = { 
  id: string; 
  title: string; 
  description: string; 
  techStack: string[]; 
  link: string; 
};
export type Certification = { 
  id: string; 
  title: string; 
  issuer: string; 
  date: string; 
};

export type ResumeData = { 
  // Personal & Summary
  name: string; 
  email: string; 
  phone: string; 
  location: string; 
  jobTitle: string; 
  summary: string; 
  
  // Skills
  skills: string[]; 
  
  // Work Experience
  experience: Experience[]; 
  
  // Education
  education: Education[]; 
  
  // Projects
  projects: Project[]; 
  
  // Certifications & Languages
  certifications: Certification[]; 
  languages: string[]; 
};