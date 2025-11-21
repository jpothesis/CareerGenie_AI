import React from 'react';
import { FaMapMarkerAlt, FaStar, FaLaptopCode } from 'react-icons/fa';

interface ProfilePreviewProps {
  form: any; // Use a more specific type if necessary
  cardClasses: string;
}

const ProfilePreview: React.FC<ProfilePreviewProps> = ({ form, cardClasses }) => (
  <div className={`${cardClasses} space-y-4 text-center mt-8 md:mt-0 transform translate-y-0 duration-1000 animate-fade-in-down`}>
    <img
      src={form.profilePic}
      alt={`${form.fullName}'s Profile`}
      className="w-32 h-32 rounded-full mx-auto object-cover border-4 border-orange-500 shadow-2xl"
    />
    <h2 className="text-3xl font-extrabold text-white">{form.fullName || "Your Name"}</h2>
    <p className="text-orange-400 text-lg italic">{form.headline || "Professional Headline"}</p>
    <div className="text-gray-400">
      <FaMapMarkerAlt className="inline mr-1" />
      {form.location || "Location"}
    </div>

    <div className="pt-4 border-t border-orange-500/30">
      <h3 className="text-xl font-semibold mb-2 text-yellow-400">Quick Stats</h3>
      <div className="flex justify-around text-white">
        <div className="text-center">
          <FaStar className="mx-auto text-yellow-500" />
          <p className="text-lg font-bold">{form.yearsExperience || 0}</p>
          <p className="text-xs text-gray-400">Yrs Exp.</p>
        </div>
        <div className="text-center">
          <FaLaptopCode className="mx-auto text-blue-500" />
          
<p className="text-lg font-bold">{form.skills.split(',').filter((s: string) => s.trim()).length}</p>
          <p className="text-xs text-gray-400">Skills</p>
        </div>
      </div>
    </div>
  </div>
);

export default ProfilePreview;