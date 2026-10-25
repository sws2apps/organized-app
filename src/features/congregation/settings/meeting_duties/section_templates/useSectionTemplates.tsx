import { useRef, useState } from 'react';
import { useAtomValue } from 'jotai';
import { meetingDutiesState, userDataViewState } from '@states/settings';
import { DutiesSectionType } from '@definition/schedules';
import { DutiesMeetingValue } from '@services/app/duties';
import { dutiesSaveSectionTemplate } from '@services/app/duties_templates';
import {
  currentSectionTemplate,
  DUTY_SECTION_RULES,
  sortSectionsByParts,
} from '@utils/duties_recurring';
import { useAppTranslation } from '@hooks/index';

const useSectionTemplates = (
  meeting: DutiesMeetingValue,
  onClose: VoidFunction
) => {
  const { t } = useAppTranslation();
  const config = useAtomValue(meetingDutiesState);
  const dataView = useAtomValue(userDataViewState);
  const [drafts, setDrafts] = useState<
    Record<DutiesMeetingValue, DutiesSectionType[]>
  >(() => {
    const sectionsFor = (kind: DutiesMeetingValue) => {
      const revision = currentSectionTemplate(
        config?.section_templates ?? [],
        kind
      );
      return (revision?.sections ?? []).map((section) => ({
        ...section,
        _deleted: false,
        updatedAt: revision!.updatedAt,
      }));
    };
    return { midweek: sectionsFor('midweek'), weekend: sectionsFor('weekend') };
  });
  const initial = useRef(
    Object.fromEntries(
      (['midweek', 'weekend'] as const).map((kind) => {
        const revision = currentSectionTemplate(
          config?.section_templates ?? [],
          kind
        );
        return [
          kind,
          revision ? `${revision.id}:${revision.updatedAt}` : undefined,
        ];
      })
    )
  );
  const initialSections = useRef({
    midweek: JSON.stringify(drafts.midweek),
    weekend: JSON.stringify(drafts.weekend),
  });
  const sections = drafts[meeting];
  const setSections = (
    update: (current: DutiesSectionType[]) => DutiesSectionType[]
  ) =>
    setDrafts((current) => ({
      ...current,
      [meeting]: update(current[meeting]),
    }));
  const [editing, setEditing] = useState<string>();
  const [busy, setBusy] = useState(false);
  const pending = useRef(false);
  const [error, setError] = useState('');
  const labels = {
    tgw_talk: 'tr_sectionTreasuresTalk',
    tgw_gems: 'tr_tgwGems',
    tgw_bible_reading: 'tr_bibleReading',
    ayf_all: 'tr_applyFieldMinistryPart',
    lc_all: 'tr_sectionLivingBeforeStudy',
    lc_cbs: 'tr_cbs',
    public_talk: 'tr_publicTalk',
    w_study: 'tr_watchtowerStudy',
  };
  const parts = DUTY_SECTION_RULES[meeting].map((key) => ({
    key,
    label: t(labels[key]),
  }));
  const update = (
    values: Pick<DutiesSectionType, 'name' | 'amount' | 'parts'>
  ) => {
    setError('');
    setSections((current) =>
      editing === ''
        ? [
            ...current,
            {
              ...values,
              id: crypto.randomUUID(),
              _deleted: false,
              updatedAt: new Date().toISOString(),
            },
          ]
        : current.map((item) =>
            item.id === editing ? { ...item, ...values } : item
          )
    );
  };
  const persist = async (afterSave: VoidFunction) => {
    if (pending.current) return;
    pending.current = true;
    setBusy(true);
    setError('');
    try {
      const saveMeeting = async (kind: DutiesMeetingValue) => {
        if (JSON.stringify(drafts[kind]) === initialSections.current[kind])
          return;
        const saved = await dutiesSaveSectionTemplate(
          kind,
          drafts[kind],
          initial.current[kind],
          dataView
        );
        initial.current[kind] = `${saved.id}:${saved.updatedAt}`;
        initialSections.current[kind] = JSON.stringify(drafts[kind]);
      };
      // Each save merges settings; the second meeting reads the first save's result.
      await saveMeeting('midweek');
      await saveMeeting('weekend');
      afterSave();
    } catch (error) {
      setError(
        t(error instanceof Error ? error.message : 'error_app_generic-title')
      );
    } finally {
      pending.current = false;
      setBusy(false);
    }
  };
  return {
    sections: sortSectionsByParts(sections, DUTY_SECTION_RULES[meeting]),
    parts,
    editing,
    setEditing,
    busy,
    error,
    update,
    save: () => persist(onClose),
    remove: (id: string) =>
      setSections((current) => current.filter((item) => item.id !== id)),
  };
};
export default useSectionTemplates;
