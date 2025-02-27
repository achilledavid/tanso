import { ListBlobResultBlob } from '@vercel/blob';
import axios from 'axios';

export async function uploadFileToLibrary(file: File) {
  const formData = new FormData();
  formData.append('file', file);

  const response = await axios.post(`/api/library?filename=${file.name}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  return response.data;
}

export async function deleteFileFromLibrary(url: string) {
  const response = await axios.delete(`/api/library?url=${url}`);
  return response.data;
}

export async function getLibraryByUsername(username: string): Promise<{ files: ListBlobResultBlob[] }> {
  const response = await axios.get(`/api/library?username=${username}`);
  return response.data;
}