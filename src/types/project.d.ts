type Project = {
  id: number;
  name: string;
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
