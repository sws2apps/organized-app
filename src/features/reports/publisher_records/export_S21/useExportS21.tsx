import { useMemo, useState } from 'react';
import { useRecoilValue } from 'recoil';
import { pdf } from '@react-pdf/renderer';
import JSZip from 'jszip';
import { useAppTranslation } from '@hooks/index';
import { displaySnackNotification } from '@services/recoil/app';
import { ExportS21Props, ExportType } from './index.types';
import { getMessageByCode } from '@services/i18n/translation';
import { currentReportMonth } from '@utils/date';
import { fieldGroupsState } from '@states/field_service_groups';
import { FieldServiceGroupType } from '@definition/field_service_groups';
import { JWLangLocaleState } from '@states/settings';
import useCongregationCard from '@features/reports/hooks/useCongregationCard';
import usePersons from '@features/persons/hooks/usePersons';
import usePublisherCard from '@features/reports/hooks/usePublisherCard';
import TemplateS21Doc2in1 from '@views/reports/S21/2in1';

const useExportS21 = ({ onClose }: ExportS21Props) => {
  const { t } = useAppTranslation();

  const {
    getPublishersActive,
    getPublishersInactive,
    getFTSMonths,
    getAPMonths,
    getPublisherMonths,
  } = usePersons();

  const { getCardsData } = usePublisherCard();

  const { getCongregationCardsData } = useCongregationCard();

  const fieldGroups = useRecoilValue(fieldGroupsState);
  const sourceLocale = useRecoilValue(JWLangLocaleState);

  const [type, setType] = useState<ExportType>('all');
  const [allOpen, setAllOpen] = useState(true);
  const [selectOpen, setSelectOpen] = useState(false);

  const month = useMemo(() => {
    return currentReportMonth();
  }, []);

  const publishers_active = useMemo(() => {
    return getPublishersActive(month);
  }, [month, getPublishersActive]);

  const publishers_FTS = useMemo(() => {
    return getFTSMonths(month);
  }, [month, getFTSMonths]);

  const publishers_AP = useMemo(() => {
    return getAPMonths(month);
  }, [month, getAPMonths]);

  const publishers_others = useMemo(() => {
    return getPublisherMonths(month);
  }, [month, getPublisherMonths]);

  const publishers_inactive = useMemo(() => {
    return getPublishersInactive(month);
  }, [month, getPublishersInactive]);

  const publishers_group = useMemo(() => {
    if (fieldGroups.length === 0) return [];

    const result: FieldServiceGroupType[] = [];

    for (const group of fieldGroups) {
      const members = group.group_data.members.filter((record) =>
        publishers_active.some(
          (person) => record.person_uid === person.person_uid
        )
      );

      if (members.length > 0) {
        const obj = structuredClone(group);

        obj.group_data.members = members;
        result.push(obj);
      }
    }

    return result.sort(
      (a, b) => a.group_data.sort_index - b.group_data.sort_index
    );
  }, [fieldGroups, publishers_active]);

  const handleChangeType = (value: ExportType) => setType(value);

  const handleExportAll = async () => {
    const zip = new JSZip();

    // get all inactive reports
    if (publishers_inactive.length > 0) {
      const inactiveZip = zip.folder(
        `02-${t('tr_inactivePublishers', { lng: sourceLocale })}`
      );

      for await (const publisher of publishers_inactive) {
        const data = getCardsData(publisher.person_uid);
        const name = `S-21_${data.at(0).name}.pdf`;

        const blob = await pdf(
          <TemplateS21Doc2in1 data={data} lang={sourceLocale} />
        ).toBlob();

        inactiveZip.file(name, blob);
      }
    }

    // get all active reports
    if (publishers_active.length > 0) {
      const activeZip = zip.folder(
        `01-${t('tr_activePublishers', { lng: sourceLocale })}`
      );

      // get FTS
      if (publishers_FTS.length > 0) {
        const ftsZip = activeZip.folder(
          t('tr_fulltimeServants', { lng: sourceLocale })
        );

        for await (const publisher of publishers_FTS) {
          const data = getCardsData(publisher.person_uid);
          const name = `S-21_${data.at(0).name}.pdf`;

          const blob = await pdf(
            <TemplateS21Doc2in1 data={data} lang={sourceLocale} />
          ).toBlob();

          ftsZip.file(name, blob);
        }
      }

      // get AP
      if (publishers_AP.length > 0) {
        const apZip = activeZip.folder(t('tr_APs', { lng: sourceLocale }));

        for await (const publisher of publishers_AP) {
          const data = getCardsData(publisher.person_uid);
          const name = `S-21_${data.at(0).name}.pdf`;

          const blob = await pdf(
            <TemplateS21Doc2in1 data={data} lang={sourceLocale} />
          ).toBlob();

          apZip.file(name, blob);
        }
      }

      // get other publishers
      if (publishers_others.length > 0) {
        const otherPubZip = activeZip.folder(
          t('tr_activePublishersAll', { lng: sourceLocale })
        );

        let index = 1;
        for await (const group of publishers_group) {
          const groupIndex = t('tr_groupNumber', {
            lng: sourceLocale,
            groupNumber: index,
          });
          const groupZip = otherPubZip.folder(groupIndex);

          for await (const publisher of group.group_data.members) {
            const isPub = publishers_others.some(
              (record) => record.person_uid === publisher.person_uid
            );

            if (isPub) {
              const data = getCardsData(publisher.person_uid);
              const name = `S-21_${data.at(0).name}.pdf`;

              const blob = await pdf(
                <TemplateS21Doc2in1 data={data} lang={sourceLocale} />
              ).toBlob();

              groupZip.file(name, blob);
            }
          }

          index++;
        }
      }
    }

    // get total FTS
    const ftsData = getCongregationCardsData('FTS');
    let name = `S-21_${t('tr_fulltimeServants', { lng: sourceLocale })}.pdf`;
    let blob = await pdf(
      <TemplateS21Doc2in1 data={ftsData} lang={sourceLocale} />
    ).toBlob();
    zip.file(name, blob);

    // get total AP
    const apData = getCongregationCardsData('AP');
    name = `S-21_${t('tr_APs', { lng: sourceLocale })}.pdf`;
    blob = await pdf(
      <TemplateS21Doc2in1 data={apData} lang={sourceLocale} />
    ).toBlob();
    zip.file(name, blob);

    // get total publishers
    const pubData = getCongregationCardsData('Publishers');
    name = `S-21_${t('tr_activePublishersAll', { lng: sourceLocale })}.pdf`;
    blob = await pdf(
      <TemplateS21Doc2in1 data={pubData} lang={sourceLocale} />
    ).toBlob();
    zip.file(name, blob);

    const content = await zip.generateAsync({ type: 'blob' });

    const url = URL.createObjectURL(content);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'Organized_S-21_Cards.zip';
    link.click();
  };

  const handleExportInactive = async (values: string[]) => {
    const zip = new JSZip();

    for await (const publisher of values) {
      const data = getCardsData(publisher);
      const name = `S-21_${data.at(0).name}.pdf`;

      const blob = await pdf(
        <TemplateS21Doc2in1 data={data} lang={sourceLocale} />
      ).toBlob();

      zip.file(name, blob);
    }

    const content = await zip.generateAsync({ type: 'blob' });

    const url = URL.createObjectURL(content);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'Organized_S-21_Cards_Inactives.zip';
    link.click();
  };

  const handleExportGroups = async (values: string[]) => {
    // split by groups
    const result = publishers_group
      .map((group) => {
        const members = group.group_data.members.filter((record) =>
          values.includes(record.person_uid)
        );

        const obj = structuredClone(group);
        obj.group_data.members = members;

        return obj;
      })
      .filter((record) => record.group_data.members.length > 0);

    const zip = new JSZip();

    let index = 1;
    for await (const group of result) {
      const groupIndex = t('tr_groupNumber', {
        lng: sourceLocale,
        groupNumber: index,
      });
      const groupZip = zip.folder(groupIndex);

      for await (const publisher of group.group_data.members) {
        const isPub = publishers_others.some(
          (record) => record.person_uid === publisher.person_uid
        );

        if (isPub) {
          const data = getCardsData(publisher.person_uid);
          const name = `S-21_${data.at(0).name}.pdf`;

          const blob = await pdf(
            <TemplateS21Doc2in1 data={data} lang={sourceLocale} />
          ).toBlob();

          groupZip.file(name, blob);
        }
      }

      index++;
    }

    const content = await zip.generateAsync({ type: 'blob' });

    const url = URL.createObjectURL(content);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'Organized_S-21_Cards_Groups.zip';
    link.click();
  };

  const handleExportActive = async (values: string[]) => {
    const FTS = publishers_FTS.filter((record) =>
      values.includes(record.person_uid)
    );

    const AP = publishers_AP.filter((record) =>
      values.includes(record.person_uid)
    );

    const publishers = publishers_others.filter((record) =>
      values.includes(record.person_uid)
    );

    const zip = new JSZip();

    // get FTS
    if (FTS.length > 0) {
      const ftsZip = zip.folder(
        t('tr_fulltimeServants', { lng: sourceLocale })
      );

      for await (const publisher of FTS) {
        const data = getCardsData(publisher.person_uid);
        const name = `S-21_${data.at(0).name}.pdf`;

        const blob = await pdf(
          <TemplateS21Doc2in1 data={data} lang={sourceLocale} />
        ).toBlob();

        ftsZip.file(name, blob);
      }
    }

    // get AP
    if (AP.length > 0) {
      const apZip = zip.folder(t('tr_APs', { lng: sourceLocale }));

      for await (const publisher of AP) {
        const data = getCardsData(publisher.person_uid);
        const name = `S-21_${data.at(0).name}.pdf`;

        const blob = await pdf(
          <TemplateS21Doc2in1 data={data} lang={sourceLocale} />
        ).toBlob();

        apZip.file(name, blob);
      }
    }

    // get other publishers
    if (publishers.length > 0) {
      const otherPubZip = zip.folder(
        t('tr_activePublishersAll', { lng: sourceLocale })
      );

      for await (const publisher of publishers) {
        const data = getCardsData(publisher.person_uid);
        const name = `S-21_${data.at(0).name}.pdf`;

        const blob = await pdf(
          <TemplateS21Doc2in1 data={data} lang={sourceLocale} />
        ).toBlob();

        otherPubZip.file(name, blob);
      }
    }

    const content = await zip.generateAsync({ type: 'blob' });

    const url = URL.createObjectURL(content);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'Organized_S-21_Cards_Actives.zip';
    link.click();
  };

  const handleExportCards = async (values: string[], type: string) => {
    if (type === 'all') {
      await handleExportAll();
    }

    if (type === 'inactive') {
      await handleExportInactive(values);
    }

    if (type === 'groups') {
      await handleExportGroups(values);
    }

    if (type === 'active') {
      await handleExportActive(values);
    }

    onClose?.();
  };

  const handleAction = async () => {
    try {
      if (type === 'select') {
        setAllOpen(false);
        setSelectOpen(true);
      }

      if (type === 'all') {
        const selected = publishers_active.map((record) => record.person_uid);
        await handleExportCards(selected, 'all');
      }
    } catch (error) {
      onClose?.();

      console.error(error);

      await displaySnackNotification({
        header: getMessageByCode('error_app_generic-title'),
        message: getMessageByCode(error.message),
        severity: 'error',
      });
    }
  };

  return {
    type,
    handleChangeType,
    allOpen,
    selectOpen,
    handleAction,
    handleExportCards,
  };
};

export default useExportS21;
