import { useMemo, useState } from 'react';
import { ApplicationForm, type ApplicationFormValues } from './components/ApplicationForm';
import { ApplicationTable } from './components/ApplicationTable';
import { FilterBar } from './components/FilterBar';
import { SummaryCards } from './components/SummaryCards';
import { mockApplications } from './data/mockApplications';
import { applicationsApi } from './lib/api';
import type { ApplicationFilters, JobApplication } from './types';

const initialFilters: ApplicationFilters = {
  search: '',
  status: 'All',
  workMode: 'All',
};

export default function App() {
  const [applications, setApplications] = useState<JobApplication[]>(mockApplications);
  const [filters, setFilters] = useState<ApplicationFilters>(initialFilters);
  const [selectedApplication, setSelectedApplication] = useState<JobApplication | null>(null);

  const filteredApplications = useMemo(() => {
    const query = filters.search.trim().toLowerCase();

    return applications.filter((application) => {
      const matchesSearch =
        query.length === 0 ||
        [application.company, application.role, application.location, application.source]
          .join(' ')
          .toLowerCase()
          .includes(query);

      const matchesStatus = filters.status === 'All' || application.status === filters.status;
      const matchesWorkMode = filters.workMode === 'All' || application.workMode === filters.workMode;

      return matchesSearch && matchesStatus && matchesWorkMode;
    });
  }, [applications, filters]);

  function handleSubmit(values: ApplicationFormValues) {
    if (selectedApplication) {
      const updated: JobApplication = { ...selectedApplication, ...values };
      setApplications((current) => current.map((item) => (item.id === selectedApplication.id ? updated : item)));
      setSelectedApplication(null);
      void applicationsApi.update(selectedApplication.id, values).catch(() => {
        // UI is intentionally mock-backed for now; API failures are ignored until backend is wired in.
      });
      return;
    }

    const created: JobApplication = {
      id: crypto.randomUUID(),
      ...values,
    };

    setApplications((current) => [created, ...current]);
    void applicationsApi.create(values).catch(() => {
      // UI is intentionally mock-backed for now; API failures are ignored until backend is wired in.
    });
  }

  function handleDelete(id: string) {
    setApplications((current) => current.filter((item) => item.id !== id));
    if (selectedApplication?.id === id) {
      setSelectedApplication(null);
    }
    void applicationsApi.remove(id).catch(() => {
      // UI is intentionally mock-backed for now; API failures are ignored until backend is wired in.
    });
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <header className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-brand-600">Job application tracker</p>
            <h1 className="mt-2 text-4xl font-bold tracking-tight text-slate-950">Keep your search tidy and moving.</h1>
            <p className="mt-3 max-w-2xl text-base text-slate-600">
              A lightweight frontend for tracking applications, interviews, offers, and everything in between.
            </p>
          </div>
          <div className="rounded-2xl bg-white px-4 py-3 text-sm text-slate-500 shadow-soft ring-1 ring-slate-200">
            API client ready for <code className="font-semibold text-slate-700">/api/applications</code>
          </div>
        </header>

        <div className="space-y-6">
          <SummaryCards applications={applications} />

          <div className="grid gap-6 xl:grid-cols-[360px,1fr]">
            <div>
              <ApplicationForm
                selectedApplication={selectedApplication}
                onSubmit={handleSubmit}
                onCancelEdit={() => setSelectedApplication(null)}
              />
            </div>

            <div className="space-y-4">
              <FilterBar filters={filters} total={filteredApplications.length} onChange={setFilters} />
              <ApplicationTable
                applications={filteredApplications}
                onEdit={setSelectedApplication}
                onDelete={handleDelete}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
