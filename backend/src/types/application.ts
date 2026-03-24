export const applicationStatuses = [
  'SAVED',
  'APPLIED',
  'INTERVIEWING',
  'OFFER',
  'REJECTED',
  'WITHDRAWN',
] as const;

export type ApplicationStatus = (typeof applicationStatuses)[number];

export type ApplicationInput = {
  company: string;
  role: string;
  status?: ApplicationStatus;
  location?: string | null;
  link?: string | null;
  notes?: string | null;
  appliedAt?: string | null;
};
