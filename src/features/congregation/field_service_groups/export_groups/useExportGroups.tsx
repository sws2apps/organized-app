import { useState } from 'react';
import { useAtomValue } from 'jotai';
import { pdf } from '@react-pdf/renderer';
import { saveAs } from 'file-saver';
import { useAppTranslation } from '@hooks/index';
import { fieldWithLanguageGroupsState } from '@states/field_service_groups';
import { displaySnackNotification } from '@services/states/app';
import { getMessageByCode } from '@services/i18n/translation';
import { personsActiveState } from '@states/persons';
import {
  JWLangLocaleState,
  congNameState,
  fullnameOptionState,
  publishersSortState,
} from '@states/settings';
import { buildPersonFullname } from '@utils/common';
import { FieldServiceGroupExportType } from '@definition/field_service_groups';
import { PublishersSortOption } from '@definition/settings';
import usePerson from '@features/persons/hooks/usePerson';
import { TemplateFieldServiceGroups } from '@views/index';

const useExportGroups = () => {
  const { t } = useAppTranslation();

  const { personIsPublisher } = usePerson();

  const groups_list = useAtomValue(fieldWithLanguageGroupsState);
  const persons = useAtomValue(personsActiveState);
  const fullnameOption = useAtomValue(fullnameOptionState);
  const congName = useAtomValue(congNameState);
  const sortMethod = useAtomValue(publishersSortState);
  const locale = useAtomValue(JWLangLocaleState);

  const [isProcessing, setIsProcessing] = useState(false);

  const handleExport = async () => {
    if (isProcessing) return;

    try {
      setIsProcessing(true);

      const formatted_groups: FieldServiceGroupExportType[] = groups_list.map(
        (record) => {
          const group_name = record.group_data.name ?? '';
          let final_name = '';

          if (group_name.length === 0) {
            final_name = t('tr_groupNumber', {
              groupNumber: record.group_data.sort_index + 1,
            });
          }

          if (group_name.length > 0) {
            final_name = group_name;
          }

          const group_members = record.group_data.members
            .filter((record) => {
              const person = persons.find(
                (p) => p.person_uid === record.person_uid
              );

              if (!person) return false;

              return personIsPublisher(person);
            })
            .map((record) => {
              const person = persons.find(
                (p) => p.person_uid === record.person_uid
              );

              return {
                ...record,
                person_name: buildPersonFullname(
                  person.person_data.person_lastname.value,
                  person.person_data.person_firstname.value,
                  fullnameOption
                ),
              };
            })
            .sort((a, b) => {
              if (sortMethod === PublishersSortOption.ALPHABETICAL) {
                return a.person_name
                  .toLowerCase()
                  .localeCompare(b.person_name.toLowerCase());
              }
              if (sortMethod === PublishersSortOption.MANUAL) {
                return a.sort_index - b.sort_index;
              }
              return 0;
            });

          const overseer =
            group_members.find((record) => record.isOverseer)?.person_name ||
            null;

          const overseerAssistant =
            group_members.find((record) => record.isAssistant)?.person_name ||
            null;

          const publishers = group_members
            .filter((record) => !record.isOverseer && !record.isAssistant)
            .map((record) => record.person_name);

          return {
            group_name: final_name,
            group_number: record.group_data.sort_index + 1,
            overseer,
            overseerAssistant,
            publishers,
          };
        }
      );

      const blob = await pdf(
        <TemplateFieldServiceGroups
          groups={formatted_groups}
          congregation={congName}
          lang={locale}
        />
      ).toBlob();

      const filename = `Field_Service_Groups.pdf`;

      saveAs(blob, filename);

      setIsProcessing(false);
    } catch (error) {
      console.error(error);

      setIsProcessing(false);

      displaySnackNotification({
        header: getMessageByCode('error_app_generic-title'),
        message: getMessageByCode(error.message),
        severity: 'error',
      });
    }
  };

  return { handleExport, isProcessing };
};

export default useExportGroups;
