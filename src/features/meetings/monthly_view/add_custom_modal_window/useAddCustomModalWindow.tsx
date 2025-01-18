import { useRecoilValue } from 'recoil';
import { AddCustomModalWindowType } from './index.types';
import { sourcesState } from '@states/sources';
import { JWLangState, userDataViewState } from '@states/settings';
import { dbSourcesUpdate } from '@services/dexie/sources';

const useAddCustomModalWindow = (props: AddCustomModalWindowType) => {
  const week = props.week;

  const sources = useRecoilValue(sourcesState);
  const dataView = useRecoilValue(userDataViewState);
  const lang = useRecoilValue(JWLangState);

  const handleAddCustomLCPart = async () => {
    const source = sources.find((record) => record.weekOf === week);
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

    await dbSourcesUpdate(week, {
      'midweek_meeting.lc_count.override': lcCountOverride,
      'midweek_meeting.lc_part3.title': lcPartTitle,
      'midweek_meeting.lc_part3.desc': lcPartDesc,
      'midweek_meeting.lc_part3.time': lcPartTime,
    });
  };

  const handleDeleteCustomLCPart = async () => {
    const source = sources.find((record) => record.weekOf === week);
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

    await dbSourcesUpdate(week, {
      'midweek_meeting.lc_count.override': lcCountOverride,
      'midweek_meeting.lc_part3.title': lcPartTitle,
      'midweek_meeting.lc_part3.desc': lcPartDesc,
      'midweek_meeting.lc_part3.time': lcPartTime,
    });
  };

  const handleDeleteCustomLCPartWhenIsEmpty = async () => {
    const source = sources.find((record) => record.weekOf === week);

    const lcPartTitle = structuredClone(source.midweek_meeting.lc_part3.title);
    const currentTitle = lcPartTitle.find((record) => record.type === dataView);

    if (currentTitle.value === '') {
      await handleDeleteCustomLCPart();
    }
  };

  return {
    handleDeleteCustomLCPart,
    handleAddCustomLCPart,
    handleDeleteCustomLCPartWhenIsEmpty,
    week,
  };
};

export default useAddCustomModalWindow;
