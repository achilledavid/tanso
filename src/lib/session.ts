import axios from 'axios';

export async function getPadsFromSession(id: number): Promise<Array<Pad>> {
  const response = await axios.get(`/api/sessions/${id}/pads`);
  return response.data;
}