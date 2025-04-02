import { ListBlobResultBlob } from '@vercel/blob';
import axiosClient from './axios';
import axios from 'axios';

export async function uploadFileToLibrary(files: FileList, username: string) {
  const formData = new FormData();

  for (let i = 0; i < files.length; i++) {
    formData.append('file', files[i]);
  }

  const response = await axiosClient.post(`/api/library/${username}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  return response.data;
}

export async function getLibraryByFolderName(name: string): Promise<{ files: ListBlobResultBlob[] }> {
  const response = await axiosClient.get(`/api/library/${name}`);
  return response.data;
}

export async function deleteLibraryFiles(files: ListBlobResultBlob[], username: string) {
  const formData = new FormData();
  files.forEach(file => {
    formData.append('url', file.url);
  });

  const { data } = await axios.delete(`/api/library/${username}`, {
    data: formData,
  });

  return data;
}
