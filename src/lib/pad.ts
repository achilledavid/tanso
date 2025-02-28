import { ListBlobResultBlob } from "@vercel/blob";
import axiosClient from "./axios";

export async function updatePad(pad: Pad, file: ListBlobResultBlob) {
  const response = await axiosClient.put(`/api/sessions/${pad.sessionId}/pads`, {
    id: pad.id,
    url: file.url,
  });

  return response.data;
}