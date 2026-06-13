import React, { useEffect, useMemo, useRef, useState } from 'react';
import QuarterTabs from '../components/QuarterTabs';
import ActivityCard from '../components/ActivityCard';

import cuadernilloPdf from '../assets/cuadernillo - 1ro - 2026.pdf';

const quarterData = [
  {
    id: 'q1',
    label: '1er trimestre',
    subtitle: 'Letras y numeros para arrancar.',
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
        subtitle: 'Aprender numeros del 0 al 20.',
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
        subtitle: 'Miembros de la familia y vinculos.',
        badge: 'People',
        accentClass: 'bg-green-500',
      },
      {
        to: '/jobs',
        title: 'Jobs',
        subtitle: 'Profesiones comunes en ingles.',
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
    cards: [],
  },
];

export default function Inicio() {
  const [activeQuarter, setActiveQuarter] = useState('q1');
  const [pdfZoom, setPdfZoom] = useState(1);
  const [pdfControlsVisible, setPdfControlsVisible] = useState(true);
  const pdfControlsTimer = useRef(null);

  const activeData = useMemo(
    () => quarterData.find((quarter) => quarter.id === activeQuarter) ?? quarterData[0],
    [activeQuarter]
  );

  const isCuadernillo = activeQuarter === 'cuadernillo';

  const showPdfControls = () => {
    setPdfControlsVisible(true);
    if (pdfControlsTimer.current) clearTimeout(pdfControlsTimer.current);
    pdfControlsTimer.current = setTimeout(() => {
      setPdfControlsVisible(false);
    }, 5000);
  };

  useEffect(() => {
    if (isCuadernillo) {
      setPdfZoom(1);
      showPdfControls();
    } else {
      setPdfControlsVisible(true);
      if (pdfControlsTimer.current) clearTimeout(pdfControlsTimer.current);
    }

    return () => {
      if (pdfControlsTimer.current) clearTimeout(pdfControlsTimer.current);
    };
  }, [isCuadernillo]);

  return (
    <div className="flex h-[calc(100dvh-5rem)] flex-col overflow-hidden bg-gradient-to-b from-blue-100 to-blue-200 px-3 py-2 dark:from-gray-900 dark:to-gray-800">
      <div className="mb-1">
        <h1 className="text-center text-xl font-extrabold leading-tight text-blue-800 md:text-4xl dark:text-blue-300">
          Aula de Ingles de primer ano
        </h1>
        <p className="mx-auto mt-1 max-w-2xl text-center text-[11px] leading-snug text-gray-700 dark:text-gray-300">
          Elige un trimestre para entrar rapido a cada actividad.
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
          {isCuadernillo ? (
            <a
              href={cuadernilloPdf}
              download="cuadernillo - 1ro - 2026.pdf"
              className="mt-1 inline-flex items-center gap-2 text-[10px] font-medium text-gray-700 transition hover:text-blue-700 dark:text-gray-300 dark:hover:text-blue-300"
            >
              <span>{activeData.subtitle}</span>
              <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-blue-600 text-white shadow-sm">
                <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="7 10 12 15 17 10" />
                  <line x1="12" y1="15" x2="12" y2="3" />
                </svg>
              </span>
            </a>
          ) : (
            <p className="text-[10px] font-medium text-gray-700 dark:text-gray-300">
              {activeData.subtitle}
            </p>
          )}
        </div>
        <div className="rounded-full bg-white/80 px-3 py-1 text-[9px] font-bold text-gray-800 shadow-sm dark:bg-white/10 dark:text-white">
          {isCuadernillo ? 'PDF' : `${activeData.cards.length} items`}
        </div>
      </div>

      {isCuadernillo ? (
        <div className="relative flex flex-1 min-h-0 flex-col overflow-hidden">
          <div className="relative flex-1 min-h-0 overflow-hidden rounded-2xl border border-white/70 bg-white/85 shadow-md dark:border-white/10 dark:bg-gray-900/80">
            <div
              className="h-full w-full origin-top overflow-hidden"
              style={{
                transform: `scale(${pdfZoom})`,
                width: `${100 / pdfZoom}%`,
                height: `${100 / pdfZoom}%`,
              }}
            >
              <iframe
                src={cuadernilloPdf}
                title="Cuadernillo"
                className="h-full w-full"
                loading="eager"
                allow="fullscreen"
              />
            </div>

            {!pdfControlsVisible && (
              <button
                type="button"
                onClick={showPdfControls}
                className="absolute inset-0 z-20 bg-transparent"
                aria-label="Mostrar controles del cuadernillo"
              />
            )}

            <div
              className={`absolute bottom-2 left-1/2 z-30 flex -translate-x-1/2 items-center gap-2 rounded-full bg-black/55 px-2 py-1 text-white shadow-lg backdrop-blur transition-opacity duration-200 ${
                pdfControlsVisible ? 'opacity-100' : 'pointer-events-none opacity-0'
              }`}
            >
              <button
                type="button"
                onClick={() => {
                  setPdfZoom((prev) => Math.max(0.75, +(prev - 0.15).toFixed(2)));
                  showPdfControls();
                }}
                className="h-8 rounded-full bg-white/15 px-3 text-sm font-black leading-none"
              >
                -
              </button>
              <button
                type="button"
                onClick={() => {
                  setPdfZoom(1);
                  showPdfControls();
                }}
                className="h-8 rounded-full bg-white/15 px-3 text-[10px] font-black leading-none"
              >
                100%
              </button>
              <button
                type="button"
                onClick={() => {
                  setPdfZoom((prev) => Math.min(2, +(prev + 0.15).toFixed(2)));
                  showPdfControls();
                }}
                className="h-8 rounded-full bg-white/15 px-3 text-sm font-black leading-none"
              >
                +
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-2 content-start items-start gap-2 overflow-hidden sm:grid-cols-2 md:grid-cols-3">
          {activeData.cards.map((card) => (
            <ActivityCard key={card.to ?? card.href ?? card.title} {...card} />
          ))}
        </div>
      )}
    </div>
  );
}
