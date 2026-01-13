export const PROJECT_STATUS = {
  ACTIVE: "active",
  COMPLETED: "completed",
  ON_HOLD: "on-hold",
} as const;

export type ProjectStatus =
  typeof PROJECT_STATUS[keyof typeof PROJECT_STATUS];

export type Project = {
  id: string;
  title: string;
  description?: string;
  status?: ProjectStatus;
  createdAt?: string;
};

export type CreateProjectRequest = {
  title: string;
  description?: string;
  status?: ProjectStatus;
};

export type UpdateProjectRequest = {
  id: string;
  title?: string;
  description?: string;
  status?: ProjectStatus;
};