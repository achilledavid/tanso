import axiosClient from "./axios";

export async function updatePad(pad: Pad, url: string, projectId: number): Promise<Pad> {
  const response = await axiosClient.put(`/api/projects/${projectId}/pads`, {
    id: pad.id,
    url: url,
  });

  return response.data;
}