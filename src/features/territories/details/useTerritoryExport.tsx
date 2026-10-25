import { useAppTranslation } from '@hooks/index';
import {
  A5_HORIZONTAL,
  A5_VERTICAL,
  MAP_LABEL_SPACE,
  printableA5,
} from '@views/territories/geometry';
import { ReactElement, useCallback, useEffect, useRef, useState } from 'react';
import { useAtomValue } from 'jotai';
import { pdf } from '@react-pdf/renderer';
import { exportFile } from '@services/files/export';
import {
  congNameState,
  JWLangLocaleState,
  shortDateFormatState,
} from '@states/settings';
import { territoriesShowDoNotCallMapState } from '@states/territories';
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
import { captureTerritoryMap } from '@features/territories/map/capture';

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
  a5h: cardMapRatio(
    printableA5(A5_HORIZONTAL).width,
    printableA5(A5_HORIZONTAL).height
  ),
  a5v: printableA5(A5_VERTICAL).width / printableA5(A5_VERTICAL).height,
};

// the longer side of each printed map frame, in points
const MAP_LONG_SIDE: Record<ExportFormat, number> = {
  s12: 467 - CARD.padding * 2,
  s12a4: 467 - CARD.padding * 2,
  a5h: printableA5(A5_HORIZONTAL).width - CARD.padding * 2,
  a5v: printableA5(A5_VERTICAL).height,
};

// houses and their numbers only fit on the larger A5 maps
const MAP_DETAIL: Record<ExportFormat, boolean> = {
  s12: false,
  s12a4: false,
  a5h: true,
  a5v: true,
};

// the A5 portrait map fills the card, and its label covers the bottom
const MAP_INSET: Record<ExportFormat, number> = {
  s12: 0,
  s12a4: 0,
  a5h: 0,
  a5v: MAP_LABEL_SPACE / printableA5(A5_VERTICAL).height,
};

const FILE_SUFFIX: Record<ExportFormat, string> = {
  s12: '',
  s12a4: 'tr_territoryA4',
  a5h: 'tr_territoryA5Horizontal',
  a5v: 'tr_territoryA5Vertical',
};

const useTerritoryExport = (territory: Territory) => {
  const { t } = useAppTranslation();

  const congregation = useAtomValue(congNameState);
  const locale = useAtomValue(JWLangLocaleState);
  const dateFormat = useAtomValue(shortDateFormatState);
  const showDoNotCalls = useAtomValue(territoriesShowDoNotCallMapState);

  const isPhone = territory.type === 'phone';

  const [format, setFormat] = useState<ExportFormat>('s12a4');
  const [parts, setParts] = useState<ExportParts>({ front: true, back: true });
  const [showHouseholds, setShowHouseholds] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string>();

  const blob = useRef<Blob>(null);

  // kept as promises so every preview of a layout awaits the same capture
  const mapImages = useRef(
    new Map<ExportFormat, Promise<string | undefined>>()
  );

  useEffect(() => {
    mapImages.current.clear();
  }, [territory, showDoNotCalls]);

  const build = useCallback(async () => {
    const needsMap = parts.front && !isPhone;

    if (needsMap && !mapImages.current.has(format)) {
      mapImages.current.set(
        format,
        captureTerritoryMap(
          territory,
          MAP_RATIO[format],
          MAP_INSET[format],
          MAP_LONG_SIDE[format],
          MAP_DETAIL[format],
          showDoNotCalls
        )
      );
    }

    const picture = needsMap ? await mapImages.current.get(format) : undefined;

    const data: TerritoryPrintData[] = [
      {
        ...territory,
        // a warning of only spaces would print an empty red chip
        warning: territory.warning?.trim() || undefined,
        mapImage: picture,
        showHouseholds,
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
    showHouseholds,
    territory,
    congregation,
    locale,
    dateFormat,
    showDoNotCalls,
  ]);

  useEffect(() => {
    let cancelled = false;
    let url: string | undefined;

    const render = async () => {
      setIsProcessing(true);
      blob.current = null;
      setPreviewUrl(undefined);

      try {
        const result = await build();
        if (cancelled) return;

        blob.current = result;
        url = URL.createObjectURL(result);
        setPreviewUrl(url);
      } catch (error) {
        if (!cancelled) {
          displaySnackNotification({
            header: t('tr_territoryPreviewFailed'),
            message: t((error as Error).message, {
              defaultValue: t(
                'tr_territoryTheTerritoryDocumentCouldNotBeGeneratedTryAgain'
              ),
            }),
            severity: 'error',
          });
        }
      } finally {
        if (!cancelled) setIsProcessing(false);
      }
    };

    void render();

    return () => {
      cancelled = true;
      if (url) URL.revokeObjectURL(url);
    };
  }, [build, t]);

  const handleExport = async () => {
    if (!blob.current || isExporting) return false;
    setIsExporting(true);

    const isS12 = format === 's12' || format === 's12a4';
    const phone = isPhone ? '-phone' : '';
    const form = isS12 ? `S-12${phone}` : t('tr_territoryTerritoryCard');
    const suffix = FILE_SUFFIX[format] && ` ${t(FILE_SUFFIX[format])}`;

    // file names follow the app language, spaces as dashes: Gebietskarte-O20-A5-hoch.pdf
    const name =
      `${form} ${territory.number}${suffix}`.replace(/\s+/g, '-') + '.pdf';

    try {
      return await exportFile(blob.current, name);
    } catch (error) {
      displaySnackNotification({
        header: t('tr_territoryExportFailed'),
        message: t((error as Error).message, {
          defaultValue: t(
            'tr_territoryTheTerritoryDocumentCouldNotBeGeneratedTryAgain'
          ),
        }),
        severity: 'error',
      });
      return false;
    } finally {
      setIsExporting(false);
    }
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
    showHouseholds,
    setShowHouseholds,
    previewUrl,
    isProcessing,
    isExporting,
    handleExport,
  };
};

export default useTerritoryExport;
