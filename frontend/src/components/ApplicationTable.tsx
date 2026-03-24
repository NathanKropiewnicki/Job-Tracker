import type { JobApplication } from '../types';

interface ApplicationTableProps {
  applications: JobApplication[];
  onEdit: (application: JobApplication) => void;
  onDelete: (id: string) => void;
}

const statusTone: Record<JobApplication['status'], string> = {
  Applied: 'bg-slate-100 text-slate-700',
  Interviewing: 'bg-brand-50 text-brand-700',
  Offer: 'bg-emerald-50 text-emerald-700',
  Rejected: 'bg-rose-50 text-rose-700',
};

export function ApplicationTable({ applications, onEdit, onDelete }: ApplicationTableProps) {
  return (
    <div className="overflow-hidden rounded-2xl bg-white shadow-soft ring-1 ring-slate-200">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-200">
          <thead className="bg-slate-50">
            <tr className="text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
              <th className="px-4 py-3">Role</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Location</th>
              <th className="px-4 py-3">Applied</th>
              <th className="px-4 py-3">Notes</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {applications.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-12 text-center text-sm text-slate-500">
                  No applications match your current search and filters.
                </td>
              </tr>
            ) : (
              applications.map((application) => (
                <tr key={application.id} className="align-top text-sm text-slate-700">
                  <td className="px-4 py-4">
                    <div className="font-semibold text-slate-900">{application.role}</div>
                    <div className="mt-1 text-slate-500">{application.company}</div>
                    <div className="mt-2 inline-flex rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600">
                      {application.workMode}
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${statusTone[application.status]}`}>
                      {application.status}
                    </span>
                    <div className="mt-2 text-xs text-slate-500">via {application.source || 'Unknown source'}</div>
                  </td>
                  <td className="px-4 py-4 text-slate-600">{application.location}</td>
                  <td className="px-4 py-4 text-slate-600">{formatDate(application.appliedDate)}</td>
                  <td className="px-4 py-4 text-slate-600">
                    <div>{application.salary || '—'}</div>
                    <p className="mt-1 max-w-sm text-xs leading-5 text-slate-500">{application.notes || 'No notes yet.'}</p>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex justify-end gap-2">
                      <button onClick={() => onEdit(application)} className="rounded-lg border border-slate-200 px-3 py-2 font-medium text-slate-600 transition hover:bg-slate-50">
                        Edit
                      </button>
                      <button onClick={() => onDelete(application.id)} className="rounded-lg border border-rose-200 px-3 py-2 font-medium text-rose-600 transition hover:bg-rose-50">
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat('en-GB', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(new Date(value));
}
