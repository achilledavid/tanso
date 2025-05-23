type Project = {
  id: number;
  name: string;
  description: string;
  userId: User["id"];
  uuid: string;
  isPublic: boolean;
  permissions?: {
    isOwner: boolean;
    isEditor: boolean;
    canEdit: boolean;
    canDelete: boolean;
    canRename: boolean;
  };
  collaborators?: string[]
  sounds?: { url: string, fileName: string }[];
  AccessAuthorized?: Array<{ userEmail: string }>
};

type AccessAuthorized = {
  id: number;
  userEmail: string;
  projectUuid: string;
  createdAt: Date;
};

type AccessAuthorizedResponse = AccessAuthorized & {
  user?: {
    id: number;
    username: string;
    email: string;
    firstname: string;
    lastname: string;
    avatarUrl: string | null;
  };
};
