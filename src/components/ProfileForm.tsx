import React from 'react';
import InputField from "./InputField";
import TextAreaField from "./TextAreaField";
import {
  FaMapMarkerAlt, FaBriefcase, FaGraduationCap, FaLink,
  FaImage, FaLaptopCode, FaStar, FaQuoteLeft, FaGlobe, FaGithub, FaLinkedin
} from 'react-icons/fa';

interface ProfileFormProps {
  form: any; // Use a more specific type if necessary
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  cardClasses: string;
}

const iconClasses = "text-orange-400 mr-3";
const sectionTitleClasses = "text-2xl font-semibold mb-6 border-b-2 pb-2 border-orange-500/50 flex items-center";

const ProfileForm: React.FC<ProfileFormProps> = ({ form, handleChange, cardClasses }) => (
  <>
    {/* 1. Personal Information */}
    <div className={cardClasses}>
      <h2 className={sectionTitleClasses}>
        <FaStar className={iconClasses} /> Personal Identity
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <InputField name="fullName" value={form.fullName} onChange={handleChange} placeholder="Your Full Name" label="Full Name" icon={FaStar} required />
        <InputField name="location" value={form.location} onChange={handleChange} placeholder="City, Country" label="Location" icon={FaMapMarkerAlt} />
        <div className="md:col-span-2">
          <InputField name="profilePic" value={form.profilePic} onChange={handleChange} placeholder="Profile Picture URL" label="Profile Picture URL" icon={FaImage} />
        </div>
      </div>
    </div>

    {/* 2. Professional Summary */}
    <div className={cardClasses}>
      <h2 className={sectionTitleClasses}>
        <FaQuoteLeft className={iconClasses} /> Professional Summary
      </h2>
      <div className="space-y-4">
        <InputField name="headline" value={form.headline} onChange={handleChange} placeholder="e.g., Senior Full-Stack Developer" label="Headline" icon={FaBriefcase} />
        <TextAreaField name="bio" value={form.bio} onChange={handleChange} placeholder="A compelling, short summary." label="Bio" rows={4} icon={FaQuoteLeft} />
        <InputField name="yearsExperience" value={form.yearsExperience} onChange={handleChange} placeholder="5" label="Years of Experience" type="number" icon={FaStar} />
      </div>
    </div>

    {/* 3. Skills and Expertise */}
    <div className={cardClasses}>
      <h2 className={sectionTitleClasses}>
        <FaLaptopCode className={iconClasses} /> Skills & Tech Stack
      </h2>
      <InputField name="skills" value={form.skills} onChange={handleChange} placeholder="Comma separated skills (e.g., React, Node.js)" label="Core Skills" icon={FaLaptopCode} />
    </div>

    {/* 4. Background (Experience & Education) */}
    <div className={cardClasses}>
      <h2 className={sectionTitleClasses}>
        <FaBriefcase className={iconClasses} /> Background
      </h2>
      <div className="space-y-4">
        <TextAreaField name="experience" value={form.experience} onChange={handleChange} placeholder="List your key roles, responsibilities, and achievements." label="Work Experience" rows={5} icon={FaBriefcase} />
        <TextAreaField name="education" value={form.education} onChange={handleChange} placeholder="Degrees, certifications, and institutions." label="Education History" rows={4} icon={FaGraduationCap} />
      </div>
    </div>

    {/* 5. Social Links */}
    <div className={cardClasses}>
      <h2 className={sectionTitleClasses}>
        <FaLink className={iconClasses} /> Social Links
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <InputField name="website" value={form.website} onChange={handleChange} placeholder="Personal Website/Portfolio URL" label="Website" icon={FaGlobe} />
        <InputField name="linkedin" value={form.linkedin} onChange={handleChange} placeholder="LinkedIn Profile URL" label="LinkedIn" icon={FaLinkedin} />
        <InputField name="github" value={form.github} onChange={handleChange} placeholder="GitHub Profile URL" label="GitHub" icon={FaGithub} />
      </div>
    </div>
  </>
);

export default ProfileForm;