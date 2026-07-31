import { useState } from 'react';
import { Box, Stack } from '@mui/material';
import { useAppTranslation } from '@hooks/index';
import { dateFormatFriendly } from '@utils/date';
import { IconAdd, IconDelete } from '@components/icons';
import Autocomplete from '@components/autocomplete';
import Button from '@components/button';
import Dialog from '@components/dialog';
import MenuItem from '@components/menuitem';
import Radio from '@components/radio';
import Select from '@components/select';
import Tabs from '@components/tabs';
import Typography from '@components/typography';
import useArrangementForm, { createPartnerName } from './useArrangementForm';
import { ArrangementFormProps, PersonOption } from './index.types';

const optionLabel = (option?: PersonOption | string | null) => {
  if (!option) return '';
  return typeof option === 'string' ? option : option.label;
};

const ArrangementForm = (props: ArrangementFormProps) => {
  const { t } = useAppTranslation();
  const { slot } = props;

  const {
    mode,
    isAdmin,
    partnerNeeded,
    setPartnerNeeded,
    partnerCount,
    setPartnerCount,
    partnerNames,
    setPartnerNames,
    forOthers,
    setForOthers,
    maxNames,
    canInvitePartners,
    personOptions,
    handleConfirm,
    handleDelete,
    handleDownloadCalendar,
  } = useArrangementForm(props);

  const [step, setStep] = useState<'form' | 'calendar'>('form');

  const partnerCounts = Array.from({ length: maxNames }, (_, i) => i + 1);

  const publisherForm = () => {
    if (isAdmin) {
      return (
        <Tabs
          tabs={[
            { label: t('tr_forMyself'), Component: myselfForm },
            { label: t('tr_forOthers'), Component: nameFields(true) },
          ]}
          value={forOthers ? 1 : 0}
          onChange={(tab) => setForOthers(tab === 1)}
        />
      );
    }

    return forOthers ? nameFields(true) : myselfForm;
  };

  const handleConfirmClick = async () => {
    const saved = await handleConfirm();
    if (!saved) return;
    if (mode === 'edit') {
      props.onClose();
      return;
    }
    setStep('calendar');
  };

  const updatePartnerName = (id: string, value: string) => {
    setPartnerNames(
      partnerNames.map((partner) =>
        partner.id === id ? { ...partner, name: value } : partner
      )
    );
  };

  const nameFields = (numbered: boolean) => (
    <Stack spacing="16px">
      {partnerNames.map((partner, index) => (
        <Stack key={partner.id} spacing="8px">
          {numbered && (
            <Typography
              className="body-small-semibold"
              color="var(--grey-400)"
            >
              {t('tr_publisherWithNumber', { publisherNumber: index + 1 })}
            </Typography>
          )}
          <Autocomplete
            freeSolo
            autoSelect
            label={t('tr_name')}
            options={personOptions}
            value={partner.name}
            onChange={(_, value) => {
              const option = Array.isArray(value) ? value.at(0) : value;
              updatePartnerName(partner.id, optionLabel(option));
            }}
            getOptionLabel={(option) => optionLabel(option)}
            isOptionEqualToValue={(option, value) =>
              optionLabel(option) === optionLabel(value)
            }
          />
        </Stack>
      ))}

      {partnerNames.length < maxNames && (
        <Button
          variant="small"
          disableAutoStretch
          startIcon={<IconAdd />}
          onClick={() => setPartnerNames([...partnerNames, createPartnerName()])}
          sx={{ alignSelf: 'flex-start' }}
        >
          {t('tr_personAdd')}
        </Button>
      )}
    </Stack>
  );

  const radioOption = (
    checked: boolean,
    onSelect: VoidFunction,
    label: string,
    description: string
  ) => (
    <Box
      onClick={onSelect}
      sx={{ display: 'flex', gap: '8px', cursor: 'pointer' }}
    >
      <Radio checked={checked} sx={{ padding: 0, alignSelf: 'flex-start' }} />
      <Stack spacing="2px">
        <Typography className="body-regular">{label}</Typography>
        <Typography className="body-small-regular" color="var(--grey-400)">
          {description}
        </Typography>
      </Stack>
    </Box>
  );

  const myselfForm = !canInvitePartners ? null : (
    <Stack spacing="16px">
      {radioOption(
        partnerNeeded,
        () => setPartnerNeeded(true),
        t('tr_partnerNeeded'),
        t('tr_partnerNeededDesc')
      )}

      {partnerNeeded && (
        <Select
          label={t('tr_count')}
          value={partnerCount}
          onChange={(e) => setPartnerCount(Number(e.target.value))}
        >
          {partnerCounts.map((count) => (
            <MenuItem key={count} value={count}>
              <Typography>{count}</Typography>
            </MenuItem>
          ))}
        </Select>
      )}

      {radioOption(
        !partnerNeeded,
        () => setPartnerNeeded(false),
        t('tr_havePartner'),
        t('tr_havePartnerDesc')
      )}

      {!partnerNeeded && nameFields(false)}
    </Stack>
  );

  return (
    <Dialog open={props.open} onClose={props.onClose} sx={{ padding: '24px' }}>
      {step === 'calendar' ? (
        <>
          <Stack spacing="16px">
            <Typography className="h2">{t('tr_addToCalendar')}</Typography>
            <Typography color="var(--grey-400)">
              {t('tr_addToCalendarDesc')}
            </Typography>
          </Stack>

          <Stack spacing="8px" width="100%">
            <Button
              variant="main"
              onClick={() => {
                handleDownloadCalendar();
                props.onClose();
              }}
            >
              {t('tr_add')}
            </Button>
            <Button variant="secondary" onClick={props.onClose}>
              {t('tr_noThanks')}
            </Button>
          </Stack>
        </>
      ) : (
        <>
          <Stack spacing="16px" width="100%">
            <Stack spacing="8px">
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '16px',
                }}
              >
                <Typography className="h2">
                  {t('tr_confirmArrangement')}
                </Typography>
                {mode === 'edit' && (
                  <Button
                    variant="small"
                    color="red"
                    disableAutoStretch
                    startIcon={<IconDelete color="var(--red-dark)" />}
                    onClick={handleDelete}
                    sx={{ flexShrink: 0 }}
                  >
                    {t('tr_delete')}
                  </Button>
                )}
              </Box>
              <Stack>
                <Typography
                  className="body-small-regular"
                  color="var(--grey-400)"
                >
                  {props.location.location_data.name}
                </Typography>
                <Typography className="body-regular">
                  {dateFormatFriendly(slot.date)}:{' '}
                  <strong>
                    {slot.start_time} - {slot.end_time}
                  </strong>
                </Typography>
              </Stack>
            </Stack>

            {mode === 'join' && (
              <Typography className="body-regular">
                {t('tr_arrangementWith', {
                  publisherName: slot.publishers.join(', '),
                })}
              </Typography>
            )}

            {mode !== 'join' && publisherForm()}
          </Stack>

          <Stack spacing="8px" width="100%">
            <Button variant="main" onClick={handleConfirmClick}>
              {t('tr_confirm')}
            </Button>
            <Button variant="secondary" onClick={props.onClose}>
              {t('tr_cancel')}
            </Button>
          </Stack>
        </>
      )}
    </Dialog>
  );
};

export default ArrangementForm;
