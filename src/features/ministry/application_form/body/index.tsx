import { Box, Stack } from '@mui/material';
import { useAppTranslation, useBreakpoints } from '@hooks/index';
import { ApplicationFormProps } from '../index.types';
import useFormBody from './useFormBody';
import Card from '@components/card';
import Checkbox from '@components/checkbox';
import CommitteeMember from '../sc_member';
import DatePicker from '@components/date_picker';
import Markup from '@components/text_markup';
import MenuItem from '@components/menuitem';
import Select from '@components/select';
import TextField from '@components/textfield';
import Typography from '@components/typography';

const FormBody = (props: ApplicationFormProps) => {
  const { t } = useAppTranslation();

  const { laptopUp, tabletDown } = useBreakpoints();

  const {
    moral_text,
    coordinator,
    secretary,
    service,
    handleSetDate,
    handleSetName,
    monthOptions,
    handleSetMonths,
    handleFormatMonths,
    handleToggleContinuous,
    application,
  } = useFormBody(props);

  return (
    <Card>
      <Typography className="h2">{t('tr_applicationAPS')}</Typography>
      <Typography>{t('tr_applicationAPSDesc')}</Typography>

      <Box
        sx={{
          display: 'flex',
          alignItems: laptopUp ? 'center' : 'unset',
          gap: '16px',
          flexDirection: laptopUp ? 'row' : 'column',
        }}
      >
        <Select
          label={t('tr_theMonthsOf')}
          multiple
          value={application.months}
          renderValue={(values: string[]) => handleFormatMonths(values)}
          onChange={(e) => handleSetMonths(e.target.value as string[])}
          sx={{ flex: 1 }}
        >
          {monthOptions.map((record) => (
            <MenuItem key={record.value} value={record.value}>
              <Checkbox
                label={record.label}
                checked={application.months.includes(record.value)}
              />
            </MenuItem>
          ))}
        </Select>

        <Checkbox
          label={t('tr_continuousAP')}
          checked={application.continuous}
          onChange={(e) => handleToggleContinuous(e.target.checked)}
          sx={{ flex: 1 }}
        />
      </Box>

      <Markup
        content={moral_text}
        className="body-regular"
        anchorClassName="h4"
      />

      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: '16px',
          flexDirection: tabletDown ? 'column' : 'row',
        }}
      >
        <Box
          sx={{
            maxWidth: tabletDown ? 'unset' : '200px',
            width: tabletDown ? '100%' : 'unset',
          }}
        >
          <DatePicker
            value={application.date}
            onChange={(value) => handleSetDate(value)}
          />
        </Box>
        <TextField
          label={t('tr_nameAPSApplication')}
          value={application.name}
          onChange={(e) => handleSetName(e.target.value)}
          sx={{ flex: 1 }}
        />
      </Box>

      <Box
        sx={{
          display: 'flex',
          gap: laptopUp ? '80px' : '24px',
          flexDirection: laptopUp ? 'row' : 'column',
        }}
      >
        <Stack spacing="16px" flex={1}>
          <Typography className="h4">{t('tr_noteAPSApplication')}</Typography>
          <Markup content={t('tr_attentionServiceCommittee')} className="h4" />
        </Stack>

        <Stack spacing="16px" flex={1}>
          <Typography className="h4" textAlign="center">
            {t('tr_approvingAPSApplication')}
          </Typography>

          <Stack spacing="8px">
            <CommitteeMember name={coordinator} role={t('tr_coordinator')} />
            <CommitteeMember name={secretary} role={t('tr_serviceOverseer')} />
            <CommitteeMember name={service} role={t('tr_secretary')} />
          </Stack>
        </Stack>
      </Box>
    </Card>
  );
};

export default FormBody;
