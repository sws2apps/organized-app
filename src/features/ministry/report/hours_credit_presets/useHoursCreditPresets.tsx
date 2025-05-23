import { useMemo, useState } from 'react';
import { useLocation } from 'react-router';
import {
  IconDuties,
  IconLanguageCourse,
  IconSchool,
  IconSchoolForEvangelizers,
} from '@components/icons';
import { useAppTranslation } from '@hooks/index';

const useHoursCreditPresets = () => {
  const location = useLocation();

  const { t } = useAppTranslation();

  const [presetsOpen, setPresetsOpen] = useState(false);

  const presets = useMemo(() => {
    const list = [
      {
        icon: <IconSchool color="var(--black)" />,
        name: t('tr_pioneerSchool'),
        value: 30,
      },
      {
        icon: <IconSchoolForEvangelizers color="var(--black)" />,
        name: t('tr_SKE'),
        value: 160,
      },
      {
        icon: <IconLanguageCourse color="var(--black)" />,
        name: t('tr_languageCourse'),
        value: 25,
      },
    ];

    if (location.pathname === '/ministry-report') {
      list.push({
        icon: <IconDuties color="var(--black)" />,
        name: t('tr_theocraticAssignments'),
        value: 8,
      });
    }

    return list;
  }, [t, location.pathname]);

  const handleTogglePresets = () => setPresetsOpen((prev) => !prev);

  const handleClosePreset = () => setPresetsOpen(false);

  return { presetsOpen, handleTogglePresets, presets, handleClosePreset };
};

export default useHoursCreditPresets;
