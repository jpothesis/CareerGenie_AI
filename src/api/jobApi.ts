import api from "./api";

//const API = axios.create({
// baseURL: "http://localhost:5000/api/jobs",
//  withCredentials: true, // optional: only needed if you're using auth/cookies
//});

export const fetchJobs = () => api.get("/jobs");
export const createJob = (jobData: any) => api.post("/jobs", jobData);
export const updateJob = (id: string, jobData: any) => api.put(`/jobs/${id}`, jobData);
export const deleteJob = (id: string) => api.delete(`/jobs/${id}`);
