import { useAppTranslation, useScrollFade } from '@hooks/index';
import type { PDFDocumentLoadingTask, RenderTask } from 'pdfjs-dist';
import pdfWorker from 'pdfjs-dist/legacy/build/pdf.worker.min.mjs?worker&url';
import { useEffect, useRef, useState } from 'react';
import { Box } from '@mui/material';
import { Typography } from '@components/index';

// embedded browsers and Android WebViews show a PDF in an iframe as a blank
// box, so the pages are drawn onto canvases instead
const PdfPreview = ({
  url,
  onSettled,
}: {
  url?: string;
  onSettled?: (url: string) => void;
}) => {
  const { t } = useAppTranslation();

  const scrollRef = useScrollFade();
  const pages = useRef<HTMLDivElement>(null);

  const [failed, setFailed] = useState(false);
  const settled = useRef(onSettled);
  useEffect(() => {
    settled.current = onSettled;
  }, [onSettled]);

  useEffect(() => {
    const host = pages.current;
    if (!url || !host) return;

    let cancelled = false;
    let loading: PDFDocumentLoadingTask | undefined;
    let rendering: RenderTask | undefined;
    let destruction: Promise<void> | undefined;
    const canvases: HTMLCanvasElement[] = [];
    const destroy = () => {
      if (loading && !destruction)
        destruction = loading.destroy().catch(() => undefined);
      return destruction;
    };
    setFailed(false);

    const render = async () => {
      const pdfjs = await import('pdfjs-dist/legacy/build/pdf.mjs');
      pdfjs.GlobalWorkerOptions.workerSrc = pdfWorker;

      if (cancelled) return;
      loading = pdfjs.getDocument({ url });
      const document = await loading.promise;
      if (cancelled) return;

      for (let number = 1; number <= document.numPages; number++) {
        if (cancelled) return;
        const page = await document.getPage(number);
        if (cancelled) return;
        const width = page.getViewport({ scale: 1 }).width;

        const viewport = page.getViewport({
          scale:
            (Math.max(host.clientWidth, 1) / width) *
            Math.min(window.devicePixelRatio || 1, 1.5),
        });

        const canvas = window.document.createElement('canvas');
        canvas.width = viewport.width;
        canvas.height = viewport.height;
        // each page sits in its own frame, like the sheet it prints on
        canvas.style.width = '100%';
        canvas.style.display = 'block';
        canvas.style.boxSizing = 'border-box';
        canvas.style.backgroundColor = '#FFFFFF';
        canvas.style.border = '1px solid var(--accent-200)';
        canvas.style.borderRadius = 'var(--radius-l)';

        canvases.push(canvas);
        rendering = page.render({ canvas, viewport });
        try {
          await rendering.promise;
        } finally {
          rendering = undefined;
          page.cleanup();
        }
        if (cancelled) return;
      }

      host.replaceChildren(...canvases);
      setFailed(false);
      settled.current?.(url);
    };

    render()
      .catch(() => {
        if (!cancelled) {
          setFailed(true);
          settled.current?.(url);
        }
      })
      .finally(destroy);

    return () => {
      cancelled = true;
      rendering?.cancel();
      void destroy();
      for (const canvas of canvases) {
        canvas.width = 0;
        canvas.height = 0;
      }
      host.replaceChildren();
    };
  }, [url]);

  return (
    <Box
      ref={scrollRef}
      className="scroll-fade-y"
      sx={{ minHeight: 0, overflowY: 'auto' }}
    >
      {failed && (
        <Typography
          className="body-small-regular"
          color="var(--grey-400)"
          sx={{ padding: '16px', textAlign: 'center' }}
        >
          {t('tr_territoryThePreviewCouldNotBeShownSaveThePDF')}
        </Typography>
      )}

      <Box
        ref={pages}
        sx={{ display: 'flex', flexDirection: 'column', gap: '12px' }}
      />
    </Box>
  );
};

export default PdfPreview;
