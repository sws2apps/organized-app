import { useCallback, useEffect, useRef, useState } from 'react';
import { useAtomValue } from 'jotai';
import { pdf } from '@react-pdf/renderer';
import { saveAs } from 'file-saver';
import {
  congNameState,
  JWLangLocaleState,
  shortDateFormatState,
} from '@states/settings';
import { displaySnackNotification } from '@services/states/app';
import { formatDate } from '@utils/date';
import { TemplateTerritoryCard, TemplateTerritoryS12 } from '@views/index';
import { TerritoryPrintData } from '@views/territories/index.types';
import { Territory } from '@definition/territory';
import { captureTerritoryMap } from '../map/capture';

export type PrintTemplate = 's12' | 'a5';

const useTerritoryPrint = (territory: Territory) => {
  const congregation = useAtomValue(congNameState);
  const locale = useAtomValue(JWLangLocaleState);
  const dateFormat = useAtomValue(shortDateFormatState);

  const [template, setTemplate] = useState<PrintTemplate>('s12');
  const [showMap, setShowMap] = useState(true);
  const [notes, setNotes] = useState('');
  const [printedNotes, setPrintedNotes] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string>();

  const frame = useRef<HTMLIFrameElement>(null);
  const blob = useRef<Blob>(null);

  // the map picture is expensive to render, so the promise itself is kept:
  // every preview awaits the same capture instead of starting another one
  const mapImage = useRef<Promise<string | undefined>>(null);

  // every keystroke would rebuild the whole PDF, so the notes settle first
  useEffect(() => {
    const timer = setTimeout(() => setPrintedNotes(notes), 400);

    return () => clearTimeout(timer);
  }, [notes]);

  const build = useCallback(async () => {
    const needsMap = showMap;

    if (needsMap && !mapImage.current) {
      mapImage.current = captureTerritoryMap(territory);
    }

    const picture =
      needsMap && mapImage.current ? await mapImage.current : undefined;

    const data: TerritoryPrintData[] = [
      {
        ...territory,
        mapImage: picture,
        notes: printedNotes.trim() || undefined,
      },
    ];

    const printedOn = formatDate(new Date(), dateFormat);

    const document =
      template === 's12' ? (
        <TemplateTerritoryS12
          congregation={congregation}
          territories={data}
          lang={locale}
          printedOn={printedOn}
          showMap={showMap}
        />
      ) : (
        <TemplateTerritoryCard
          congregation={congregation}
          territories={data}
          lang={locale}
          printedOn={printedOn}
          showMap={showMap}
        />
      );

    return pdf(document).toBlob();
  }, [
    template,
    showMap,
    printedNotes,
    territory,
    congregation,
    locale,
    dateFormat,
  ]);

  useEffect(() => {
    let cancelled = false;
    let url: string | undefined;

    const render = async () => {
      setIsProcessing(true);

      try {
        const result = await build();
        if (cancelled) return;

        blob.current = result;
        url = URL.createObjectURL(result);
        setPreviewUrl(url);
      } catch (error) {
        if (!cancelled) {
          displaySnackNotification({
            header: 'Preview failed',
            message: (error as Error).message,
            severity: 'error',
          });
        }
      } finally {
        if (!cancelled) setIsProcessing(false);
      }
    };

    render();

    return () => {
      cancelled = true;
      if (url) URL.revokeObjectURL(url);
    };
  }, [build]);

  const handleDownload = () => {
    if (!blob.current) return;

    const name =
      template === 's12'
        ? `S-12-${territory.number}.pdf`
        : `Territory-card-${territory.number}.pdf`;

    saveAs(blob.current, name);
  };

  const handlePrint = () => frame.current?.contentWindow?.print();

  return {
    template,
    setTemplate,
    showMap,
    setShowMap,
    notes,
    setNotes,
    previewUrl,
    isProcessing,
    frame,
    handleDownload,
    handlePrint,
  };
};

export default useTerritoryPrint;
