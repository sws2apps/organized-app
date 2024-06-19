import useAppTranslation from '@hooks/useAppTranslation';
import { CardSection, CardSectionContent, CardSectionHeader } from './CardSection';
import { useState } from 'react';
import { MenuItem, TextField } from '@components/index';
import SwitchItem from './SwitchItem';
import { LANGUAGE_LIST } from '@constants/index';

const MeetingSection = () => {
  const { t, i18n } = useAppTranslation();

  const [autoCheckUpdates, setAutoCheckUpdates] = useState(true);
  const [autoCheckFrequency, setAutoCheckFrequency] = useState('week');
  const [language, setLanguage] = useState(i18n.language);

  // Meeting schedules settings
  const [displayExactDate, setDisplayExactDate] = useState(true);
  const [useDisplayNameMeeting, setUseDisplayNameMeeting] = useState(false);
  const [useDisplayNameOthers, setUseDisplayNameOthers] = useState(false);

  // text formats
  const [nameFormat, setNameFormat] = useState('firstLast');
  const [dateFormat, setDateFormat] = useState('dateFormat1');

  return (
    <CardSection>
      <CardSectionContent sx={{ gap: '16px' }}>
        <CardSectionHeader title={t('tr_meetinMaterialsTitle')} description={t('tr_meetinMaterialsDesc')} />

        <SwitchItem
          value={autoCheckUpdates}
          setValue={setAutoCheckUpdates}
          label={t('tr_autoCheckUpdate')}
          helper={t('tr_autoCheckUpdateDesc')}
        />
        <TextField
          select
          label={t('tr_autoCheckFrequency')}
          value={autoCheckFrequency}
          onChange={(e) => setAutoCheckFrequency(e.target.value)}
        >
          <MenuItem value="week">{t('tr_everyWeek')}</MenuItem>
          <MenuItem value="twoWeeks">{t('tr_everyTwoWeeks')}</MenuItem>
          <MenuItem value="month">{t('tr_everyMonth')}</MenuItem>
        </TextField>
        <TextField select label={t('tr_changeLanguage')} value={language} onChange={(e) => setLanguage(e.target.value)}>
          {LANGUAGE_LIST.map((lang) => {
            return (
              <MenuItem key={lang.locale} value={lang.locale}>
                {lang.name}
              </MenuItem>
            );
          })}
        </TextField>
      </CardSectionContent>
      <CardSectionContent sx={{ gap: '16px' }}>
        <SwitchItem
          value={displayExactDate}
          setValue={setDisplayExactDate}
          label={t('tr_exactDatesOnMidweekMeetings')}
          helper={t('tr_exactDatesOnMidweekMeetingsDesc')}
        />
        <SwitchItem
          value={useDisplayNameMeeting}
          setValue={setUseDisplayNameMeeting}
          label={t('tr_useDisplayNameMeeting')}
          helper={t('tr_exactDatesOnMidweekMeetingsDesc')}
        />
        <SwitchItem
          value={useDisplayNameOthers}
          setValue={setUseDisplayNameOthers}
          label={t('tr_useDisplayNameOthers')}
          helper={t('tr_useDisplayNameMeetingDesc')}
        />
      </CardSectionContent>
      <CardSectionContent sx={{ gap: '16px' }}>
        <TextField select label={t('tr_nameFormat')} value={nameFormat} onChange={(e) => setNameFormat(e.target.value)}>
          <MenuItem value="firstLast">{t('tr_formatFirstLast')}</MenuItem>
          <MenuItem value="lastFirst">{t('tr_formatLastFirst')}</MenuItem>
        </TextField>
        <TextField select label={t('tr_dateFormat')} value={dateFormat} onChange={(e) => setDateFormat(e.target.value)}>
          <MenuItem value="dateFormat1">{t('tr_dateFormat1')}</MenuItem>
          <MenuItem value="dateFormat2">{t('tr_dateFormat2')}</MenuItem>
          <MenuItem value="dateFormat3">{t('tr_dateFormat3')}</MenuItem>
        </TextField>
      </CardSectionContent>
    </CardSection>
  );
};

export default MeetingSection;
