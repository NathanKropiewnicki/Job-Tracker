import type { ApplicationFilters, ApplicationStatus, WorkMode } from '../types';

const statuses: Array<'All' | ApplicationStatus> = ['All', 'Applied', 'Interviewing', 'Offer', 'Rejected'];
const workModes: Array<'All' | WorkMode> = ['All', 'Remote', 'Hybrid', 'On-site'];

interface FilterBarProps {
  filters: ApplicationFilters;
  total: number;
  onChange: (filters: ApplicationFilters) => void;
}

export function FilterBar({ filters, total, onChange }: FilterBarProps) {
  return (
    <div className="rounded-2xl bg-white p-4 shadow-soft ring-1 ring-slate-200">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">Applications</h2>
          <p className="text-sm text-slate-500">{total} matching roles</p>
        </div>
        <div className="grid gap-3 sm:grid-cols-3 lg:min-w-[640px]">
          <input
            value={filters.search}
            onChange={(e) => onChange({ ...filters, search: e.target.value })}
            placeholder="Search company, role, location..."
            className={inputClass}
          />
          <select value={filters.status} onChange={(e) => onChange({ ...filters, status: e.target.value as ApplicationFilters['status'] })} className={inputClass}>
            {statuses.map((status) => (
              <option key={status} value={status}>{status === 'All' ? 'All statuses' : status}</option>
            ))}
          </select>
          <select value={filters.workMode} onChange={(e) => onChange({ ...filters, workMode: e.target.value as ApplicationFilters['workMode'] })} className={inputClass}>
            {workModes.map((mode) => (
              <option key={mode} value={mode}>{mode === 'All' ? 'All work modes' : mode}</option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}

const inputClass =
  'w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-brand-500 focus:ring-4 focus:ring-brand-100';
