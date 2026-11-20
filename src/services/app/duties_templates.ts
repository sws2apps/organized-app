import { DutiesSectionTemplateType } from '@definition/schedules';
import { store } from '@states/index';
import { settingsState, userDataViewState } from '@states/settings';
import {
  dutiesSaveSettings,
  DUTIES_SECTIONS_MAX,
  DutiesMeetingValue,
} from '@services/app/duties';
import {
  DUTY_SECTION_RULES,
  currentSectionTemplate,
} from '@utils/duties_recurring';
import { validateDutyName } from '@utils/duties_sections';

export const dutiesSaveSectionTemplate = async (
  meeting: DutiesMeetingValue,
  sections: DutiesSectionTemplateType['sections'],
  expected?: string,
  dataView = store.get(userDataViewState)
) => {
  if (sections.length > DUTIES_SECTIONS_MAX)
    throw new Error('tr_sectionsLimitReached');
  for (const section of sections) {
    const error = validateDutyName(section.name, sections, section.id);
    if (error) throw new Error(error);
    if (
      !Number.isInteger(section.amount) ||
      section.amount < 1 ||
      section.amount > 4
    )
      throw new Error('tr_dutyInvalidAmount');
    if (
      section.parts.some(
        (part) =>
          !(DUTY_SECTION_RULES[meeting] as readonly string[]).includes(part)
      )
    )
      throw new Error('tr_sectionPartsChanged');
  }
  const incoming = structuredClone(
    store.get(settingsState).cong_settings.meeting_duties ?? []
  );
  const config = incoming.find((item) => item.type === dataView);
  if (!config) throw new Error('tr_sectionUnavailable');
  const templates = config.section_templates ?? [];
  const previous = currentSectionTemplate(templates, meeting);
  const revision: DutiesSectionTemplateType = {
    id: previous?.id ?? crypto.randomUUID(),
    meeting,
    updatedAt: new Date().toISOString(),
    sections: sections.map((section) => ({
      id: section.id,
      name: section.name.trim(),
      amount: section.amount,
      parts: [...new Set(section.parts)],
    })),
  };
  config.section_templates = [
    ...templates.filter((item) => item.id !== revision.id),
    revision,
  ];
  await dutiesSaveSettings(incoming, () => {
    const latest = store
      .get(settingsState)
      .cong_settings.meeting_duties?.find((item) => item.type === dataView);
    const current = currentSectionTemplate(
      latest?.section_templates ?? [],
      meeting
    );
    if (
      (current ? `${current.id}:${current.updatedAt}` : undefined) !== expected
    )
      throw new Error('tr_sectionChanged');
  });
  return revision;
};
