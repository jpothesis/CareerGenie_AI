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
};

const initialJob: Job = {
  title: "",
  company: "",
  location: "",
  description: "",
};

const JobTracker = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [formData, setFormData] = useState<Job>(initialJob);
  const [editingId, setEditingId] = useState<string | null>(null);

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
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
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

  return (
    <div
      className="min-h-screen bg-cover bg-center px-6 py-10"
      style={{
        backgroundImage: `url(${bgImage})`,
        backgroundColor: "rgba(0,0,0,0.7)",
        backgroundBlendMode: "overlay",
      }}
    >
      <div className="max-w-5xl mx-auto backdrop-blur-md p-6 rounded-2xl border border-orange-500/20 bg-[#1a1a1a]/70">
        <h1 className="text-4xl font-extrabold mb-8 text-center bg-gradient-to-r from-yellow-400 via-orange-400 to-pink-500 text-transparent bg-clip-text">
          📌 Job Application Tracker
        </h1>

        {/* Job Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <InputField
              name="title"
              value={formData.title}
              onChange={handleChange}
              label="Job Title"
              placeholder="e.g. Frontend Developer"
              required
            />
            <InputField
              name="company"
              value={formData.company}
              onChange={handleChange}
              label="Company"
              placeholder="e.g. Google"
              required
            />
            <InputField
              name="location"
              value={formData.location}
              onChange={handleChange}
              label="Location"
              placeholder="e.g. Remote"
              required
            />
          </div>
          <TextAreaField
            name="description"
            value={formData.description}
            onChange={handleChange}
            label="Description"
            placeholder="Short description or notes..."
            rows={3}
          />
          <button
            type="submit"
            className="w-full mt-2 py-3 text-lg bg-gradient-to-r from-yellow-400 via-orange-400 to-pink-500 text-black font-bold rounded-lg hover:opacity-90 transition"
          >
            {editingId ? "✏️ Update Job" : "➕ Add Job"}
          </button>
        </form>

        {/* Job List */}
        <div className="mt-10 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {jobs.map((job) => (
            <div
              key={job._id}
              className="bg-white/90 rounded-xl p-5 shadow-md border border-orange-300/20 text-black space-y-2"
            >
              <h3 className="text-xl font-bold">{job.title}</h3>
              <p className="text-sm text-gray-700">{job.company}</p>
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
    </div>
  );
};

export default JobTracker;
