import { useEffect, useMemo, useRef, useState } from 'react';

const RANGES = [
  { id: '20', label: '1 al 20', max: 20 },
  { id: '100', label: '1 al 100', max: 100 },
];

const COLORS = ['#facc15', '#66b77e', '#b9f3d6', '#405b5b'];
const CENTER = 250;
const RADIUS = 238;
const INNER_RADIUS = 44;
const POINTER_ANGLE = -90;

const toRadians = (angle) => (angle * Math.PI) / 180;

const pointOnCircle = (radius, angle) => ({
  x: CENTER + radius * Math.cos(toRadians(angle)),
  y: CENTER + radius * Math.sin(toRadians(angle)),
});

const getSegmentPath = (startAngle, endAngle) => {
  const start = pointOnCircle(RADIUS, startAngle);
  const end = pointOnCircle(RADIUS, endAngle);
  const largeArc = endAngle - startAngle > 180 ? 1 : 0;

  return `M ${CENTER} ${CENTER} L ${start.x} ${start.y} A ${RADIUS} ${RADIUS} 0 ${largeArc} 1 ${end.x} ${end.y} Z`;
};

const getRandomNumber = (max) => Math.floor(Math.random() * max) + 1;

function Wheel({ max, rotation, onSpin, isSpinning, disableTransition }) {
  const segments = useMemo(() => {
    const step = 360 / max;
    const labelRadius = max === 20 ? 190 : 218;
    const fontSize = max === 20 ? 22 : 8;

    return Array.from({ length: max }, (_, index) => {
      const startAngle = POINTER_ANGLE + index * step;
      const endAngle = startAngle + step;
      const middleAngle = startAngle + step / 2;
      const labelPoint = pointOnCircle(labelRadius, middleAngle);
      const value = index + 1;
      const isLight = index % COLORS.length === 0 || index % COLORS.length === 2;

      return {
        value,
        path: getSegmentPath(startAngle, endAngle),
        labelPoint,
        middleAngle,
        color: COLORS[index % COLORS.length],
        textColor: isLight ? '#10201d' : '#ffffff',
        fontSize,
      };
    });
  }, [max]);

  return (
    <div className="number-wheel-stage" aria-label={`Rueda con números del 1 al ${max}`}>
      <div className="number-wheel-pointer" aria-hidden="true" />
      <svg
        className={`number-wheel-svg ${isSpinning ? 'is-spinning' : ''} ${disableTransition ? 'without-transition' : ''}`}
        viewBox="0 0 500 500"
        role="img"
        aria-label={`Números del 1 al ${max}`}
        style={{ transform: `rotate(${rotation}deg)` }}
      >
        <circle cx={CENTER} cy={CENTER} r={RADIUS + 2} fill="#f8fafc" />
        {segments.map((segment) => (
          <g key={segment.value}>
            <path d={segment.path} fill={segment.color} stroke="#ffffff" strokeWidth={max === 20 ? 2 : 0.6} />
            <text
              x={segment.labelPoint.x}
              y={segment.labelPoint.y}
              fill={segment.textColor}
              fontSize={segment.fontSize}
              fontWeight="900"
              textAnchor="middle"
              dominantBaseline="middle"
              transform={`rotate(${segment.middleAngle + 90} ${segment.labelPoint.x} ${segment.labelPoint.y})`}
            >
              {segment.value}
            </text>
          </g>
        ))}
        <circle cx={CENTER} cy={CENTER} r={INNER_RADIUS + 5} fill="#ffffff" opacity="0.9" />
        <circle cx={CENTER} cy={CENTER} r={INNER_RADIUS} fill="#263b3b" stroke="#ffffff" strokeWidth="3" />
      </svg>
      <button
        type="button"
        className="number-wheel-center-button"
        onClick={onSpin}
        disabled={isSpinning}
        aria-label={isSpinning ? 'La rueda está girando' : 'Girar la rueda'}
      >
        {isSpinning ? '...' : 'SPIN'}
      </button>
    </div>
  );
}

export default function NumberWheel() {
  const [rangeId, setRangeId] = useState('20');
  const [isManualMode, setIsManualMode] = useState(false);
  const [manualNumber, setManualNumber] = useState('');
  const [result, setResult] = useState(null);
  const [isResultOpen, setIsResultOpen] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [isSpinning, setIsSpinning] = useState(false);
  const [isResetting, setIsResetting] = useState(false);
  const timerRef = useRef(null);
  const audioContextRef = useRef(null);
  const spinSoundTimerRef = useRef(null);
  const resetTimerRef = useRef(null);
  const spinDuration = 4800;

  const selectedRange = RANGES.find((range) => range.id === rangeId) ?? RANGES[0];

  useEffect(() => () => {
    window.clearTimeout(timerRef.current);
    window.clearTimeout(resetTimerRef.current);
    window.clearTimeout(spinSoundTimerRef.current);
  }, []);

  useEffect(() => {
    if (!isResultOpen) return undefined;

    const closeWithEscape = (event) => {
      if (event.key === 'Escape') setIsResultOpen(false);
    };

    document.addEventListener('keydown', closeWithEscape);
    return () => document.removeEventListener('keydown', closeWithEscape);
  }, [isResultOpen]);

  const changeRange = (nextRangeId) => {
    if (isSpinning) return;
    setRangeId(nextRangeId);
    setIsManualMode(false);
    setManualNumber('');
    setResult(null);
    setIsResultOpen(false);
    setIsResetting(true);
    setRotation(0);
    window.clearTimeout(resetTimerRef.current);
    resetTimerRef.current = window.setTimeout(() => setIsResetting(false), 30);
  };

  const playVictorySound = () => {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;

    audioContextRef.current ??= new AudioContext();
    const audioContext = audioContextRef.current;
    audioContext.resume();
    const notes = [392, 523, 659, 784, 988];

    notes.forEach((frequency, index) => {
      const start = audioContext.currentTime + index * 0.1;
      const oscillator = audioContext.createOscillator();
      const gain = audioContext.createGain();
      oscillator.type = index === notes.length - 1 ? 'square' : 'triangle';
      oscillator.frequency.setValueAtTime(frequency, start);
      gain.gain.setValueAtTime(0.0001, start);
      gain.gain.exponentialRampToValueAtTime(0.18, start + 0.015);
      gain.gain.exponentialRampToValueAtTime(0.0001, start + 0.16);
      oscillator.connect(gain);
      gain.connect(audioContext.destination);
      oscillator.start(start);
      oscillator.stop(start + 0.17);
    });
  };

  const spin = () => {
    if (isSpinning || isManualMode) return;

    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (AudioContext) {
      audioContextRef.current ??= new AudioContext();
      const audioContext = audioContextRef.current;
      const playTick = () => {
        const oscillator = audioContext.createOscillator();
        const gain = audioContext.createGain();
        const now = audioContext.currentTime;
        oscillator.type = 'triangle';
        oscillator.frequency.setValueAtTime(145, now);
        oscillator.frequency.exponentialRampToValueAtTime(85, now + 0.055);
        gain.gain.setValueAtTime(0.0001, now);
        gain.gain.exponentialRampToValueAtTime(0.2, now + 0.006);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.065);
        oscillator.connect(gain);
        gain.connect(audioContext.destination);
        oscillator.start(now);
        oscillator.stop(now + 0.07);
      };

      const spinStartedAt = performance.now();
      const scheduleTick = () => {
        const elapsed = performance.now() - spinStartedAt;
        if (elapsed >= spinDuration) return;

        playTick();
        const progress = Math.min(elapsed / spinDuration, 1);
        const nextDelay = 75 + (progress ** 2) * 375;
        spinSoundTimerRef.current = window.setTimeout(scheduleTick, nextDelay);
      };

      audioContext.resume();
      window.clearTimeout(spinSoundTimerRef.current);
      scheduleTick();
    }

    const winningNumber = getRandomNumber(selectedRange.max);
    const segmentStep = 360 / selectedRange.max;
    const winnerCenterAngle = POINTER_ANGLE + (winningNumber - 0.5) * segmentStep;
    const currentWheelAngle = winnerCenterAngle + rotation;
    const correction = (POINTER_ANGLE - currentWheelAngle + 360) % 360;
    const nextRotation = rotation + 360 * 6 + correction;

    window.clearTimeout(timerRef.current);
    setResult(null);
    setIsSpinning(true);
    setRotation(nextRotation);

    timerRef.current = window.setTimeout(() => {
      window.clearInterval(spinSoundTimerRef.current);
      setResult(winningNumber);
      setIsSpinning(false);
      setIsResultOpen(true);
      playVictorySound();
    }, spinDuration);
  };

  const enableManualMode = () => {
    if (isSpinning) return;
    setIsManualMode(true);
    setManualNumber('');
    setResult(null);
    setIsResultOpen(false);
  };

  const showManualNumber = () => {
    const selectedNumber = Number(manualNumber);
    if (!Number.isInteger(selectedNumber) || selectedNumber < 1 || selectedNumber > 100) return;

    setResult(selectedNumber);
    setIsResultOpen(true);
  };

  return (
    <main className="number-wheel-page mx-auto flex min-h-[calc(100dvh-4rem)] w-full max-w-3xl flex-col px-2 pb-5 pt-2 sm:px-5">
      <section className="number-wheel-panel flex flex-1 flex-col items-center overflow-hidden rounded-[2rem] px-3 py-4 shadow-2xl sm:px-8 sm:py-6">
        <div className="number-wheel-title-wrap w-full text-center">
          <h1 className="number-wheel-title">Numbers</h1>
        </div>

        <Wheel max={selectedRange.max} rotation={rotation} onSpin={spin} isSpinning={isSpinning} disableTransition={isResetting} />

        <div className="number-wheel-controls w-full max-w-sm rounded-2xl bg-slate-950/70 p-2" role="group" aria-label="Seleccionar rango o modo manual">
          <p className="number-wheel-controls-label">Rango de números</p>
          <div className="grid grid-cols-3 gap-2">
            {RANGES.map((range) => (
              <button
                key={range.id}
                type="button"
                className={`rounded-xl px-3 py-2.5 text-base font-black transition-colors ${!isManualMode && rangeId === range.id ? 'bg-amber-300 text-slate-950' : 'text-slate-300 hover:bg-white/10'} disabled:cursor-not-allowed disabled:opacity-50`}
                disabled={isSpinning}
                aria-pressed={rangeId === range.id}
                onClick={() => changeRange(range.id)}
              >
                {range.label}
              </button>
            ))}
            <button
              type="button"
              className={`rounded-xl px-2 py-2.5 text-sm font-black transition-colors ${isManualMode ? 'bg-amber-300 text-slate-950' : 'text-slate-300 hover:bg-white/10'} disabled:cursor-not-allowed disabled:opacity-50`}
              disabled={isSpinning}
              aria-pressed={isManualMode}
              onClick={enableManualMode}
            >
              Manual
            </button>
          </div>
        </div>

        {isManualMode && (
          <form
            className="number-wheel-manual-panel grid w-full max-w-sm grid-cols-[1fr_auto] gap-2 rounded-2xl bg-slate-950/90 p-2"
            onSubmit={(event) => {
              event.preventDefault();
              showManualNumber();
            }}
          >
            <label className="sr-only" htmlFor="manual-number">Ingresar un número manual</label>
            <input
              id="manual-number"
              type="number"
              min="1"
              max="100"
              step="1"
              value={manualNumber}
              onChange={(event) => setManualNumber(event.target.value)}
              placeholder="1-100"
              className="min-w-0 rounded-xl border-2 border-slate-600 bg-white px-3 py-2 text-center text-lg font-black text-slate-950 outline-none focus:border-amber-300"
            />
            <button type="submit" className="rounded-xl bg-blue-600 px-3 py-2 text-sm font-black text-white transition-colors hover:bg-blue-500">
              Mostrar
            </button>
          </form>
        )}

      </section>

      {isResultOpen && (
        <div className="number-wheel-modal-backdrop" role="presentation">
          <div className="number-wheel-modal" role="dialog" aria-modal="true" aria-labelledby="number-wheel-modal-title">
            <button
              type="button"
              className="number-wheel-modal-close"
              onClick={() => setIsResultOpen(false)}
              aria-label="Cerrar resultado"
            >
              ×
            </button>
            <p id="number-wheel-modal-title" className="number-wheel-modal-label">The number is</p>
            <span className={`number-wheel-modal-number number-wheel-modal-number--${String(result).length}`}>{result}</span>
          </div>
        </div>
      )}
    </main>
  );
}
