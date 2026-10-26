import { useEffect, useRef, useState } from 'react';
import { useAtomValue } from 'jotai';
import { hour24FormatState, userLocalUIDState } from '@states/settings';
import { Box, Stack } from '@mui/material';
import { useAppTranslation } from '@hooks/index';
import {
  dateFormatFriendly,
  formatDate,
  generateDateFromTime,
} from '@utils/date';
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
import usePublicWitnessingPermissions from '../usePermissions';
import {
  ArrangementFormProps,
  ArrangementEditorProps,
  PersonOption,
} from './index.types';

const optionLabel = (option?: PersonOption | string | null) => {
  if (!option) return '';
  return typeof option === 'string' ? option : option.label;
};

const ArrangementEditor = (props: ArrangementEditorProps) => {
  const { t } = useAppTranslation();
  const { slot } = props;
  const hour24 = useAtomValue(hour24FormatState);
  const timeFormat = hour24 ? 'HH:mm' : 'h:mm aaa';

  const {
    mode,
    canJoin,
    saveError,
    companionNames,
    editingOthers,
    joinedBooking,
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
    canConfirm,
    personOptions,
    handleConfirm,
    handleDelete,
    handleDownloadCalendar,
  } = useArrangementForm(props);

  const [step, setStep] = useState<'form' | 'calendar'>('form');
  const [isSaving, setIsSaving] = useState(false);
  const calendarHeadingRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    if (step === 'calendar') calendarHeadingRef.current?.focus();
  }, [step]);

  const partnerCounts = Array.from({ length: maxNames }, (_, i) => i + 1);

  const publisherForm = () => {
    if (isAdmin && !editingOthers) {
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
    if (isSaving) return;

    setIsSaving(true);

    try {
      const saved = await handleConfirm();
      if (!saved) return;
      if (mode === 'edit') {
        props.onClose();
        return;
      }
      setStep('calendar');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteClick = async () => {
    if (isSaving) return;
    setIsSaving(true);
    try {
      await handleDelete();
    } finally {
      setIsSaving(false);
    }
  };

  const updatePartnerName = (
    id: string,
    value?: PersonOption | string | null
  ) => {
    setPartnerNames((previous) =>
      previous.map((partner) => {
        if (partner.id !== id) return partner;

        let person_uid: string | undefined;
        if (value && typeof value !== 'string') {
          person_uid = value.id;
        } else if (typeof value === 'string' && value === partner.name) {
          person_uid = partner.person_uid;
        }

        return { ...partner, name: optionLabel(value), person_uid };
      })
    );
  };

  const nameFields = (numbered: boolean) => (
    <Stack spacing="16px">
      {partnerNames.map((partner, index) => (
        <Stack key={partner.id} spacing="8px">
          {numbered && (
            <Typography
              className="body-small-semibold"
              sx={{ color: 'var(--grey-400)' }}
            >
              {t('tr_publisherWithNumber', { publisherNumber: index + 1 })}
            </Typography>
          )}
          <Autocomplete
            freeSolo
            autoSelect
            label={t(
              joinedBooking && !forOthers ? 'tr_PWAdditionalPartner' : 'tr_name'
            )}
            options={personOptions}
            getOptionKey={(option) =>
              typeof option === 'string' ? option : option.id
            }
            value={
              partner.person_uid
                ? (personOptions.find(
                    (option) => option.id === partner.person_uid
                  ) ?? partner.name)
                : partner.name
            }
            onInputChange={(_, value, reason) => {
              if (reason === 'input' || reason === 'clear') {
                updatePartnerName(partner.id, value);
              }
            }}
            onChange={(_, value) => {
              const option = Array.isArray(value) ? value.at(0) : value;
              updatePartnerName(partner.id, option);
            }}
            getOptionLabel={(option) => optionLabel(option)}
            isOptionEqualToValue={(option, value) =>
              typeof option !== 'string' && typeof value !== 'string'
                ? option.id === value.id
                : option === value
            }
          />
        </Stack>
      ))}

      {partnerNames.length < maxNames && (
        <Button
          variant="small"
          disableAutoStretch
          startIcon={<IconAdd />}
          onClick={() =>
            setPartnerNames([...partnerNames, createPartnerName()])
          }
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
      component="label"
      sx={{ display: 'flex', gap: '8px', cursor: 'pointer' }}
    >
      <Radio
        name="public-witnessing-partner"
        onChange={onSelect}
        checked={checked}
        sx={{ padding: 0, alignSelf: 'flex-start' }}
      />
      <Stack spacing="2px">
        <Typography className="body-regular">{label}</Typography>
        <Typography
          className="body-small-regular"
          sx={{ color: 'var(--grey-400)' }}
        >
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
          inputProps={{ 'aria-label': t('tr_count') }}
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
    <Dialog
      open={props.open}
      onClose={props.onClose}
      title={t(
        step === 'calendar'
          ? 'tr_addToCalendar'
          : slot.retired
            ? 'tr_PWRetiredShiftTitle'
            : 'tr_confirmArrangement'
      )}
      header={
        step === 'calendar' ? (
          <Typography
            component="h2"
            className="h2"
            ref={calendarHeadingRef}
            tabIndex={-1}
          >
            {t('tr_addToCalendar')}
          </Typography>
        ) : (
          <Stack spacing="8px" sx={{ minWidth: 0 }}>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'flex-start',
                justifyContent: 'space-between',
                gap: '16px',
              }}
            >
              <Typography component="h2" className="h2">
                {t(
                  slot.retired
                    ? 'tr_PWRetiredShiftTitle'
                    : 'tr_confirmArrangement'
                )}
              </Typography>
              {mode === 'edit' && (
                <Button
                  variant="small"
                  color="red"
                  disableAutoStretch
                  startIcon={<IconDelete color="var(--red-dark)" />}
                  onClick={handleDeleteClick}
                  disabled={isSaving}
                  sx={{ flexShrink: 0 }}
                >
                  {t('tr_delete')}
                </Button>
              )}
            </Box>
            {slot.retired && (
              <Typography
                className="body-small-regular"
                sx={{ color: 'var(--grey-400)' }}
              >
                {t('tr_PWRetiredShift')}
              </Typography>
            )}
          </Stack>
        )
      }
      actions={
        step === 'calendar' ? (
          <Stack spacing="8px" sx={{ width: '100%' }}>
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
        ) : (
          <Stack spacing="8px" sx={{ width: '100%' }}>
            {!slot.retired && (
              <Button
                variant="main"
                disabled={isSaving || !canConfirm}
                onClick={handleConfirmClick}
              >
                {t('tr_confirm')}
              </Button>
            )}
            <Button
              variant={slot.retired ? 'main' : 'secondary'}
              onClick={props.onClose}
            >
              {t(slot.retired ? 'tr_close' : 'tr_cancel')}
            </Button>
          </Stack>
        )
      }
    >
      {step === 'calendar' ? (
        <>
          <Stack spacing="16px">
            <Typography role="status">
              {t('tr_PWArrangementConfirmed')}
            </Typography>
            <Typography sx={{ color: 'var(--grey-400)' }}>
              {t('tr_addToCalendarDesc')}
            </Typography>
          </Stack>
        </>
      ) : (
        <>
          <Stack spacing="16px" sx={{ width: '100%' }}>
            <Stack spacing="8px">
              <Stack>
                <Typography
                  className="body-small-regular"
                  sx={{ color: 'var(--grey-400)' }}
                >
                  {props.location.location_data.name}
                </Typography>
                <Typography className="body-regular">
                  {dateFormatFriendly(slot.date)}:{' '}
                  <strong>
                    {formatDate(
                      generateDateFromTime(slot.start_time),
                      timeFormat
                    )}{' '}
                    -{' '}
                    {formatDate(
                      generateDateFromTime(slot.end_time),
                      timeFormat
                    )}
                  </strong>
                </Typography>
              </Stack>
            </Stack>

            {isAdmin &&
              slot.arrangements.length > 0 &&
              (slot.arrangements.length > 1 || canJoin) && (
                <Select
                  label={t('tr_selectArrangement')}
                  inputProps={{ 'aria-label': t('tr_selectArrangement') }}
                  value={props.selectedArrangementUID}
                  onChange={(event) =>
                    props.onArrangementChange(String(event.target.value))
                  }
                  disabled={isSaving}
                >
                  {canJoin && (
                    <MenuItem value="join">{t('tr_PWJoinShift')}</MenuItem>
                  )}
                  {slot.arrangements.map((arrangement) => (
                    <MenuItem
                      key={arrangement.arrangement_uid}
                      value={arrangement.arrangement_uid}
                    >
                      <Typography>
                        {arrangement.arrangement_data.publishers
                          .map((publisher) => publisher.name)
                          .join(', ')}
                      </Typography>
                    </MenuItem>
                  ))}
                </Select>
              )}

            {(slot.retired ||
              mode === 'join' ||
              editingOthers ||
              joinedBooking) && (
              <Typography className="body-regular">
                {t('tr_arrangementWith', {
                  publisherName: (joinedBooking
                    ? companionNames
                    : slot.publishers
                  ).join(', '),
                })}
              </Typography>
            )}

            {saveError && (
              <Typography role="alert" sx={{ color: 'var(--red-dark)' }}>
                {t(saveError)}
              </Typography>
            )}
            {!slot.retired && mode !== 'join' && publisherForm()}
          </Stack>
        </>
      )}
    </Dialog>
  );
};

const ArrangementForm = (props: ArrangementFormProps) => {
  const userUID = useAtomValue(userLocalUIDState);
  const { canManageLocations } = usePublicWitnessingPermissions();
  const [selectedArrangementUID, setSelectedArrangementUID] = useState(
    () =>
      props.slot.myArrangement?.arrangement_uid ??
      props.slot.arrangements.find((record) =>
        record.arrangement_data.publishers.some(
          (publisher) => publisher.person_uid === userUID
        )
      )?.arrangement_uid ??
      (props.slot.status === 'partner_needed'
        ? 'join'
        : (props.slot.arrangements[0]?.arrangement_uid ?? ''))
  );
  const arrangement = canManageLocations
    ? props.slot.arrangements.find(
        (record) => record.arrangement_uid === selectedArrangementUID
      )
    : props.slot.myArrangement;

  return (
    <ArrangementEditor
      key={arrangement?.arrangement_uid ?? 'new'}
      {...props}
      arrangement={arrangement}
      selectedArrangementUID={selectedArrangementUID}
      onArrangementChange={setSelectedArrangementUID}
    />
  );
};

export default ArrangementForm;
