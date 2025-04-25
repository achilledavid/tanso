import axiosClient from "./axios";

export async function getPadsFromProject(uuid: string): Promise<Array<Pad>> {
  const response = await axiosClient.get(`/api/projects/${uuid}/pads`);
  return response.data;
}

export async function createProject(project: Omit<Project, "id" | "userId" | "uuid">): Promise<Project> {
  const response = await axiosClient.post("/api/projects", project);
  return response.data;
}

export async function getProject(uuid: string): Promise<Project> {
  const response = await axiosClient.get(`/api/projects/${uuid}`);
  return response.data;
}

export async function deleteProject(uuid: string): Promise<void> {
  const response = await axiosClient.delete(`/api/projects/${uuid}`);
  return response.data;
}

export async function updateProject(uuid: string, data: Partial<Project>): Promise<Project> {
  const response = await axiosClient.put(`/api/projects/${uuid}`, data);
  return response.data;
}

export async function setProjectPublic(uuid: string, isPublic: boolean): Promise<Project> {
  const response = await axiosClient.put(`/api/projects/${uuid}`, { isPublic });
  return response.data;
}

export async function getProjectAccess(uuid: string): Promise<AccessAuthorizedResponse[]> {
  const response = await axiosClient.get(`/api/projects/${uuid}/access`);
  return response.data;
}

export async function addProjectAccess(uuid: string, email: string): Promise<AccessAuthorizedResponse> {
  const response = await axiosClient.post(`/api/projects/${uuid}/access`, { email });
  return response.data;
}

export async function removeProjectAccess(uuid: string, userEmail: string): Promise<void> {
  const response = await axiosClient.delete(`/api/projects/${uuid}/access`, { 
    data: { userEmail } 
  });
  return response.data;
}

export async function getSharedProjects(): Promise<Array<Project & { user: User }>> {
  const response = await axiosClient.get("/api/projects/shared");
  return response.data;
}
