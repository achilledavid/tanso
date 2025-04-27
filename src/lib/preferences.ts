import axiosClient from "./axios";


export async function getUserKeyBinding(userId: number): Promise<UserKeyBinding[]> {
  const response = await axiosClient.get(`/api/users/${userId}/key-binding`);
  return response.data;
}

export async function updateUserKeyBinding(
  userId: number,
  id: number,
  keyBinding: string | null,
  position: number
): Promise<void> {
  const response = await axiosClient.put(
    `/api/users/${userId}/key-binding`,
    {
      id,
      keyBinding,
      position,
    }
  );
  
  return response.data;
}
