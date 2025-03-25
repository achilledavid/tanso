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
