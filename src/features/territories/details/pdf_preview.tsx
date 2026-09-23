import { useEffect, useRef, useState } from 'react';
import { Box } from '@mui/material';
import { Typography } from '@components/index';

// embedded browsers and Android WebViews show a PDF in an iframe as a blank
// box, so the pages are drawn onto canvases instead
const PdfPreview = ({ url }: { url?: string }) => {
  const pages = useRef<HTMLDivElement>(null);

  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const host = pages.current;
    if (!url || !host) return;

    let cancelled = false;

    const render = async () => {
      const [pdfjs, worker] = await Promise.all([
        import('pdfjs-dist'),
        import('pdfjs-dist/build/pdf.worker.min.mjs?url'),
      ]);

      pdfjs.GlobalWorkerOptions.workerSrc = worker.default;

      const document = await pdfjs.getDocument({ url }).promise;
      const canvases: HTMLCanvasElement[] = [];

      for (let number = 1; number <= document.numPages; number++) {
        const page = await document.getPage(number);
        const width = page.getViewport({ scale: 1 }).width;

        const viewport = page.getViewport({
          scale: (host.clientWidth / width) * (window.devicePixelRatio || 1),
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

        await page.render({ canvas, viewport }).promise;
        if (cancelled) return;

        canvases.push(canvas);
      }

      host.replaceChildren(...canvases);
      setFailed(false);
    };

    render().catch(() => {
      if (!cancelled) setFailed(true);
    });

    return () => {
      cancelled = true;
    };
  }, [url]);

  return (
    <Box sx={{ minHeight: 0, overflowY: 'auto' }}>
      {failed && (
        <Typography
          className="body-small-regular"
          color="var(--grey-400)"
          sx={{ padding: '16px', textAlign: 'center' }}
        >
          The preview could not be shown. Save the PDF to check it.
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
