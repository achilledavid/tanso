import axiosClient from "./axios";

export async function getPadsFromSession(id: number): Promise<Array<Pad>> {
  const response = await axiosClient.get(`/api/sessions/${id}/pads`);
  return response.data;
}