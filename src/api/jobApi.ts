import api from "./api";

//const API = axios.create({
// baseURL: "http://localhost:5000/api/jobs",
//  withCredentials: true, // optional: only needed if you're using auth/cookies
//});

export const fetchJobs = () => api.get("/");
export const createJob = (jobData: any) => api.post("/", jobData);
export const updateJob = (id: string, jobData: any) => api.put(`/${id}`, jobData);
export const deleteJob = (id: string) => api.delete(`/${id}`);
