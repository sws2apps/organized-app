import { useCallback, useEffect, useRef, useState } from 'react';
import { useAtomValue } from 'jotai';
import { pdf } from '@react-pdf/renderer';
import { saveAs } from 'file-saver';
import QRCode from 'qrcode';
import {
  congNameState,
  JWLangLocaleState,
  shortDateFormatState,
} from '@states/settings';
import { displaySnackNotification } from '@services/states/app';
import { formatDate } from '@utils/date';
import {
  TemplateTerritoryCard,
  TemplateTerritoryCardVertical,
  TemplateTerritoryS12,
} from '@views/index';
import { TerritoryPrintData } from '@views/territories/index.types';
import { Territory } from '@definition/territory';
import { captureTerritoryMap } from '../map/capture';

export type PrintTemplate = 's12' | 'phone' | 'a5' | 'a5v';

const useTerritoryPrint = (territory: Territory) => {
  const congregation = useAtomValue(congNameState);
  const locale = useAtomValue(JWLangLocaleState);
  const dateFormat = useAtomValue(shortDateFormatState);

  // a phone territory has no map, so it only ever prints as the phone card
  const [template, setTemplate] = useState<PrintTemplate>(
    territory.type === 'phone' ? 'phone' : 's12'
  );
  const [showMap, setShowMap] = useState(true);
  const [showQr, setShowQr] = useState(true);
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
    const needsMap = showMap && territory.type !== 'phone';

    if (needsMap && !mapImage.current) {
      mapImage.current = captureTerritoryMap(territory);
    }

    const picture =
      needsMap && mapImage.current ? await mapImage.current : undefined;

    // scanning the card opens this territory in the app
    const qrImage = showQr
      ? await QRCode.toDataURL(
          `${window.location.origin}/#/territories/${territory.id}`,
          { margin: 0 }
        )
      : undefined;

    const data: TerritoryPrintData[] = [
      {
        ...territory,
        mapImage: picture,
        qrImage,
        notes: printedNotes.trim() || undefined,
      },
    ];

    const props = {
      congregation,
      territories: data,
      lang: locale,
      printedOn: formatDate(new Date(), dateFormat),
      showMap,
    };

    const document =
      template === 's12' || template === 'phone' ? (
        <TemplateTerritoryS12 {...props} />
      ) : template === 'a5v' ? (
        <TemplateTerritoryCardVertical {...props} />
      ) : (
        <TemplateTerritoryCard {...props} />
      );

    return pdf(document).toBlob();
  }, [
    template,
    showMap,
    showQr,
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
        : template === 'phone'
          ? `S-12-phone-${territory.number}.pdf`
          : `Territory-card-${territory.number}-${template}.pdf`;

    saveAs(blob.current, name);
  };

  const handlePrint = () => frame.current?.contentWindow?.print();

  return {
    template,
    setTemplate,
    showMap,
    setShowMap,
    showQr,
    setShowQr,
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
