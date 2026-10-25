import useTerritoryAccess from '@features/territories/useTerritoryAccess';
import { useAppTranslation } from '@hooks/index';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useAtomValue } from 'jotai';
import { pdf } from '@react-pdf/renderer';
import { exportFile } from '@services/files/export';
import { getI18n } from 'react-i18next';
import { s13Rows } from '@features/territories/history/s13_rows';
import { territoryAssigneesState } from '@features/territories/assignees';
import { withGroupHolders } from '@features/territories/group_holder';
import { JWLangLocaleState, shortDateFormatState } from '@states/settings';
import { territoriesState } from '@states/territories';
import { displaySnackNotification } from '@services/states/app';
import { getMessageByCode } from '@services/i18n/translation';
import { formatDate } from '@utils/date';
import { TemplateS13 } from '@views/index';
const useExportS13 = (markCampaigns: boolean) => {
  const { t } = useAppTranslation();
  const { editor } = useTerritoryAccess();

  const assignees = useAtomValue(territoryAssigneesState);
  const territories = useAtomValue(territoriesState);
  const lang = useAtomValue(JWLangLocaleState);
  const dateFormat = useAtomValue(shortDateFormatState);

  const language = getI18n().language;
  const [attempt, setAttempt] = useState(0);
  const [saving, setSaving] = useState(false);
  const savingRef = useRef(false);
  const input = useMemo(
    () => ({
      territories,
      assignees,
      lang,
      dateFormat,
      language,
      markCampaigns,
      attempt,
    }),
    [territories, assignees, lang, dateFormat, language, markCampaigns, attempt]
  );
  const [result, setResult] = useState<{
    input: typeof input;
    blob?: Blob;
    failed?: boolean;
  }>();

  // Prepare before the click: file pickers require the export to retain user activation.
  useEffect(() => {
    if (!editor) return;
    let cancelled = false;
    const prepare = async () => {
      const {
        territories,
        assignees,
        lang,
        dateFormat,
        language,
        markCampaigns,
      } = input;
      const grouped = withGroupHolders(
        territories,
        assignees.filter((item) => item.group).map(({ name }) => name)
      );
      const campaignMark = language.startsWith('de') ? 'A' : 'C';
      try {
        const rows = [...grouped]
          .sort((a, b) =>
            a.number.localeCompare(b.number, undefined, { numeric: true })
          )
          .flatMap((territory) =>
            s13Rows(territory, dateFormat, markCampaigns ? campaignMark : '')
          );

        const blob = await pdf(
          <TemplateS13
            createdOn={formatDate(new Date(), dateFormat)}
            rows={rows}
            lang={lang}
          />
        ).toBlob();

        if (!cancelled) setResult({ input, blob });
      } catch {
        if (!cancelled) setResult({ input, failed: true });
      }
    };
    void prepare();
    return () => {
      cancelled = true;
    };
  }, [input, editor]);

  const current = result?.input === input ? result : undefined;
  const isPreparing = editor && !current;
  const handleExport = async () => {
    if (!editor || !current?.blob || savingRef.current) return false;
    savingRef.current = true;
    setSaving(true);
    try {
      return await exportFile(
        current.blob,
        `S-13_${formatDate(new Date(), 'yyyy-MM-dd')}.pdf`
      );
    } catch (error) {
      displaySnackNotification({
        header: getMessageByCode('error_app_generic-title'),
        message: t((error as Error).message, {
          defaultValue: t(
            'tr_territoryTheTerritoryDocumentCouldNotBeGeneratedTryAgain'
          ),
        }),
        severity: 'error',
      });
      return false;
    } finally {
      savingRef.current = false;
      setSaving(false);
    }
  };

  return {
    handleExport,
    isProcessing: isPreparing || saving,
    failed: !!current?.failed,
    retry: () => setAttempt((value) => value + 1),
  };
};

export default useExportS13;
