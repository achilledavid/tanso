import { ListBlobResultBlob } from '@vercel/blob';
import axiosClient from './axios';

export async function uploadFileToLibrary(file: File) {
  const formData = new FormData();
  formData.append('file', file);

  const response = await axiosClient.post(`/api/library?filename=${file.name}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  return response.data;
}

export async function deleteFileFromLibrary(url: string) {
  const response = await axiosClient.delete(`/api/library?url=${url}`);
  return response.data;
}

export async function getLibraryByUsername(username: string): Promise<{ files: ListBlobResultBlob[] }> {
  const response = await axiosClient.get(`/api/library?username=${username}`);
  return response.data;
}