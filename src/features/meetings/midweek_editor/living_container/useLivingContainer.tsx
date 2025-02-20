import { useMemo } from 'react';
import { useRecoilValue } from 'recoil';
import { sourcesState } from '@states/sources';
import { JWLangState, userDataViewState } from '@states/settings';
import { LivingContainerProps } from './index.types';
import { createNumbersArray } from '@utils/common';
import { dbSourcesUpdate } from '@services/dexie/sources';

const useLivingContainer = ({ selectedWeek }: LivingContainerProps) => {
  const sources = useRecoilValue(sourcesState);
  const dataView = useRecoilValue(userDataViewState);
  const lang = useRecoilValue(JWLangState);

  const source = useMemo(() => {
    return sources.find((record) => record.weekOf === selectedWeek);
  }, [selectedWeek, sources]);

  const count = useMemo(() => {
    if (!source) return 0;

    const lcCount = source.midweek_meeting.lc_count.default[lang];
    return lcCount;
  }, [source, lang]);

  const countOverride = useMemo(() => {
    if (!source) return 0;

    const lcCountOverride =
      source.midweek_meeting.lc_count.override.find(
        (record) => record.type === dataView
      )?.value || 0;

    return lcCountOverride;
  }, [source, dataView]);

  const customPartEnabled = useMemo(() => {
    return countOverride < count + 1;
  }, [count, countOverride]);

  const hasCustomPart = useMemo(() => {
    return countOverride > count;
  }, [count, countOverride]);

  const countArray = useMemo(() => {
    return createNumbersArray(count);
  }, [count]);

  const handleDeleteCustomLCPart = async () => {
    const lcCountOverride = structuredClone(
      source.midweek_meeting.lc_count.override
    );

    const currentCount = lcCountOverride.find(
      (record) => record.type === dataView
    );

    currentCount.updatedAt = new Date().toISOString();
    currentCount.value = undefined;

    const lcPartTitle = structuredClone(source.midweek_meeting.lc_part3.title);
    const currentTitle = lcPartTitle.find((record) => record.type === dataView);
    currentTitle.updatedAt = new Date().toISOString();
    currentTitle.value = '';

    const lcPartDesc = structuredClone(source.midweek_meeting.lc_part3.desc);
    const currentDesc = lcPartDesc.find((record) => record.type === dataView);
    currentDesc.updatedAt = new Date().toISOString();
    currentDesc.value = '';

    const lcPartTime = structuredClone(source.midweek_meeting.lc_part3.time);
    const currentTime = lcPartTime.find((record) => record.type === dataView);
    currentTime.updatedAt = new Date().toISOString();
    currentTime.value = undefined;

    await dbSourcesUpdate(selectedWeek, {
      'midweek_meeting.lc_count.override': lcCountOverride,
      'midweek_meeting.lc_part3.title': lcPartTitle,
      'midweek_meeting.lc_part3.desc': lcPartDesc,
      'midweek_meeting.lc_part3.time': lcPartTime,
    });
  };

  const handleAddCustomLCPart = async () => {
    const lcCount = source.midweek_meeting.lc_count;
    const lcCountOverride = structuredClone(lcCount.override);

    let current = lcCountOverride.find((record) => record.type === dataView);
    if (!current) {
      lcCountOverride.push({ type: dataView, updatedAt: '', value: undefined });
      current = lcCountOverride.find((record) => record.type === dataView);
    }

    current.updatedAt = new Date().toISOString();
    current.value = lcCount.default[lang] + 1;

    const lcPartTitle = structuredClone(source.midweek_meeting.lc_part3.title);
    const currentTitle = lcPartTitle.find((record) => record.type === dataView);

    if (!currentTitle) {
      lcPartTitle.push({ type: dataView, updatedAt: '', value: '' });
    }

    const lcPartDesc = structuredClone(source.midweek_meeting.lc_part3.desc);
    const currentDesc = lcPartDesc.find((record) => record.type === dataView);

    if (!currentDesc) {
      lcPartDesc.push({ type: dataView, updatedAt: '', value: '' });
    }

    const lcPartTime = structuredClone(source.midweek_meeting.lc_part3.time);
    const currentTime = lcPartTime.find((record) => record.type === dataView);

    if (!currentTime) {
      lcPartTime.push({ type: dataView, updatedAt: '', value: undefined });
    }

    await dbSourcesUpdate(selectedWeek, {
      'midweek_meeting.lc_count.override': lcCountOverride,
      'midweek_meeting.lc_part3.title': lcPartTitle,
      'midweek_meeting.lc_part3.desc': lcPartDesc,
      'midweek_meeting.lc_part3.time': lcPartTime,
    });
  };

  return {
    countArray,
    customPartEnabled,
    hasCustomPart,
    handleDeleteCustomLCPart,
    handleAddCustomLCPart,
  };
};

export default useLivingContainer;
