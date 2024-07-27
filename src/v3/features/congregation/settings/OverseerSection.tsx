import { useTranslation } from 'react-i18next';
import {
  CardSection,
  CardSectionContent,
  CardSectionHeader,
  TwoColumnsRow,
} from './CardSection';
import { useState } from 'react';
import { Button, DatePicker, TextField } from '@components/index';
import { IconAdd, IconDelete } from '@components/icons';
import { Box, IconButton } from '@mui/material';

const OverseerSection = () => {
  const { t } = useTranslation();

  const [name, setName] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [weeksOfVisit, setWeeksOfVisit] = useState([null]);

  const addVisitField = () => setWeeksOfVisit([...weeksOfVisit, null]);
  const handleVisitChange = (date: Date, index: number) => {
    const newWeeksOfVisit = [...weeksOfVisit];
    newWeeksOfVisit[index] = date;
    setWeeksOfVisit(newWeeksOfVisit);
  };
  const handleDeleteVisit = (index: number) => {
    const newWeeksOfVisit = [...weeksOfVisit];
    newWeeksOfVisit.splice(index, 1);
    setWeeksOfVisit(newWeeksOfVisit);
  };

  return (
    <CardSection>
      <CardSectionContent sx={{ gap: '16px' }}>
        <CardSectionHeader
          title={t('tr_circuitOverseer')}
          description={t('tr_circuitOverseerSettingDesc')}
        />
        <TwoColumnsRow>
          <TextField
            type="text"
            label={t('tr_name')}
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <TextField
            type="text"
            label={t('tr_displayName')}
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
          />
        </TwoColumnsRow>

        {weeksOfVisit.map((week, index) => (
          <Box key={index} sx={{ display: 'flex', gap: '8px' }}>
            <DatePicker
              disablePast
              label={t('tr_coNextVisitWeek')}
              value={week}
              onChange={(date) => handleVisitChange(date, index)}
            />
            <IconButton
              onClick={() => handleDeleteVisit(index)}
              color="error"
              sx={{
                borderRadius: 'var(--radius-m)',
                width: '48px',
                height: '48px',
              }}
            >
              <IconDelete color="var(--red-main)" />
            </IconButton>
          </Box>
        ))}
        <Button
          variant="small"
          sx={{
            alignSelf: 'flex-start',
            minHeight: '32px',
          }}
          startIcon={<IconAdd />}
          onClick={addVisitField}
        >
          {t('tr_addNextVisit')}
        </Button>
      </CardSectionContent>
    </CardSection>
  );
};

export default OverseerSection;
