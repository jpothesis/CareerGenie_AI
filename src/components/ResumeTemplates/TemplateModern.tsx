import React from 'react';
import type { ResumeData } from '../resume'; // ✅ Type-only import

const TemplateModern: React.FC<{ data: ResumeData }> = ({ data }) => (
  <div className="bg-white text-gray-800 p-8 shadow-2xl border-t-4 border-orange-600 font-sans max-w-2xl mx-auto min-h-[11in]">
    
    {/* Header & Contact Info */}
    <header className="text-center pb-4 mb-4 border-b-2 border-orange-600">
      <h1 className="text-4xl font-extrabold text-gray-800 uppercase tracking-wider">
        {data.name || "YOUR NAME"}
      </h1>
      <p className="text-xl font-medium text-orange-600 mt-1">
        {data.jobTitle || "Job Title"}
      </p>
      <div className="text-sm text-gray-600 mt-2 flex justify-center space-x-4">
        {data.email && <span>{data.email}</span>}
        {data.phone && <span>| {data.phone}</span>}
        {data.location && <span>| {data.location}</span>}
      </div>
    </header>

    {/* Professional Summary */}
    {data.summary && (
      <section className="mb-4">
        <h2 className="text-lg font-bold text-orange-600 border-b border-gray-300 pb-1 mb-2">
          SUMMARY
        </h2>
        <p className="text-sm leading-relaxed">{data.summary}</p>
      </section>
    )}

    {/* Skills */}
    {data.skills.length > 0 && (
      <section className="mb-4">
        <h2 className="text-lg font-bold text-orange-600 border-b border-gray-300 pb-1 mb-2">
          KEY SKILLS
        </h2>
        <p className="text-sm">{data.skills.join(" | ")}</p>
      </section>
    )}

    {/* Experience */}
    {data.experience.length > 0 && (
      <section className="mb-4">
        <h2 className="text-lg font-bold text-orange-600 border-b border-gray-300 pb-1 mb-2">
          PROFESSIONAL EXPERIENCE
        </h2>
        {data.experience.map((exp) => (
          <div key={exp.id} className="mb-3 text-sm">
            <div className="flex justify-between font-semibold">
              <p className="text-gray-700">
                {exp.role} at {exp.company}
              </p>
              <p className="text-gray-500 italic">{exp.duration}</p>
            </div>
            <p className="text-xs mt-1 whitespace-pre-wrap">{exp.description}</p>
          </div>
        ))}
      </section>
    )}

    {/* Projects */}
    {data.projects.length > 0 && (
      <section className="mb-4">
        <h2 className="text-lg font-bold text-orange-600 border-b border-gray-300 pb-1 mb-2">
          PROJECTS
        </h2>
        {data.projects.map((proj) => (
          <div key={proj.id} className="mb-3 text-sm">
            <p className="font-semibold text-gray-700">
              {proj.title}{" "}
              <span className="text-gray-500 text-xs italic">
                ({proj.techStack.join(", ")})
              </span>
            </p>
            {proj.link && (
              <p className="text-xs text-blue-600">Link: {proj.link}</p>
            )}
            <p className="text-xs mt-1 whitespace-pre-wrap">{proj.description}</p>
          </div>
        ))}
      </section>
    )}

    {/* Education & Additional */}
    <div className="flex space-x-6">
      {data.education.length > 0 && (
        <section className="flex-1">
          <h2 className="text-lg font-bold text-orange-600 border-b border-gray-300 pb-1 mb-2">
            EDUCATION
          </h2>
          {data.education.map((edu) => (
            <div key={edu.id} className="mb-2 text-sm">
              <div className="flex justify-between">
                <p className="font-semibold text-gray-700">{edu.degree}</p>
                <p className="text-gray-500 text-xs italic">{edu.year}</p>
              </div>
              <p className="text-xs text-gray-600">{edu.institution}</p>
              {edu.gpa && (
                <p className="text-xs text-gray-500">GPA: {edu.gpa}</p>
              )}
            </div>
          ))}
        </section>
      )}

      {(data.certifications.length > 0 || data.languages.length > 0) && (
        <section className="flex-1">
          <h2 className="text-lg font-bold text-orange-600 border-b border-gray-300 pb-1 mb-2">
            ADDITIONAL
          </h2>

          {data.certifications.length > 0 && (
            <div className="mb-2">
              <p className="font-semibold text-gray-700 text-sm">
                Certifications:
              </p>
              <ul className="list-disc ml-4 text-xs text-gray-600">
                {data.certifications.map((cert) => (
                  <li key={cert.id}>
                    {cert.title} ({cert.issuer}, {cert.date})
                  </li>
                ))}
              </ul>
            </div>
          )}

          {data.languages.length > 0 && (
            <div>
              <p className="font-semibold text-gray-700 text-sm">Languages:</p>
              <p className="text-xs text-gray-600">
                {data.languages.join(" | ")}
              </p>
            </div>
          )}
        </section>
      )}
    </div>
  </div>
);

export default TemplateModern;
