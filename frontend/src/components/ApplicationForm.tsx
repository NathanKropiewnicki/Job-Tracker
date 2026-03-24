import { useEffect, useState, type FormEvent, type ReactNode } from 'react';
import type { ApplicationStatus, JobApplication, WorkMode } from '../types';

export interface ApplicationFormValues {
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

const defaultValues: ApplicationFormValues = {
  company: '',
  role: '',
  location: '',
  status: 'Applied',
  appliedDate: new Date().toISOString().slice(0, 10),
  source: '',
  salary: '',
  notes: '',
  workMode: 'Remote',
};

const statuses: ApplicationStatus[] = ['Applied', 'Interviewing', 'Offer', 'Rejected'];
const workModes: WorkMode[] = ['Remote', 'Hybrid', 'On-site'];

interface ApplicationFormProps {
  selectedApplication?: JobApplication | null;
  onSubmit: (values: ApplicationFormValues) => void;
  onCancelEdit: () => void;
}

export function ApplicationForm({ selectedApplication, onSubmit, onCancelEdit }: ApplicationFormProps) {
  const [values, setValues] = useState<ApplicationFormValues>(defaultValues);

  useEffect(() => {
    if (selectedApplication) {
      const { id: _id, ...rest } = selectedApplication;
      setValues(rest);
      return;
    }

    setValues(defaultValues);
  }, [selectedApplication]);

  function handleChange<K extends keyof ApplicationFormValues>(key: K, value: ApplicationFormValues[K]) {
    setValues((current) => ({ ...current, [key]: value }));
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    onSubmit(values);
    if (!selectedApplication) {
      setValues(defaultValues);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-2xl bg-white p-6 shadow-soft ring-1 ring-slate-200">
      <div className="mb-5 flex items-start justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">
            {selectedApplication ? 'Edit application' : 'Add application'}
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            Track where you applied, what stage you are in, and anything worth remembering.
          </p>
        </div>
        {selectedApplication ? (
          <button
            type="button"
            onClick={onCancelEdit}
            className="rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-50"
          >
            Cancel
          </button>
        ) : null}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Company">
          <input required value={values.company} onChange={(e) => handleChange('company', e.target.value)} className={inputClass} placeholder="Acme Labs" />
        </Field>
        <Field label="Role">
          <input required value={values.role} onChange={(e) => handleChange('role', e.target.value)} className={inputClass} placeholder="Frontend Engineer" />
        </Field>
        <Field label="Location">
          <input required value={values.location} onChange={(e) => handleChange('location', e.target.value)} className={inputClass} placeholder="London, UK" />
        </Field>
        <Field label="Applied date">
          <input required type="date" value={values.appliedDate} onChange={(e) => handleChange('appliedDate', e.target.value)} className={inputClass} />
        </Field>
        <Field label="Status">
          <select value={values.status} onChange={(e) => handleChange('status', e.target.value as ApplicationStatus)} className={inputClass}>
            {statuses.map((status) => (
              <option key={status} value={status}>{status}</option>
            ))}
          </select>
        </Field>
        <Field label="Work mode">
          <select value={values.workMode} onChange={(e) => handleChange('workMode', e.target.value as WorkMode)} className={inputClass}>
            {workModes.map((mode) => (
              <option key={mode} value={mode}>{mode}</option>
            ))}
          </select>
        </Field>
        <Field label="Source">
          <input value={values.source} onChange={(e) => handleChange('source', e.target.value)} className={inputClass} placeholder="LinkedIn" />
        </Field>
        <Field label="Salary">
          <input value={values.salary} onChange={(e) => handleChange('salary', e.target.value)} className={inputClass} placeholder="£65k–£75k" />
        </Field>
      </div>

      <Field label="Notes" className="mt-4">
        <textarea value={values.notes} onChange={(e) => handleChange('notes', e.target.value)} className={`${inputClass} min-h-28 resize-y`} placeholder="Interview prep notes, recruiter context, next steps..." />
      </Field>

      <div className="mt-5 flex justify-end">
        <button type="submit" className="rounded-lg bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-700">
          {selectedApplication ? 'Save changes' : 'Add application'}
        </button>
      </div>
    </form>
  );
}

function Field({ label, className = '', children }: { label: string; className?: string; children: ReactNode }) {
  return (
    <label className={`block ${className}`}>
      <span className="mb-1.5 block text-sm font-medium text-slate-700">{label}</span>
      {children}
    </label>
  );
}

const inputClass =
  'w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-brand-500 focus:ring-4 focus:ring-brand-100';
