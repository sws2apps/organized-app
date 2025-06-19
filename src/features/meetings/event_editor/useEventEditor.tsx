import { useEffect, useMemo, useRef, useState } from 'react';
import { useAtomValue } from 'jotai';
import { UpdateSpec } from 'dexie';
import { IconError } from '@components/icons';
import { EventNameType, SourceWeekType } from '@definition/sources';
import { sourcesState } from '@states/sources';
import { dbSourcesUpdate } from '@services/dexie/sources';
import { userDataViewState } from '@states/settings';
import { displaySnackNotification } from '@services/states/app';
import { getMessageByCode } from '@services/i18n/translation';
import { EventEditorType } from './index.types';

const useEventEditor = ({ meeting, week }: EventEditorType) => {
  const timerSource = useRef<NodeJS.Timeout>(undefined);

  const sources = useAtomValue(sourcesState);
  const dataView = useAtomValue(userDataViewState);

  const source = useMemo(() => {
    return sources.find((record) => record.weekOf === week);
  }, [sources, week]);

  const initialValue = useMemo(() => {
    if (!source) return '';

    const events: EventNameType[] = source[`${meeting}_meeting`].event_name;

    if (!Array.isArray(events)) return '';

    return events.find((record) => record.type === dataView)?.value ?? '';
  }, [source, meeting, dataView]);

  const [text, setText] = useState(initialValue);

  const handleTextChange = (value: string) => {
    setText(value);
  };

  const handleTextSave = () => {
    if (timerSource.current) clearTimeout(timerSource.current);

    timerSource.current = setTimeout(handleTextSaveDb, 1000);
  };

  const handleTextSaveDb = async () => {
    try {
      const events: EventNameType[] = structuredClone(
        source[`${meeting}_meeting`].event_name
      );

      let event = events.find((record) => record.type === dataView);

      if (!event) {
        events.push({ type: dataView, updatedAt: '', value: '' });

        event = events.find((record) => record.type === dataView);
      }

      event.updatedAt = new Date().toISOString();
      event.value = text;

      const field = `${meeting}_meeting.event_name`;

      const data = { [field]: events } as unknown as UpdateSpec<SourceWeekType>;

      await dbSourcesUpdate(week, data);
    } catch (error) {
      displaySnackNotification({
        header: getMessageByCode('error_app_generic-title'),
        message: error.message,
        severity: 'error',
        icon: <IconError color="var(--white)" />,
      });
    }
  };

  useEffect(() => {
    setText(initialValue);
  }, [initialValue]);

  return { text, handleTextChange, handleTextSave };
};

export default useEventEditor;
