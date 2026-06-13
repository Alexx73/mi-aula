import React, { useMemo, useState } from 'react';
import QuarterTabs from '../components/QuarterTabs';
import ActivityCard from '../components/ActivityCard';

const quarterData = [
  {
    id: 'q1',
    label: '1er trimestre',
    subtitle: 'Letras y números para arrancar.',
    cards: [
      {
        to: '/alphabet',
        title: 'Alphabet',
        subtitle: 'Practicar letras con sonido y juego.',
        badge: 'Letters',
        accentClass: 'bg-red-500',
      },
      {
        to: '/number',
        title: 'Numbers',
        subtitle: 'Aprender números del 0 al 20.',
        badge: 'Numbers',
        accentClass: 'bg-blue-600',
      },
    ],
  },
  {
    id: 'q2',
    label: '2do trimestre',
    subtitle: 'Vocabulario de familia y profesiones.',
    cards: [
      {
        to: '/family',
        title: 'Family',
        subtitle: 'Miembros de la familia y vínculos.',
        badge: 'People',
        accentClass: 'bg-green-500',
      },
      {
        to: '/jobs',
        title: 'Jobs',
        subtitle: 'Profesiones comunes en inglés.',
        badge: 'Work',
        accentClass: 'bg-purple-600',
      },
    ],
  },
  {
    id: 'q3',
    label: '3er trimestre',
    subtitle: 'Preguntas y presentaciones personales.',
    cards: [
      {
        to: '/personal-information',
        title: 'Personal Info',
        subtitle: 'Datos personales y presentaciones.',
        badge: 'Profile',
        accentClass: 'bg-cyan-500',
      },
      {
        to: '/questions',
        title: 'Questions',
        subtitle: 'Preguntas y respuestas guiadas.',
        badge: 'Chat',
        accentClass: 'bg-rose-500',
      },
    ],
  },
  {
    id: 'cuadernillo',
    label: 'Cuadernillo',
    subtitle: 'Material para ver y descargar.',
    cards: [
      {
        href: 'https://drive.google.com/file/d/1JDWsxlSciDbAYW0F_kVbuGh0IORQ--kj/preview',
        title: 'Ver PDF',
        subtitle: 'Abrir el cuadernillo en una nueva pestaña.',
        badge: 'Material',
        actionLabel: 'View',
        accentClass: 'bg-emerald-500',
      },
      {
        href: 'https://drive.google.com/uc?export=download&id=1JDWsxlSciDbAYW0F_kVbuGh0IORQ--kj',
        title: 'Descargar',
        subtitle: 'Bajar el cuadernillo al dispositivo.',
        badge: 'Material',
        actionLabel: 'Download',
        accentClass: 'bg-slate-700',
      },
    ],
  },
];

export default function Inicio() {
  const [activeQuarter, setActiveQuarter] = useState('q1');

  const activeData = useMemo(
    () => quarterData.find((quarter) => quarter.id === activeQuarter) ?? quarterData[0],
    [activeQuarter]
  );

  return (
    <div className="flex h-[calc(100dvh-5rem)] flex-col overflow-hidden bg-gradient-to-b from-blue-100 to-blue-200 px-3 py-2 dark:from-gray-900 dark:to-gray-800">
      <div className="mb-1">
        <h1 className="text-center text-xl font-extrabold leading-tight text-blue-800 md:text-4xl dark:text-blue-300">
          Aula de Inglés de primer año
        </h1>
        <p className="mx-auto mt-1 max-w-2xl text-center text-[11px] leading-snug text-gray-700 dark:text-gray-300">
          Elige un trimestre para entrar rápido a cada actividad.
        </p>
      </div>

      <div className="mb-1">
        <QuarterTabs
          tabs={quarterData.map(({ id, label }) => ({ id, label }))}
          activeId={activeQuarter}
          onChange={setActiveQuarter}
        />
      </div>

      <div className="mb-1 flex items-end justify-between gap-3">
        <div>
          <h2 className="text-sm font-black text-gray-900 dark:text-white">
            {activeData.label}
          </h2>
          <p className="text-[10px] font-medium text-gray-700 dark:text-gray-300">
            {activeData.subtitle}
          </p>
        </div>
        <div className="rounded-full bg-white/80 px-3 py-1 text-[9px] font-bold text-gray-800 shadow-sm dark:bg-white/10 dark:text-white">
          {activeData.cards.length} items
        </div>
      </div>

      <div className="grid grid-cols-2 content-start items-start gap-2 overflow-hidden sm:grid-cols-2 md:grid-cols-3">
        {activeData.cards.map((card) => (
          <ActivityCard key={card.to ?? card.href ?? card.title} {...card} />
        ))}
      </div>
    </div>
  );
}
