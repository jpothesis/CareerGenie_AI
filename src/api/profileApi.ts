import api from "./api";

export interface ProfileData {
  fullName?: string;
  headline?: string;
  bio?: string;
  location?: string;
  skills?: string[];
  profilePic?: string;
  experience?: string;
  education?: string;
  website?: string;
  github?: string;
  linkedin?: string;
  yearsExperience?: string;
}

// Fetch profile
export const getUserProfile = async (): Promise<ProfileData> => {
  const response = await api.get("/profile/me"); // GET from /api/profile/me
  return response.data;
};

// Update profile
export const updateUserProfile = async (profileData: ProfileData): Promise<ProfileData> => {
  const response = await api.post("/profile", profileData); // POST to /api/profile
  return response.data;
};

// Upload profile image
export const uploadProfilePicture = async (file: File): Promise<{ profileImage: string }> => {
  const formData = new FormData();
  formData.append("profileImage", file);

  const response = await api.post("/profile/upload-image", formData, { // POST instead of PUT
    headers: { "Content-Type": "multipart/form-data" },
  });

  return response.data;
};
