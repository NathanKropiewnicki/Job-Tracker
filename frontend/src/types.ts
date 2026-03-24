export type ApplicationStatus = 'Applied' | 'Interviewing' | 'Offer' | 'Rejected';
export type WorkMode = 'Remote' | 'Hybrid' | 'On-site';

export interface JobApplication {
  id: string;
  company: string;
  role: string;
  location: string;
  status: ApplicationStatus;
  appliedDate: string;
  source: string;
  salary: string;
  notes: string;
  workMode: WorkMode;
}

export interface ApplicationFilters {
  search: string;
  status: 'All' | ApplicationStatus;
  workMode: 'All' | WorkMode;
}
