import { useState } from 'react';
import { Box, Stack } from '@mui/material';
import { useAppTranslation } from '@hooks/index';
import { useAtomValue } from 'jotai';
import { publicWitnessingSelectedDateState } from '@states/public_witnessing';
import { dateFormatFriendly } from '@utils/date';
import { IconAdd } from '@components/icons';
import Autocomplete from '@components/autocomplete';
import Button from '@components/button';
import Dialog from '@components/dialog';
import MenuItem from '@components/menuitem';
import Radio from '@components/radio';
import Select from '@components/select';
import Tabs from '@components/tabs';
import Typography from '@components/typography';
import useArrangementForm from './useArrangementForm';
import { ArrangementFormProps } from './index.types';

const ArrangementForm = (props: ArrangementFormProps) => {
  const { t } = useAppTranslation();
  const { slot } = props;

  const selectedDate = useAtomValue(publicWitnessingSelectedDateState);

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
    maxPartners,
    personOptions,
    handleConfirm,
    handleDelete,
    handleDownloadCalendar,
  } = useArrangementForm(props);

  const [step, setStep] = useState<'form' | 'calendar'>('form');

  const handleConfirmClick = async () => {
    const saved = await handleConfirm();
    if (!saved) return;
    if (mode === 'edit') {
      props.onClose();
      return;
    }
    setStep('calendar');
  };

  const updatePartnerName = (index: number, value: string) => {
    setPartnerNames(
      partnerNames.map((name, i) => (i === index ? value : name))
    );
  };

  const nameFields = (numbered: boolean) => (
    <Stack spacing="16px">
      {partnerNames.map((name, index) => (
        <Stack key={index} spacing="8px">
          {numbered && (
            <Typography className="body-small-semibold">
              {t('tr_publisherWithNumber', { publisherNumber: index + 1 })}
            </Typography>
          )}
          <Autocomplete
            freeSolo
            autoSelect
            label={t('tr_name')}
            options={personOptions}
            value={name}
            onChange={(_, value) => {
              const option = Array.isArray(value) ? value.at(0) : value;
              updatePartnerName(
                index,
                typeof option === 'string' ? option : (option?.label ?? '')
              );
            }}
            getOptionLabel={(option) =>
              typeof option === 'string' ? option : option.label
            }
            isOptionEqualToValue={(option, value) =>
              (typeof option === 'string' ? option : option.label) ===
              (typeof value === 'string' ? value : value.label)
            }
          />
        </Stack>
      ))}

      {partnerNames.length < (numbered ? maxPartners + 1 : maxPartners) && (
        <Button
          variant="tertiary"
          startIcon={<IconAdd />}
          onClick={() => setPartnerNames([...partnerNames, ''])}
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

  const myselfForm = (
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
          {Array.from({ length: maxPartners }, (_, index) => (
            <MenuItem key={index + 1} value={index + 1}>
              <Typography>{index + 1}</Typography>
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
              <Typography className="h2">
                {t('tr_confirmArrangement')}
              </Typography>
              <Stack>
                <Typography
                  className="body-small-regular"
                  color="var(--grey-400)"
                >
                  {props.location.location_data.name}
                </Typography>
                <Typography className="body-regular">
                  {dateFormatFriendly(selectedDate)}:{' '}
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

            {mode !== 'join' && isAdmin && (
              <Tabs
                tabs={[
                  { label: t('tr_forMyself') },
                  { label: t('tr_forOthers') },
                ]}
                value={forOthers ? 1 : 0}
                onChange={(tab) => setForOthers(tab === 1)}
              />
            )}

            {mode !== 'join' && (forOthers ? nameFields(true) : myselfForm)}
          </Stack>

          <Stack spacing="8px" width="100%" marginTop="8px">
            <Button variant="main" onClick={handleConfirmClick}>
              {t('tr_confirm')}
            </Button>
            <Button variant="secondary" onClick={props.onClose}>
              {t('tr_cancel')}
            </Button>
            {mode === 'edit' && (
              <Button variant="tertiary" color="red" onClick={handleDelete}>
                {t('tr_delete')}
              </Button>
            )}
          </Stack>
        </>
      )}
    </Dialog>
  );
};

export default ArrangementForm;
