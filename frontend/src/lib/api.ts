// API Base URL
const API_BASE_URL = '/api';

// Helper function to handle API errors
const handleApiError = async (response: Response) => {
  let errorMessage = 'An error occurred';
  try {
    const errorData = await response.json();
    errorMessage = errorData.message || errorMessage;
  } catch {
    errorMessage = `HTTP ${response.status}: ${response.statusText}`;
  }
  throw new Error(errorMessage);
};

// Types
export interface Profile {
  id: number;
  profileName: string;
  email: string;
  fullName?: string;
  title?: string;
  phone?: string;
  location?: string;
  summary?: string;
  skills?: string[];
  links?: Array<{
    type: string;
    url: string;
  }>;
  education?: Array<{
    schoolName: string;
    degree: string;
    fieldOfStudy: string;
    grade?: string;
    startDate: string;
    endDate?: string;
    description?: string;
    location?: string;
    currentlyStudying?: boolean;
  }>;
  experiences?: Array<{
    jobTitle: string;
    companyName: string;
    employmentType?: string;
    location?: string;
    links?: Array<{ type: string; url: string }>;
    startDate: string;
    endDate?: string;
    currentlyWorking?: boolean;
    description?: string;
  }>;
  projects?: Array<{
    title: string;
    description?: string;
    technologies?: string[];
    links?: Array<{ type: string; url: string }>;
    startDate: string;
    endDate?: string;
    currentlyOngoing?: boolean;
  }>;
  activities?: Array<{
    title: string;
    description?: string;
    role?: string;
    startDate: string;
    endDate?: string;
    currentlyOngoing?: boolean;
  }>;
  volunteering?: Array<{
    organizationName: string;
    description?: string;
    role: string;
    location?: string;
    startDate: string;
    endDate?: string;
    currentlyVolunteering?: boolean;
  }>;
  createdAt: string;
  updatedAt: string;
}

export interface CV {
  id: number;
  profileId: number;
  jobDescription: string;
  pdfPath: string;
  cvData: any;
  createdAt: string;
  profile?: {
    id: number;
    email: string;
    fullName?: string;
  };
}

export interface CreateProfileDto {
  profileName: string;
  email: string;
}

export interface UpdateProfileDto {
  profileName?: string;
  email?: string;
  fullName?: string;
  title?: string;
  phone?: string;
  location?: string;
  summary?: string;
  skills?: string[];
  links?: Array<{
    type: string;
    url: string;
  }>;
  education?: Array<{
    schoolName: string;
    degree: string;
    fieldOfStudy: string;
    grade?: string;
    startDate: string;
    endDate?: string;
    description?: string;
    location?: string;
    currentlyStudying?: boolean;
  }>;
  experiences?: Array<{
    jobTitle: string;
    companyName: string;
    employmentType?: string;
    location?: string;
    links?: Array<{ type: string; url: string }>;
    startDate: string;
    endDate?: string;
    currentlyWorking?: boolean;
    description?: string;
  }>;
  projects?: Array<{
    title: string;
    description?: string;
    technologies?: string[];
    links?: Array<{ type: string; url: string }>;
    startDate: string;
    endDate?: string;
    currentlyOngoing?: boolean;
  }>;
  activities?: Array<{
    title: string;
    description?: string;
    role?: string;
    startDate: string;
    endDate?: string;
    currentlyOngoing?: boolean;
  }>;
  volunteering?: Array<{
    organizationName: string;
    description?: string;
    role: string;
    location?: string;
    startDate: string;
    endDate?: string;
    currentlyVolunteering?: boolean;
  }>;
}

export interface GenerateCvDto {
  profileId: number;
  jobDescription: string;
}

// Profiles API
export const profilesApi = {
  // Get all profiles
  getAll: async (): Promise<Profile[]> => {
    const response = await fetch(`${API_BASE_URL}/profiles`);
    if (!response.ok) await handleApiError(response);
    return response.json();
  },

  // Get profile by ID
  getById: async (id: number): Promise<Profile> => {
    const response = await fetch(`${API_BASE_URL}/profiles/${id}`);
    if (!response.ok) await handleApiError(response);
    return response.json();
  },

  // Create profile
  create: async (data: CreateProfileDto): Promise<Profile> => {
    const response = await fetch(`${API_BASE_URL}/profiles`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) await handleApiError(response);
    return response.json();
  },

  // Update profile
  update: async (id: number, data: UpdateProfileDto): Promise<Profile> => {
    const response = await fetch(`${API_BASE_URL}/profiles/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) await handleApiError(response);
    return response.json();
  },

  // Delete profile
  delete: async (id: number): Promise<Profile> => {
    const response = await fetch(`${API_BASE_URL}/profiles/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) await handleApiError(response);
    return response.json();
  },
};

// CVs API
export const cvsApi = {
  // Generate CV (returns PDF blob)
  generate: async (data: GenerateCvDto): Promise<Blob> => {
    const response = await fetch(`${API_BASE_URL}/cvs/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) await handleApiError(response);
    return response.blob();
  },

  // Get all CVs
  getAll: async (): Promise<CV[]> => {
    const response = await fetch(`${API_BASE_URL}/cvs`);
    if (!response.ok) await handleApiError(response);
    return response.json();
  },

  // Get CV by ID
  getById: async (id: number): Promise<CV> => {
    const response = await fetch(`${API_BASE_URL}/cvs/${id}`);
    if (!response.ok) await handleApiError(response);
    return response.json();
  },

  // Get CVs by profile ID
  getByProfileId: async (profileId: number): Promise<CV[]> => {
    const response = await fetch(`${API_BASE_URL}/cvs/profile/${profileId}`);
    if (!response.ok) await handleApiError(response);
    return response.json();
  },

  // Download CV (returns PDF blob)
  download: async (id: number): Promise<Blob> => {
    const response = await fetch(`${API_BASE_URL}/cvs/${id}/download`);
    if (!response.ok) await handleApiError(response);
    return response.blob();
  },

  // Regenerate CV (returns PDF blob)
  regenerate: async (id: number): Promise<Blob> => {
    const response = await fetch(`${API_BASE_URL}/cvs/${id}/regenerate`);
    if (!response.ok) await handleApiError(response);
    return response.blob();
  },

  // Update CV data
  updateCvData: async (id: number, cvData: any): Promise<CV> => {
    const response = await fetch(`${API_BASE_URL}/cvs/${id}/cv-data`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(cvData),
    });
    if (!response.ok) await handleApiError(response);
    return response.json();
  },

  // Delete CV
  delete: async (id: number): Promise<CV> => {
    const response = await fetch(`${API_BASE_URL}/cvs/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) await handleApiError(response);
    return response.json();
  },
};

// Helper function to download blob as file
export const downloadBlob = (blob: Blob, filename: string) => {
  const url = globalThis.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  globalThis.URL.revokeObjectURL(url);
  a.remove();
};
