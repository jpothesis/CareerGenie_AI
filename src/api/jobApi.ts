import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api/jobs",
  withCredentials: true, // optional: only needed if you're using auth/cookies
});

export const fetchJobs = () => API.get("/");
export const createJob = (jobData: any) => API.post("/", jobData);
export const updateJob = (id: string, jobData: any) => API.put(`/${id}`, jobData);
export const deleteJob = (id: string) => API.delete(`/${id}`);
