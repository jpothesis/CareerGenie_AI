import React from 'react';
import type { ResumeData } from '../resume'; // ✅ Type-only import

const TemplateCreative: React.FC<{ data: ResumeData }> = ({ data }) => (
  <div className="bg-white text-gray-800 shadow-2xl font-sans max-w-2xl mx-auto min-h-[11in]">
    
    {/* Header Section */}
    <header className="bg-purple-700 text-white p-6 text-center">
      <h1 className="text-4xl font-extrabold uppercase tracking-wider">
        {data.name || "Your Name"}
      </h1>
      <p className="text-xl font-light opacity-80 mt-1">
        {data.jobTitle || "Job Title"}
      </p>
    </header>

    {/* Main Two-Column Body */}
    <div className="flex">
      {/* Sidebar (25%) */}
      <aside className="w-1/4 bg-gray-100 p-4 border-r border-gray-300">
        <h3 className="text-base font-bold text-purple-700 mt-2 mb-2 border-b border-gray-300">
          CONTACT
        </h3>
        <div className="text-xs space-y-1 text-gray-700">
          {data.email && <p>📧 {data.email}</p>}
          {data.phone && <p>📞 {data.phone}</p>}
          {data.location && <p>📍 {data.location}</p>}
        </div>

        <h3 className="text-base font-bold text-purple-700 mt-4 mb-2 border-b border-gray-300">
          SKILLS
        </h3>
        <ul className="text-xs space-y-1 text-gray-700">
          {data.skills.map((skill, index) => (
            <li key={index} className="font-medium">{skill}</li>
          ))}
        </ul>

        {(data.certifications.length > 0 || data.languages.length > 0) && (
          <>
            <h3 className="text-base font-bold text-purple-700 mt-4 mb-2 border-b border-gray-300">
              ADDITIONAL
            </h3>

            {data.languages.length > 0 && (
              <div className="text-xs mb-2">
                <p className="font-semibold">Languages:</p>
                <p className="text-gray-700">{data.languages.join(", ")}</p>
              </div>
            )}

            {data.certifications.length > 0 && (
              <div className="text-xs">
                <p className="font-semibold">Certifications:</p>
                <ul className="list-none space-y-1 text-gray-700">
                  {data.certifications.map(cert => (
                    <li key={cert.id}>{cert.title}</li>
                  ))}
                </ul>
              </div>
            )}
          </>
        )}
      </aside>

      {/* Main Content (75%) */}
      <main className="w-3/4 p-6">
        {/* Summary */}
        {data.summary && (
          <section className="mb-4">
            <h3 className="text-base font-bold text-gray-700 mb-1">PROFILE</h3>
            <p className="text-sm leading-relaxed">{data.summary}</p>
          </section>
        )}

        {/* Experience */}
        {data.experience.length > 0 && (
          <section className="mb-4">
            <h2 className="text-lg font-bold text-purple-700 border-b border-purple-300 pb-1 mb-2">
              EXPERIENCE
            </h2>
            {data.experience.map((exp) => (
              <div key={exp.id} className="mb-3 text-sm">
                <div className="flex justify-between font-semibold">
                  <p className="text-gray-800">
                    {exp.role} ({exp.company})
                  </p>
                  <p className="text-gray-500 italic text-xs">{exp.duration}</p>
                </div>
                <p className="text-xs mt-1 whitespace-pre-wrap">{exp.description}</p>
              </div>
            ))}
          </section>
        )}

        {/* Projects */}
        {data.projects.length > 0 && (
          <section className="mb-4">
            <h2 className="text-lg font-bold text-purple-700 border-b border-purple-300 pb-1 mb-2">
              PROJECTS
            </h2>
            {data.projects.map((proj) => (
              <div key={proj.id} className="mb-3 text-sm">
                <p className="font-semibold text-gray-800">{proj.title}</p>
                <p className="text-xs text-gray-600 mb-1">
                  {proj.techStack.join(', ')}
                </p>
                <p className="text-xs mt-1 whitespace-pre-wrap">{proj.description}</p>
              </div>
            ))}
          </section>
        )}

        {/* Education */}
        {data.education.length > 0 && (
          <section>
            <h2 className="text-lg font-bold text-purple-700 border-b border-purple-300 pb-1 mb-2">
              EDUCATION
            </h2>
            {data.education.map((edu) => (
              <div key={edu.id} className="mb-2 text-sm">
                <div className="flex justify-between">
                  <p className="font-semibold text-gray-800">{edu.degree}</p>
                  <p className="text-gray-500 text-xs italic">{edu.year}</p>
                </div>
                <p className="text-xs text-gray-600">{edu.institution}</p>
              </div>
            ))}
          </section>
        )}
      </main>
    </div>
  </div>
);

export default TemplateCreative;
