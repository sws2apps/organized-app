import { useEffect, useRef, useState } from 'react';
import { useRecoilValue } from 'recoil';
import { UpdateSpec } from 'dexie';
import { EventNameType, SourceWeekType } from '@definition/sources';
import { EventEditorType } from './index.types';
import { sourcesState } from '@states/sources';
import { dbSourcesUpdate } from '@services/dexie/sources';

const useEventEditor = ({ meeting, week }: EventEditorType) => {
  const timerSource = useRef<NodeJS.Timeout>();

  const sources = useRecoilValue(sourcesState);

  const [text, setText] = useState('');

  const source = sources.find((record) => record.weekOf === week);

  const handleTextChange = (value: string) => {
    setText(value);
  };

  const handleTextSave = () => {
    if (timerSource.current) clearTimeout(timerSource.current);

    timerSource.current = setTimeout(handleTextSaveDb, 1000);
  };

  const handleTextSaveDb = async () => {
    const event: EventNameType = structuredClone(
      source[`${meeting}_meeting`].event_name
    );

    event.updatedAt = new Date().toISOString();
    event.value = text;

    const field = `${meeting}_meeting.event_name`;

    const data = { [field]: event } as unknown as UpdateSpec<SourceWeekType>;

    await dbSourcesUpdate(week, data);
  };

  useEffect(() => {
    if (!source) {
      setText('');
    }

    if (source) {
      const event: EventNameType = source[`${meeting}_meeting`].event_name;
      setText(event.value);
    }
  }, [source, meeting]);

  return { text, handleTextChange, handleTextSave };
};

export default useEventEditor;
