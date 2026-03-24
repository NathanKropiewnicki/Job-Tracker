import type { JobApplication } from '../types';

interface SummaryCardsProps {
  applications: JobApplication[];
}

export function SummaryCards({ applications }: SummaryCardsProps) {
  const interviewing = applications.filter((item) => item.status === 'Interviewing').length;
  const offers = applications.filter((item) => item.status === 'Offer').length;
  const remote = applications.filter((item) => item.workMode === 'Remote').length;

  const cards = [
    { label: 'Total applications', value: applications.length, tone: 'bg-slate-900 text-white' },
    { label: 'Interviewing', value: interviewing, tone: 'bg-brand-50 text-brand-700 ring-1 ring-brand-100' },
    { label: 'Offers', value: offers, tone: 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-100' },
    { label: 'Remote roles', value: remote, tone: 'bg-amber-50 text-amber-700 ring-1 ring-amber-100' },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {cards.map((card) => (
        <div key={card.label} className={`rounded-2xl p-5 shadow-soft ${card.tone}`}>
          <p className="text-sm font-medium opacity-80">{card.label}</p>
          <p className="mt-3 text-3xl font-semibold">{card.value}</p>
        </div>
      ))}
    </div>
  );
}
