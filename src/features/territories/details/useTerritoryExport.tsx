import { ReactElement, useCallback, useEffect, useRef, useState } from 'react';
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
import {
  TerritoryPrintData,
  TerritoryTemplateProps,
} from '@views/territories/index.types';
import { CARD } from '@views/territories/index.styles';
import { Territory } from '@definition/territory';
import { captureTerritoryMap } from '../map/capture';

export type ExportFormat = 's12' | 's12a4' | 'a5h' | 'a5v';

export type ExportParts = { front: boolean; back: boolean };

const TEMPLATES: Record<
  ExportFormat,
  (props: TerritoryTemplateProps) => ReactElement
> = {
  s12: TemplateTerritoryS12Card,
  s12a4: TemplateTerritoryS12,
  a5h: TemplateTerritoryCard,
  a5v: TemplateTerritoryCardVertical,
};

const cardMapRatio = (width: number, height: number) =>
  (width - CARD.padding * 2) / (height - CARD.mapTop - CARD.footerHeight);

// the map frame of each layout (page sizes as in the templates), so the picture is never cropped
const MAP_RATIO: Record<ExportFormat, number> = {
  s12: cardMapRatio(467, 301),
  s12a4: cardMapRatio(467, 301),
  a5h: cardMapRatio(575, 400),
  a5v: 421 / 530,
};

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
  const [preview, setPreview] = useState<Blob>();

  const blob = useRef<Blob>(null);

  // kept as promises so every preview of a layout awaits the same capture
  const mapImages = useRef(new Map<number, Promise<string | undefined>>());

  const build = useCallback(async () => {
    const needsMap = parts.front && !isPhone;

    const ratio = MAP_RATIO[format];

    if (needsMap && !mapImages.current.has(ratio)) {
      mapImages.current.set(ratio, captureTerritoryMap(territory, ratio));
    }

    const picture = needsMap ? await mapImages.current.get(ratio) : undefined;

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

    const Template = TEMPLATES[format];

    return pdf(<Template {...props} />).toBlob();
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

    const render = async () => {
      setIsProcessing(true);

      try {
        const result = await build();
        if (cancelled) return;

        blob.current = result;
        setPreview(result);
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
    };
  }, [build]);

  const handleExport = () => {
    if (!blob.current) return;

    const isS12 = format === 's12' || format === 's12a4';
    const phone = isPhone ? '-phone' : '';
    const form = isS12 ? `S-12${phone}` : 'Territory-card';

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
    preview,
    isProcessing,
    handleExport,
  };
};

export default useTerritoryExport;
