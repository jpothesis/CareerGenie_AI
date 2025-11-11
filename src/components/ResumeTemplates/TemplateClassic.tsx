import React from 'react';
import type { ResumeData } from '../resume';


const TemplateProfessional: React.FC<{ data: ResumeData }> = ({ data }) => (
  <div className="bg-white text-gray-800 p-8 shadow-2xl font-serif max-w-2xl mx-auto min-h-[11in]">
    
    {/* Header & Contact Info */}
    <header className="text-center pb-4 mb-4 border-b-4 border-gray-800">
      <h1 className="text-3xl font-bold text-gray-800 uppercase">{data.name || "Your Name"}</h1>
      <p className="text-lg font-medium text-gray-600 mt-1">{data.jobTitle || "Job Title"}</p>
      <div className="text-sm text-gray-500 mt-2 flex justify-center space-x-4">
        {data.email && <span>{data.email}</span>}
        {data.phone && <span>| {data.phone}</span>}
        {data.location && <span>| {data.location}</span>}
      </div>
    </header>

    {/* Summary */}
    {data.summary && (
      <section className="mb-4">
        <h2 className="text-base font-bold text-gray-700 border-b border-gray-400 pb-1 mb-2">PROFILE</h2>
        <p className="text-sm leading-relaxed">{data.summary}</p>
      </section>
    )}

    {/* Experience */}
    {data.experience.length > 0 && (
      <section>
        <h2 className="text-base font-bold text-gray-700 border-b border-gray-400 pb-1 mb-2">PROFESSIONAL EXPERIENCE</h2>
        {data.experience.map((exp) => (
          <div key={exp.id} className="mb-3 text-sm">
            <div className="flex justify-between">
              <p className="font-bold text-gray-800">{exp.role}</p>
              <p className="text-gray-600">{exp.duration}</p>
            </div>
            <p className="italic text-xs mb-1">{exp.company}</p>
            <p className="text-xs whitespace-pre-wrap">{exp.description}</p>
          </div>
        ))}
      </section>
    )}

    {/* Education & Skills */}
    <div className="flex mt-4 space-x-6">
      <div className="w-1/2">
        {data.education.length > 0 && (
          <section className="mb-4">
            <h2 className="text-base font-bold text-gray-700 border-b border-gray-400 pb-1 mb-2">EDUCATION</h2>
            {data.education.map((edu) => (
              <div key={edu.id} className="mb-2 text-sm">
                <p className="font-semibold text-gray-700">{edu.degree}</p>
                <div className="flex justify-between text-xs text-gray-600">
                  <p>{edu.institution}</p>
                  <p>{edu.year}</p>
                </div>
              </div>
            ))}
          </section>
        )}
      </div>

      <div className="w-1/2">
        {data.skills.length > 0 && (
          <section className="mb-4">
            <h2 className="text-base font-bold text-gray-700 border-b border-gray-400 pb-1 mb-2">KEY SKILLS</h2>
            <ul className="list-disc ml-4 text-sm text-gray-700">
              {data.skills.slice(0, 5).map((skill, index) => (
                <li key={index}>{skill}</li>
              ))}
              {data.skills.length > 5 && (
                <li className="text-xs text-gray-500">
                  ...and {data.skills.length - 5} more.
                </li>
              )}
            </ul>
          </section>
        )}
      </div>
    </div>

    {/* Projects */}
    {data.projects.length > 0 && (
      <section className="mt-4">
        <h2 className="text-base font-bold text-gray-700 border-b border-gray-400 pb-1 mb-2">PROJECTS</h2>
        {data.projects.map((proj) => (
          <div key={proj.id} className="mb-3 text-sm">
            <div className="flex justify-between">
              <p className="font-bold text-gray-800">{proj.title}</p>
              <p className="text-xs text-gray-600">{proj.techStack.join(', ')}</p>
            </div>
            <p className="text-xs mt-1 whitespace-pre-wrap">{proj.description}</p>
          </div>
        ))}
      </section>
    )}
  </div>
);

export default TemplateProfessional;
