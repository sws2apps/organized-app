import { useCallback, useMemo, useState } from 'react';
import { UpdateSpec } from 'dexie';
import { useAtomValue } from 'jotai';
import {
  LivingAsChristiansType,
  SourceAssignmentType,
  SourceWeekType,
} from '@definition/sources';
import { useAppTranslation } from '@hooks/index';
import { sourcesState } from '@states/sources';
import { schedulesState } from '@states/schedules';
import {
  JWLangLocaleState,
  JWLangState,
  userDataViewState,
} from '@states/settings';
import { dbSourcesUpdate } from '@services/dexie/sources';
import { sourcesCheckLCAssignments } from '@services/app/sources';
import { schedulesSaveAssignment } from '@services/app/schedules';
import { AssignmentCongregation } from '@definition/schedules';
import { AssignmentFieldType } from '@definition/assignment';
import { LivingPartProps } from './index.types';

const useLivingPart = ({ part, selectedWeek }: LivingPartProps) => {
  const sources = useAtomValue(sourcesState);
  const schedules = useAtomValue(schedulesState);
  const { t } = useAppTranslation();

  const dataView = useAtomValue(userDataViewState);
  const lang = useAtomValue(JWLangState);
  const sourceLocale = useAtomValue(JWLangLocaleState);

  const source = useMemo(() => {
    return sources.find((record) => record.weekOf === selectedWeek);
  }, [selectedWeek, sources]);

  const schedule = useMemo(() => {
    return schedules.find((record) => record.weekOf === selectedWeek);
  }, [selectedWeek, schedules]);

  const type = useMemo(() => {
    return `lc_part${part}` as SourceAssignmentType;
  }, [part]);

  const lcPart = useMemo(() => {
    if (!source) return;

    return source.midweek_meeting[type] as LivingAsChristiansType;
  }, [source, type]);

  const partNumber = useMemo(() => {
    return lcPart?.title.default[lang]?.match(/^\d+\.\s/)?.[0] ?? '';
  }, [lcPart, lang]);

  const getGBUpdateTitle = useCallback(
    (number: string) => {
      const title =
        number.length > 0
          ? t('tr_governingBodyUpdateTitle', { lng: sourceLocale, number })
          : t('tr_governingBodyUpdate', { lng: sourceLocale });

      return `${partNumber}${title}`;
    },
    [t, sourceLocale, partNumber]
  );

  const initialOverride = useMemo(() => {
    if (!lcPart) return '';

    return (
      lcPart.title.override.find((record) => record.type === dataView)?.value ??
      ''
    );
  }, [dataView, lcPart]);

  const initialGBUpdateNumber = useMemo(() => {
    if (initialOverride === getGBUpdateTitle('')) return '';

    const [prefix, suffix] = getGBUpdateTitle('|').split('|');

    if (!initialOverride.startsWith(prefix)) return null;
    if (!initialOverride.endsWith(suffix)) return null;

    const number = initialOverride.slice(
      prefix.length,
      initialOverride.length - suffix.length
    );

    return /^\d+$/.test(number) ? number : null;
  }, [initialOverride, getGBUpdateTitle]);

  const [isGBUpdate, setIsGBUpdate] = useState(initialGBUpdateNumber !== null);
  const [gbUpdateNumber, setGBUpdateNumber] = useState(
    initialGBUpdateNumber ?? ''
  );
  const [isOverwrite, setIsOverwrite] = useState(
    initialOverride.length > 0 && initialGBUpdateNumber === null
  );

  const handleToggleOverwrite = async () => {
    setIsOverwrite((prev) => !prev);
    setIsGBUpdate(false);
    setGBUpdateNumber('');

    await handleResetOverride();
  };

  const handleToggleGBUpdate = async () => {
    const newValue = !isGBUpdate;
    setIsGBUpdate(newValue);
    setIsOverwrite(false);
    setGBUpdateNumber('');

    if (!newValue) {
      await handleResetOverride();
      return;
    }

    const title = getGBUpdateTitle('');
    await handleResetOverride(title);

    const assigned = (
      schedule?.midweek_meeting[type] as AssignmentCongregation[]
    )?.find((record) => record.type === dataView)?.value;

    // the update is a video, a name left here would still be printed
    const desc = lcPart.desc.default[lang];

    if (
      assigned?.length > 0 &&
      sourcesCheckLCAssignments(title, desc, sourceLocale)
    ) {
      await schedulesSaveAssignment(
        schedule,
        `MM_LCPart${part}` as AssignmentFieldType,
        ''
      );
    }
  };

  const handleGBUpdateNumberChange = async (value: string) => {
    const number = value.replace(/\D/g, '');
    setGBUpdateNumber(number);

    const lcPart = source.midweek_meeting[type] as LivingAsChristiansType;
    const lcPartTitle = structuredClone(lcPart.title.override);

    const title = getGBUpdateTitle(number);
    const updatedAt = new Date().toISOString();

    const currentTitle = lcPartTitle.find((record) => record.type === dataView);

    if (!currentTitle) {
      lcPartTitle.push({ type: dataView, updatedAt, value: title });
    } else {
      currentTitle.value = title;
      currentTitle.updatedAt = updatedAt;
    }

    const toSave = {
      [`midweek_meeting.${type}.title.override`]: lcPartTitle,
    } as unknown as UpdateSpec<SourceWeekType>;

    await dbSourcesUpdate(selectedWeek, toSave);
  };

  const handleResetOverride = async (title = '') => {
    const lcPart = source.midweek_meeting[type] as LivingAsChristiansType;
    const lcPartTitle = structuredClone(lcPart.title.override);

    const currentTitle = lcPartTitle.find((record) => record.type === dataView);

    if (!currentTitle) {
      lcPartTitle.push({ type: dataView, updatedAt: '', value: title });
    } else {
      currentTitle.value = title;
      currentTitle.updatedAt = new Date().toISOString();
    }

    let fieldName = `midweek_meeting.${type}.title.override`;

    let toSave = {
      [fieldName]: lcPartTitle,
    } as unknown as UpdateSpec<SourceWeekType>;

    await dbSourcesUpdate(selectedWeek, toSave);

    const lcPartTime = structuredClone(
      source.midweek_meeting.lc_part1.time.override
    );
    const currentTime = lcPartTime.find((record) => record.type === dataView);

    if (!currentTime) {
      lcPartTime.push({ type: dataView, updatedAt: '', value: undefined });
    } else {
      currentTime.updatedAt = new Date().toISOString();
      currentTime.value = undefined;
    }

    fieldName = `midweek_meeting.${type}.time.override`;

    toSave = {
      [fieldName]: lcPartTime,
    } as unknown as UpdateSpec<SourceWeekType>;

    await dbSourcesUpdate(selectedWeek, toSave);

    const lcPartDesc = structuredClone(
      source.midweek_meeting.lc_part1.desc.override
    );
    const currentDesc = lcPartDesc.find((record) => record.type === dataView);

    if (!currentDesc) {
      lcPartDesc.push({ type: dataView, updatedAt: '', value: '' });
    } else {
      currentDesc.updatedAt = new Date().toISOString();
      currentDesc.value = '';
    }

    fieldName = `midweek_meeting.${type}.desc.override`;

    toSave = {
      [fieldName]: lcPartDesc,
    } as unknown as UpdateSpec<SourceWeekType>;

    await dbSourcesUpdate(selectedWeek, toSave);
  };

  return {
    type,
    isOverwrite,
    handleToggleOverwrite,
    isGBUpdate,
    gbUpdateNumber,
    handleToggleGBUpdate,
    handleGBUpdateNumberChange,
  };
};

export default useLivingPart;
