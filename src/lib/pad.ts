import axiosClient from "./axios";

export async function updatePad(pad: Pad, url: string, projectId: number, path: string): Promise<Pad> {
  const response = await axiosClient.put(`/api/projects/${projectId}/pads`, {
    id: pad.id,
    url: url,
    path: path
  });

  return response.data;
}

export async function updatePadKeyBinding(pad: Pad, keyBinding: string | null, projectId: number): Promise<Pad> {
  const response = await axiosClient.put(`/api/projects/${projectId}/pads/keybinding`, {
    id: pad.id,
    keyBinding
  });

  return response.data;
}

export async function deletePadFile(pad: Pad, projectId: number): Promise<Pad> {
  const response = await axiosClient.delete(`/api/projects/${projectId}/pads/file`, {
    data: { id: pad.id }
  });

  return response.data;
}