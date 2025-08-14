import { useEffect, useState } from "react";
import { fetchJobs, createJob, deleteJob, updateJob } from "../../api/jobApi";
import InputField from "../../components/InputField";
import TextAreaField from "../../components/TextAreaField";
import bgImage from "../../assets/background.png";

type Job = {
  _id?: string;
  title: string;
  company: string;
  location: string;
  description: string;
  status: string;
};

const initialJob: Job = {
  title: "",
  company: "",
  location: "",
  description: "",
  status: "Applied",
};

const statusOptions = [
  { value: "Applied", label: "📄 Applied", hint: "You've applied and waiting for updates" },
  { value: "Interview", label: "🗓️ Interview", hint: "Interview is scheduled" },
  { value: "Offer", label: "🎉 Offer", hint: "You got the job offer" },
  { value: "Rejected", label: "❌ Rejected", hint: "Application was declined" },
];

const statusColors: Record<string, string> = {
  Applied: "bg-blue-100 text-blue-800",
  Interview: "bg-yellow-100 text-yellow-800",
  Offer: "bg-green-100 text-green-800",
  Rejected: "bg-red-100 text-red-800",
};

const JobTracker = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [formData, setFormData] = useState<Job>(initialJob);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [filter, setFilter] = useState("All");
  const [companyFilter, setCompanyFilter] = useState("");

  const loadJobs = async () => {
    try {
      const { data } = await fetchJobs();
      setJobs(data.jobs);
    } catch (error) {
      console.error("Failed to fetch jobs", error);
    }
  };

  useEffect(() => {
    loadJobs();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingId) {
        await updateJob(editingId, formData);
        setEditingId(null);
      } else {
        await createJob(formData);
      }
      setFormData(initialJob);
      loadJobs();
    } catch (error) {
      console.error("Failed to save job", error);
    }
  };

  const handleEdit = (job: Job) => {
    setFormData(job);
    setEditingId(job._id || null);
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteJob(id);
      loadJobs();
    } catch (error) {
      console.error("Failed to delete job", error);
    }
  };

  const filteredJobs = jobs.filter((job) => {
    const statusMatch = filter === "All" || job.status === filter;
    const companyMatch =
      companyFilter.trim() === "" ||
      job.company.toLowerCase().includes(companyFilter.toLowerCase());
    return statusMatch && companyMatch;
  });

  return (
    <div
      className="min-h-screen bg-cover bg-center px-6 py-10 flex gap-8"
      style={{
        backgroundImage: `url(${bgImage})`,
        backgroundColor: "rgba(0,0,0,0.7)",
        backgroundBlendMode: "overlay",
      }}
    >
      {/* Left Side - Form & Job List */}
      <div className="flex-1 max-w-5xl backdrop-blur-md p-6 rounded-2xl border border-orange-500/20 bg-[#1a1a1a]/70">
        <h1 className="text-4xl font-extrabold mb-8 text-center bg-gradient-to-r from-yellow-400 via-orange-400 to-pink-500 text-transparent bg-clip-text">
          📌 Job Application Tracker
        </h1>

        {/* Job Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <InputField name="title" value={formData.title} onChange={handleChange} label="Job Title" placeholder="e.g. Frontend Developer" required />
            <InputField name="company" value={formData.company} onChange={handleChange} label="Company" placeholder="e.g. Google" required />
            <InputField name="location" value={formData.location} onChange={handleChange} label="Location" placeholder="e.g. Remote" required />
          </div>

          <TextAreaField
            name="description"
            value={formData.description}
            onChange={handleChange}
            label="Description"
            placeholder="Short description or notes..."
            rows={3}
          />

          {/* Status Dropdown */}
          {/* Status Dropdown */}
          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="w-full px-3 py-2 rounded-lg bg-[#11111a] text-white border border-gray-600 focus:border-orange-400 focus:ring-2 focus:ring-orange-400/50 transition"
          >
            {statusOptions.map((opt) => (
              <option
                key={opt.value}
                value={opt.value}
                title={opt.hint}
                className="bg-[#1a1a1a] text-white"
              >
                {opt.label}
              </option>
            ))}
          </select>


          <button
            type="submit"
            className="w-full mt-2 py-3 text-lg bg-gradient-to-r from-yellow-400 via-orange-400 to-pink-500 text-black font-bold rounded-lg hover:opacity-90 transition"
          >
            {editingId ? "✏️ Update Job" : "➕ Add Job"}
          </button>
        </form>

        {/* Job List */}
        <div className="mt-10 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredJobs.map((job) => (
            <div
              key={job._id}
              className="bg-white/90 rounded-xl p-5 shadow-md border border-orange-300/20 text-black space-y-2"
            >
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-bold">{job.title}</h3>
                <span
                  className={`px-2 py-1 text-xs rounded-full font-semibold ${statusColors[job.status] || "bg-gray-200 text-gray-800"
                    }`}
                >
                  {statusOptions.find((opt) => opt.value === job.status)?.label || job.status}
                </span>
              </div>
              <p
                className="text-sm text-gray-700 cursor-pointer hover:underline"
                onClick={() => setCompanyFilter(job.company)}
              >
                {job.company}
              </p>
              <p className="text-sm text-gray-600">{job.location}</p>
              <p className="text-sm text-gray-600">{job.description}</p>
              <div className="flex justify-end gap-2 mt-3">
                <button
                  onClick={() => handleEdit(job)}
                  className="px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(job._id!)}
                  className="px-3 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Right Side - Status Overview + Company Search */}
      <div className="w-64 backdrop-blur-md p-6 rounded-2xl border border-orange-500/20 bg-[#1a1a1a]/70 shadow-lg h-fit">
        <h2 className="text-2xl font-extrabold mb-4 text-center bg-gradient-to-r from-yellow-400 via-orange-400 to-pink-500 text-transparent bg-clip-text">
          📊 Job Status Overview
        </h2>

        {/* Status Filters */}
        <div
          className="flex justify-between items-center py-2 px-3 mb-2 rounded-lg cursor-pointer bg-white/10 hover:bg-gradient-to-r from-yellow-400/20 via-orange-400/20 to-pink-500/20"
          onClick={() => setFilter("All")}
        >
          <span>📋 All</span>
          <span className="font-bold">{jobs.length}</span>
        </div>
        {statusOptions.map((opt) => {
          const count = jobs.filter((j) => j.status === opt.value).length;
          return (
            <div
              key={opt.value}
              className="flex justify-between items-center py-2 px-3 mb-2 rounded-lg cursor-pointer bg-white/10 hover:bg-gradient-to-r from-yellow-400/20 via-orange-400/20 to-pink-500/20"
              title={opt.hint}
              onClick={() => setFilter(opt.value)}
            >
              <span>{opt.label}</span>
              <span className="font-bold">{count}</span>
            </div>
          );
        })}

        {/* Search by Company */}
        <div className="mt-6">
          <h3 className="text-sm font-semibold mb-2 bg-gradient-to-r from-yellow-400 via-orange-400 to-pink-500 text-transparent bg-clip-text">
            🔍 Search by Company
          </h3>
          <input
            type="text"
            placeholder="e.g. Google"
            value={companyFilter}
            onChange={(e) => setCompanyFilter(e.target.value)}
            className="w-full px-3 py-2 rounded-lg bg-[#11111a] text-white border border-gray-600"
          />
          {companyFilter && (
            <button
              onClick={() => setCompanyFilter("")}
              className="mt-2 w-full text-xs text-orange-400 underline"
            >
              Clear Filter
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default JobTracker;
