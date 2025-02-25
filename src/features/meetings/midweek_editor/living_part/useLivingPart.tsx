import { useMemo, useState } from 'react';
import { UpdateSpec } from 'dexie';
import { useRecoilValue } from 'recoil';
import {
  LivingAsChristiansType,
  SourceAssignmentType,
  SourceWeekType,
} from '@definition/sources';
import { sourcesState } from '@states/sources';
import { userDataViewState } from '@states/settings';
import { dbSourcesUpdate } from '@services/dexie/sources';
import { LivingPartProps } from './index.types';

const useLivingPart = ({ part, selectedWeek }: LivingPartProps) => {
  const sources = useRecoilValue(sourcesState);
  const dataView = useRecoilValue(userDataViewState);

  const source = useMemo(() => {
    return sources.find((record) => record.weekOf === selectedWeek);
  }, [selectedWeek, sources]);

  const type = useMemo(() => {
    return `lc_part${part}` as SourceAssignmentType;
  }, [part]);

  const lcPart = useMemo(() => {
    if (!source) return;

    return source.midweek_meeting[type] as LivingAsChristiansType;
  }, [source, type]);

  const initialOverwrite = useMemo(() => {
    if (!lcPart) return false;

    const lcSrcOverride = lcPart.title.override.find(
      (record) => record.type === dataView
    )?.value;

    return lcSrcOverride?.length > 0;
  }, [dataView, lcPart]);

  const [isOverwrite, setIsOverwrite] = useState(initialOverwrite);

  const handleToggleOverwrite = async () => {
    const newValue = !isOverwrite;
    setIsOverwrite(newValue);

    const lcPart = source.midweek_meeting[type] as LivingAsChristiansType;
    const lcPartTitle = structuredClone(lcPart.title.override);

    const currentTitle = lcPartTitle.find((record) => record.type === dataView);

    if (!currentTitle) {
      lcPartTitle.push({ type: dataView, updatedAt: '', value: '' });
    } else {
      currentTitle.value = '';
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

  return { type, isOverwrite, handleToggleOverwrite };
};

export default useLivingPart;
