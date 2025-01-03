import { useState } from 'react';
import { useRecoilValue } from 'recoil';
import { pdf } from '@react-pdf/renderer';
import { saveAs } from 'file-saver';
import { useAppTranslation } from '@hooks/index';
import { fieldGroupsState } from '@states/field_service_groups';
import { displaySnackNotification } from '@services/recoil/app';
import { getMessageByCode } from '@services/i18n/translation';
import { personsActiveState } from '@states/persons';
import { congNameState, fullnameOptionState } from '@states/settings';
import { buildPersonFullname } from '@utils/common';
import { FieldServiceGroupExportType } from '@definition/field_service_groups';
import usePerson from '@features/persons/hooks/usePerson';
import TemplateFieldServiceGroups from '@views/field_service_groups';

const useExportGroups = () => {
  const { t } = useAppTranslation();

  const { personIsPublisher } = usePerson();

  const groups = useRecoilValue(fieldGroupsState);
  const persons = useRecoilValue(personsActiveState);
  const fullnameOption = useRecoilValue(fullnameOptionState);
  const congName = useRecoilValue(congNameState);

  const [isProcessing, setIsProcessing] = useState(false);

  const handleExport = async () => {
    if (isProcessing) return;

    try {
      setIsProcessing(true);

      const formatted_groups: FieldServiceGroupExportType[] = groups.map(
        (group) => {
          const group_name = group.group_data.name;
          let final_name = '';

          if (group_name.length === 0) {
            final_name = t('tr_groupNumber', {
              groupNumber: group.group_data.sort_index + 1,
            });
          }

          if (group_name.length > 0) {
            final_name = t('tr_groupName', {
              groupName: group_name,
            });
          }

          const group_members = group.group_data.members
            .filter((record) => {
              const person = persons.find(
                (p) => p.person_uid === record.person_uid
              );
              if (!person) return false;

              const isActive = personIsPublisher(person);
              return isActive;
            })
            .sort((a, b) => a.sort_index - b.sort_index)
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
            });

          const overseer =
            group_members.find((record) => record.isOverseer)?.person_name ||
            null;

          const overseerAssistent =
            group_members.find((record) => record.isAssistant)?.person_name ||
            null;

          const publishers = group_members
            .filter((record) => !record.isOverseer && !record.isAssistant)
            .map((record) => record.person_name);

          return {
            group_name: final_name,
            group_number: group.group_data.sort_index + 1,
            overseer,
            overseerAssistent,
            publishers,
          };
        }
      );

      const blob = await pdf(
        <TemplateFieldServiceGroups
          groups={formatted_groups}
          congregation={congName}
        />
      ).toBlob();

      const filename = `Field_Service_Groups.pdf`;

      saveAs(blob, filename);

      setIsProcessing(false);
    } catch (error) {
      console.error(error);

      setIsProcessing(false);

      await displaySnackNotification({
        header: getMessageByCode('error_app_generic-title'),
        message: getMessageByCode(error.message),
        severity: 'error',
      });
    }
  };

  return { handleExport, isProcessing };
};

export default useExportGroups;
