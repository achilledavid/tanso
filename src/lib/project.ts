import axiosClient from "./axios";

export async function getPadsFromProject(id: number): Promise<Array<Pad>> {
  const response = await axiosClient.get(`/api/projects/${id}/pads`);
  return response.data;
}

export async function createProject(project: Omit<Project, 'id' | 'userId'>): Promise<Project> {
  const response = await axiosClient.post("/api/projects", project);
  return response.data;
}

export async function getProject(id: number): Promise<Project> {
  const response = await axiosClient.get(`/api/projects/${id}`);
  return response.data;
}

export async function deleteProject(id: number): Promise<void> {
  const response = await axiosClient.delete(`/api/projects/${id}`);
  return response.data;
}