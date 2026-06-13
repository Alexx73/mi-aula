import React, { useEffect, useMemo, useRef, useState } from 'react';
import * as pdfjsLib from 'pdfjs-dist';
import pdfWorker from 'pdfjs-dist/build/pdf.worker.min.mjs?url';

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorker;

export default function PdfBookViewer({ src, fileName }) {
  const wrapperRef = useRef(null);
  const canvasRefs = useRef([]);
  const pdfDocRef = useRef(null);
  const hideTimerRef = useRef(null);
  const renderTokenRef = useRef(0);

  const [pageCount, setPageCount] = useState(0);
  const [containerWidth, setContainerWidth] = useState(0);
  const [zoom, setZoom] = useState(1);
  const [controlsVisible, setControlsVisible] = useState(true);
  const [loading, setLoading] = useState(true);

  const showControls = () => {
    setControlsVisible(true);
    if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
    hideTimerRef.current = setTimeout(() => setControlsVisible(false), 5000);
  };

  const downloadHref = useMemo(() => src, [src]);

  useEffect(() => {
    let cancelled = false;

    const loadPdf = async () => {
      setLoading(true);
      try {
        const doc = await pdfjsLib.getDocument(src).promise;
        if (cancelled) return;
        pdfDocRef.current = doc;
        setPageCount(doc.numPages);
        setLoading(false);
        showControls();
      } catch (error) {
        if (!cancelled) {
          console.error('Error loading PDF:', error);
          setLoading(false);
        }
      }
    };

    loadPdf();

    return () => {
      cancelled = true;
      if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
    };
  }, [src]);

  useEffect(() => {
    const el = wrapperRef.current;
    if (!el) return undefined;

    const updateWidth = () => {
      setContainerWidth(el.clientWidth);
    };

    updateWidth();

    const observer = new ResizeObserver(updateWidth);
    observer.observe(el);

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const renderPages = async () => {
      const pdfDoc = pdfDocRef.current;
      if (!pdfDoc || !pageCount || !containerWidth) return;

      const token = ++renderTokenRef.current;
      const dpr = window.devicePixelRatio || 1;
      const availableWidth = Math.max(240, containerWidth - 16);

      for (let index = 1; index <= pageCount; index += 1) {
        if (token !== renderTokenRef.current) return;

        const page = await pdfDoc.getPage(index);
        const baseViewport = page.getViewport({ scale: 1 });
        const scale = (availableWidth * zoom) / baseViewport.width;
        const viewport = page.getViewport({ scale });
        const canvas = canvasRefs.current[index - 1];

        if (!canvas) continue;

        const context = canvas.getContext('2d');
        if (!context) continue;

        canvas.width = Math.floor(viewport.width * dpr);
        canvas.height = Math.floor(viewport.height * dpr);
        canvas.style.width = `${Math.floor(viewport.width)}px`;
        canvas.style.height = `${Math.floor(viewport.height)}px`;

        await page.render({
          canvasContext: context,
          viewport,
          transform: dpr !== 1 ? [dpr, 0, 0, dpr, 0, 0] : undefined,
        }).promise;
      }
    };

    renderPages();
  }, [pageCount, containerWidth, zoom]);

  useEffect(() => {
    showControls();
  }, [zoom]);

  return (
    <div
      ref={wrapperRef}
      className="relative flex h-full min-h-0 flex-col overflow-hidden rounded-2xl border border-white/70 bg-white/85 shadow-md dark:border-white/10 dark:bg-gray-900/80"
      onPointerDown={showControls}
      onTouchStart={showControls}
    >
      <div className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden px-2 py-2">
        {loading ? (
          <div className="flex h-full items-center justify-center rounded-xl bg-black/5 text-sm font-semibold text-gray-600 dark:bg-white/5 dark:text-gray-300">
            Cargando cuadernillo...
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {Array.from({ length: pageCount }).map((_, index) => (
              <canvas
                key={`page-${index + 1}`}
                ref={(el) => {
                  canvasRefs.current[index] = el;
                }}
                className="mx-auto block rounded-lg bg-white shadow-sm"
              />
            ))}
          </div>
        )}
      </div>

      <div
        className={`absolute bottom-2 left-1/2 z-30 flex -translate-x-1/2 items-center gap-2 rounded-full bg-black/60 px-2 py-1 text-white shadow-lg backdrop-blur transition-opacity duration-200 ${
          controlsVisible ? 'opacity-100' : 'pointer-events-none opacity-0'
        }`}
      >
        <button
          type="button"
          onClick={() => {
            setZoom((prev) => Math.max(0.75, +(prev - 0.15).toFixed(2)));
            showControls();
          }}
          className="h-7 rounded-full bg-white/15 px-3 text-sm font-black leading-none"
        >
          -
        </button>
        <button
          type="button"
          onClick={() => {
            setZoom(1);
            showControls();
          }}
          className="h-7 rounded-full bg-white/15 px-2.5 text-[10px] font-black leading-none"
        >
          100%
        </button>
        <button
          type="button"
          onClick={() => {
            setZoom((prev) => Math.min(2, +(prev + 0.15).toFixed(2)));
            showControls();
          }}
          className="h-7 rounded-full bg-white/15 px-3 text-sm font-black leading-none"
        >
          +
        </button>
        <a
          href={downloadHref}
          download={fileName}
          className="ml-1 inline-flex h-7 items-center rounded-full bg-blue-600 px-3 text-[10px] font-black leading-none text-white"
        >
          Descargar
        </a>
      </div>
    </div>
  );
}
