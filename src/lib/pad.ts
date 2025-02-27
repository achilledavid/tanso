import { ListBlobResultBlob } from "@vercel/blob";
import axios from 'axios';

export async function updatePad(pad: Pad, file: ListBlobResultBlob) {
  const response = await axios.put(`/api/sessions/${pad.sessionId}/pads`, {
    id: pad.id,
    url: file.url,
  });

  return response.data;
}