type User = {
  id: number;
  email: string;
  username: string;
  firstname: string;
  lastname: string;
  avatarUrl?: string;
}

type UpsertUserPayload = {
  email: string;
  firstname?: string;
  lastname?: string;
  avatarUrl?: string;
};

type UpdateUserPayload = {
  firstname: string;
  lastname: string;
}
