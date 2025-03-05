import axiosClient from "./axios";

export async function updatePad(
  pad: Pad,
  url: string,
  projectUuid: string,
  path: string
): Promise<Pad> {
  const response = await axiosClient.put(`/api/projects/${projectUuid}/pads`, {
    id: pad.id,
    url: url,
    path: path,
  });

  return response.data;
}

export async function updatePadKeyBinding(
  pad: Pad,
  keyBinding: string | null,
  projectUuid: string
): Promise<Pad> {
  const response = await axiosClient.put(
    `/api/projects/${projectUuid}/pads/keybinding`,
    {
      id: pad.id,
      keyBinding,
    }
  );

  return response.data;
}

export async function deletePadFile(
  pad: Pad,
  projectUuid: string
): Promise<Pad> {
  const response = await axiosClient.delete(
    `/api/projects/${projectUuid}/pads/file`,
    {
      data: { id: pad.id },
    }
  );

  return response.data;
}
