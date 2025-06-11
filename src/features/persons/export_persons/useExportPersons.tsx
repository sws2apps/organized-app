import { useState } from 'react';
import { useAtomValue } from 'jotai';
import writeXlsxFile, { Row, SheetData } from 'write-excel-file';
import { IconError } from '@components/icons';
import { useAppTranslation } from '@hooks/index';
import { getMessageByCode } from '@services/i18n/translation';
import { displaySnackNotification } from '@services/states/app';
import { personsAllState } from '@states/persons';
import { fieldWithLanguageGroupsState } from '@states/field_service_groups';
import { JWLangLocaleState } from '@states/settings';

const useExportPersons = () => {
  const { t } = useAppTranslation();

  const persons = useAtomValue(personsAllState);
  const groups = useAtomValue(fieldWithLanguageGroupsState);
  const lng = useAtomValue(JWLangLocaleState);

  const [isProcessing, setIsProcessing] = useState(false);

  const personGetGroup = (person_uid: string) => {
    return groups.find((group) =>
      group.group_data.members.some(
        (member) => member.person_uid === person_uid
      )
    );
  };

  const handleExport = async () => {
    try {
      setIsProcessing(true);

      const data: SheetData = [];

      // create header
      const header_row: Row = [
        { value: t('tr_lastname', { lng }), fontWeight: 'bold' },
        { value: t('tr_firstname', { lng }), fontWeight: 'bold' },
        { value: t('tr_phoneNumber', { lng }), fontWeight: 'bold' },
        { value: t('tr_address', { lng }), fontWeight: 'bold' },
        { value: t('tr_fieldServiceGroup', { lng }), fontWeight: 'bold' },
      ];

      data.push(header_row);

      const persons_row = persons.map((person) => {
        const group = personGetGroup(person.person_uid);

        let groupName = '';

        if (group) {
          groupName = group.group_data.name;

          if (groupName.length === 0) {
            groupName = t('tr_groupNumber', {
              lng,
              groupNumber: group.group_data.sort_index + 1,
            });
          }
        }

        return [
          { value: person.person_data.person_lastname.value },
          { value: person.person_data.person_firstname.value },
          { value: person.person_data.phone.value, type: String },
          { value: person.person_data.address.value },
          { value: groupName },
        ] as Row;
      });

      data.push(...persons_row);

      await writeXlsxFile(data, {
        fileName: 'persons-list.xlsx',
        stickyRowsCount: 1,
        columns: [
          { width: 30 },
          { width: 35 },
          { width: 45 },
          { width: 45 },
          { width: 25 },
        ],
      });

      setIsProcessing(false);
    } catch (error) {
      console.error(error);

      setIsProcessing(false);

      displaySnackNotification({
        header: getMessageByCode('error_app_generic-title'),
        message: error.message,
        severity: 'error',
        icon: <IconError color="var(--white)" />,
      });
    }
  };
  return { handleExport, isProcessing };
};

export default useExportPersons;
