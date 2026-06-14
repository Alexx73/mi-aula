import React, { useEffect, useRef, useState } from 'react';
import * as pdfjsLib from 'pdfjs-dist';
import pdfWorker from 'pdfjs-dist/build/pdf.worker.min.mjs?url';

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorker;

const DEFAULT_LOADING_LABEL = 'Cargando PDF...';
const DEFAULT_ERROR_LABEL = 'No se pudo cargar el PDF.';

export default function PdfViewer({
  src,
  loadingLabel = DEFAULT_LOADING_LABEL,
  errorLabel = DEFAULT_ERROR_LABEL,
  className = '',
  viewerClassName = '',
  canvasClassName = '',
}) {
  const wrapperRef = useRef(null);
  const canvasRefs = useRef([]);
  const pdfDocRef = useRef(null);
  const renderTokenRef = useRef(0);

  const [pageCount, setPageCount] = useState(0);
  const [containerWidth, setContainerWidth] = useState(0);
  const [zoom, setZoom] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const showControls = () => {
    // Intentionally kept for interaction feedback hooks.
  };

  useEffect(() => {
    let cancelled = false;

    const cleanupPdf = async () => {
      if (pdfDocRef.current) {
        const doc = pdfDocRef.current;
        pdfDocRef.current = null;
        await doc.destroy().catch(() => {});
      }
    };

    const loadPdf = async () => {
      setLoading(true);
      setError('');
      setPageCount(0);
      pdfDocRef.current = null;
      canvasRefs.current = [];

      try {
        const response = await fetch(src);
        if (!response.ok) {
          throw new Error(`No se pudo cargar el PDF: ${response.status}`);
        }

        const buffer = await response.arrayBuffer();
        const doc = await pdfjsLib.getDocument({ data: new Uint8Array(buffer) }).promise;
        if (cancelled) {
          await doc.destroy().catch(() => {});
          return;
        }

        pdfDocRef.current = doc;
        setPageCount(doc.numPages);
        setLoading(false);
        showControls();
      } catch (loadError) {
        if (!cancelled) {
          console.error('Error loading PDF:', loadError);
          setError(errorLabel);
          setLoading(false);
        }
      }
    };

    loadPdf();

    return () => {
      cancelled = true;
      cleanupPdf();
    };
  }, [src, errorLabel]);

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

  return (
    <div
      ref={wrapperRef}
      className={`relative flex h-full min-h-0 flex-col overflow-hidden rounded-2xl border border-white/70 bg-white/85 shadow-md dark:border-white/10 dark:bg-gray-900/80 ${className}`}
      onPointerDown={showControls}
      onTouchStart={showControls}
    >
      <div className={`flex-1 min-h-0 overflow-y-auto overflow-x-hidden px-2 py-2 ${viewerClassName}`}>
        {loading ? (
          <div className="flex h-full items-center justify-center rounded-xl bg-black/5 text-sm font-semibold text-gray-600 dark:bg-white/5 dark:text-gray-300">
            {loadingLabel}
          </div>
        ) : error ? (
          <div className="flex h-full items-center justify-center rounded-xl bg-black/5 px-4 text-center text-sm font-semibold text-gray-600 dark:bg-white/5 dark:text-gray-300">
            {error}
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {Array.from({ length: pageCount }).map((_, index) => (
              <canvas
                key={`page-${index + 1}`}
                ref={(el) => {
                  canvasRefs.current[index] = el;
                }}
                className={`mx-auto block rounded-lg bg-white shadow-sm ${canvasClassName}`}
              />
            ))}
          </div>
        )}
      </div>

      <div
        className="fixed bottom-4 left-1/2 z-50 flex -translate-x-1/2 items-center gap-2 rounded-full bg-black/70 px-2 py-1 text-white shadow-xl shadow-black/30 backdrop-blur"
      >
        <button
          type="button"
          onClick={() => {
            setZoom((prev) => Math.max(0.75, +(prev - 0.15).toFixed(2)));
            showControls();
          }}
          className="h-7 rounded-full bg-rose-500 px-3 text-sm font-black leading-none text-white shadow-sm shadow-rose-500/40 transition-colors hover:bg-rose-400"
        >
          -
        </button>
        <button
          type="button"
          onClick={() => {
            setZoom(1);
            showControls();
          }}
          className="h-7 rounded-full bg-amber-500 px-2.5 text-[10px] font-black leading-none text-white shadow-sm shadow-amber-500/40 transition-colors hover:bg-amber-400"
        >
          100%
        </button>
        <button
          type="button"
          onClick={() => {
            setZoom((prev) => Math.min(2, +(prev + 0.15).toFixed(2)));
            showControls();
          }}
          className="h-7 rounded-full bg-emerald-500 px-3 text-sm font-black leading-none text-white shadow-sm shadow-emerald-500/40 transition-colors hover:bg-emerald-400"
        >
          +
        </button>
      </div>
    </div>
  );
}
