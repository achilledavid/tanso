import axios from 'axios';

export async function uploadFile(file: File) {
  const formData = new FormData();
  formData.append('file', file);

  const response = await axios.post(`/api/file?filename=${file.name}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  return response.data;
}