import React from 'react';
import type { ResumeData } from '../resume'; // ✅ type-only import (fixes TS1484)

const TemplateMinimal: React.FC<{ data: ResumeData }> = ({ data }) => (
  <div className="bg-white text-gray-800 p-8 shadow-2xl font-sans max-w-2xl mx-auto min-h-[11in]">
    
    {/* Header & Contact Info */}
    <header className="text-center pb-3 mb-4 border-b border-gray-400">
      <h1 className="text-3xl font-bold text-gray-800 uppercase">{data.name || "Your Name"}</h1>
      <p className="text-lg text-gray-600 mt-1">{data.jobTitle || "Job Title"}</p>
      <div className="text-sm text-gray-500 mt-2 flex justify-center space-x-3">
        {data.email && <span>{data.email}</span>}
        {data.phone && <span>| {data.phone}</span>}
        {data.location && <span>| {data.location}</span>}
      </div>
    </header>

    {/* Summary */}
    {data.summary && (
      <section className="mb-4">
        <h2 className="text-base font-bold text-gray-700 mb-1">PROFILE</h2>
        <p className="text-sm leading-relaxed border-t border-gray-300 pt-1">{data.summary}</p>
      </section>
    )}
    
    {/* Experience */}
    {data.experience.length > 0 && (
      <section className="mb-4">
        <h2 className="text-base font-bold text-gray-700 border-b border-gray-400 pb-1 mb-2">EXPERIENCE</h2>
        {data.experience.map((exp) => (
          <div key={exp.id} className="mb-3 text-sm">
            <div className="flex justify-between font-semibold">
              <p className="text-gray-800">{exp.role}, {exp.company}</p>
              <p className="text-gray-500 italic">{exp.duration}</p>
            </div>
            <p className="text-xs mt-1 whitespace-pre-wrap">{exp.description}</p>
          </div>
        ))}
      </section>
    )}

    {/* Education and Skills */}
    <div className="flex mt-4 space-x-6">
      <div className="w-1/2">
        {/* Education */}
        {data.education.length > 0 && (
          <section className="mb-4">
            <h2 className="text-base font-bold text-gray-700 border-b border-gray-400 pb-1 mb-2">EDUCATION</h2>
            {data.education.map((edu) => (
              <div key={edu.id} className="mb-2 text-sm">
                <p className="font-semibold text-gray-800">{edu.degree}</p>
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
        {/* Skills */}
        {data.skills.length > 0 && (
          <section className="mb-4">
            <h2 className="text-base font-bold text-gray-700 border-b border-gray-400 pb-1 mb-2">SKILLS</h2>
            <p className="text-sm text-gray-700">{data.skills.join(" • ")}</p>
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
            <p className="font-bold text-gray-800">
              {proj.title} <span className="text-xs text-gray-500">({proj.techStack.join(', ')})</span>
            </p>
            <p className="text-xs mt-1 whitespace-pre-wrap">{proj.description}</p>
          </div>
        ))}
      </section>
    )}
  </div>
);

export default TemplateMinimal;
