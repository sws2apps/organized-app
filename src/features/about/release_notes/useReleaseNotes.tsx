import { useMemo, useState } from 'react';
import { useAtomValue } from 'jotai';
import { useAppTranslation } from '@hooks/index';
import { RELEASE_NOTES_MAX, RELEASE_NOTES_VERSIONS } from '@constants/index';
import { ReleaseNoteType } from '@definition/app';
import { appLangState } from '@states/app';
import { shortDateFormatState } from '@states/settings';
import { formatDate } from '@utils/date';
import { ReleaseNote } from './index.types';

const useReleaseNotes = () => {
  const { i18n } = useAppTranslation();

  const appLang = useAtomValue(appLangState);
  const shortDateFormat = useAtomValue(shortDateFormatState);

  const notes = useMemo(() => {
    const resources = i18n.options.resources ?? {};

    const fallback = (resources.eng?.releases ?? {}) as ReleaseNoteType;
    const localized = (resources[appLang ?? 'eng']?.releases ??
      {}) as ReleaseNoteType;

    return Object.keys(RELEASE_NOTES_VERSIONS)
      .filter((key) => fallback[key])
      .sort((a, b) => b.localeCompare(a))
      .slice(0, RELEASE_NOTES_MAX)
      .map((key): ReleaseNote => {
        const { images, improvements } = localized[key] ?? fallback[key];
        const { version, date } = RELEASE_NOTES_VERSIONS[key];

        return {
          key,
          version,
          date: formatDate(new Date(date), shortDateFormat),
          features: Object.values(images ?? {}),
          improvements: Object.values(improvements ?? {}),
        };
      });
  }, [i18n, appLang, shortDateFormat]);

  const [expanded, setExpanded] = useState<string | false>(
    notes.at(0)?.key ?? false
  );

  const handleExpand = (value: string | false) => setExpanded(value);

  return { notes, expanded, handleExpand };
};

export default useReleaseNotes;
