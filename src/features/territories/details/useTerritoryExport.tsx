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
  TemplateTerritoryS12Card,
} from '@views/index';
import { TerritoryPrintData } from '@views/territories/index.types';
import { Territory } from '@definition/territory';
import { captureTerritoryMap } from '../map/capture';

export type ExportFormat = 's12' | 's12a4' | 'a5h' | 'a5v';

export type ExportParts = { front: boolean; back: boolean };

const FILE_SUFFIX: Record<ExportFormat, string> = {
  s12: '',
  s12a4: '-A4',
  a5h: '-A5-horizontal',
  a5v: '-A5-vertical',
};

const useTerritoryExport = (territory: Territory) => {
  const congregation = useAtomValue(congNameState);
  const locale = useAtomValue(JWLangLocaleState);
  const dateFormat = useAtomValue(shortDateFormatState);

  const isPhone = territory.type === 'phone';

  const [format, setFormat] = useState<ExportFormat>('s12');
  const [parts, setParts] = useState<ExportParts>({ front: true, back: true });
  const [showQr, setShowQr] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string>();

  const blob = useRef<Blob>(null);

  // the map picture is expensive to render, so the promise itself is kept:
  // every preview awaits the same capture instead of starting another one
  const mapImage = useRef<Promise<string | undefined>>(null);

  const build = useCallback(async () => {
    const needsMap = parts.front && !isPhone;

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
      },
    ];

    const props = {
      congregation,
      territories: data,
      lang: locale,
      printedOn: formatDate(new Date(), dateFormat),
      parts,
    };

    const document =
      format === 's12' ? (
        <TemplateTerritoryS12Card {...props} />
      ) : format === 's12a4' ? (
        <TemplateTerritoryS12 {...props} />
      ) : format === 'a5v' ? (
        <TemplateTerritoryCardVertical {...props} />
      ) : (
        <TemplateTerritoryCard {...props} />
      );

    return pdf(document).toBlob();
  }, [
    format,
    parts,
    isPhone,
    showQr,
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

  const handleExport = () => {
    if (!blob.current) return;

    const form =
      format === 's12' || format === 's12a4'
        ? `S-12${isPhone ? '-phone' : ''}`
        : 'Territory-card';

    const name = `${form}-${territory.number}${FILE_SUFFIX[format]}.pdf`;

    saveAs(blob.current, name);
  };

  // one side always stays in, so there is something to export
  const toggleSide = (side: keyof ExportParts) =>
    setParts((prev) => {
      const next = { ...prev, [side]: !prev[side] };
      return next.front || next.back ? next : prev;
    });

  return {
    isPhone,
    format,
    setFormat,
    parts,
    toggleSide,
    showQr,
    setShowQr,
    previewUrl,
    isProcessing,
    handleExport,
  };
};

export default useTerritoryExport;
