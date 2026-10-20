import { HTMLAttributes, Key, MouseEvent, ReactNode } from 'react';
import {
  AutocompleteRenderGroupParams,
  Box,
  FormControlLabel,
  Popper,
  RadioGroup,
} from '@mui/material';
import { PersonOptionsType, PersonSelectorType } from '../index.types';
import {
  assignmentConflictGroup,
  formatAssignmentConflict,
} from '@utils/assignment_conflicts';
import { DutiesGender } from '@definition/schedules';
import {
  IconAssignmetHistory,
  IconClose,
  IconEdit,
  IconFemale,
  IconMale,
} from '@components/icons';
import { useAppTranslation, useBreakpoints } from '@hooks/index';
import useBrotherSelector from './useBrotherSelector';
import AutoComplete from '@components/autocomplete';
import AssignmentsHistoryDialog from '@features/meetings/assignments_history_dialog';
import IconButton from '@components/icon_button';
import Radio from '@components/radio';
import Typography from '@components/typography';

const dutiesGroupBy = (option: PersonOptionsType) =>
  String(assignmentConflictGroup(option.conflict));

const BrotherOption = ({
  optionProps,
  option,
  showIcon,
  isWeekConflictField,
}: {
  optionProps: HTMLAttributes<HTMLLIElement>;
  option: PersonOptionsType;
  showIcon: boolean;
  isWeekConflictField: boolean;
}) => {
  const { t } = useAppTranslation();
  const { key, ...listItemProps } =
    optionProps as HTMLAttributes<HTMLLIElement> & { key?: Key };
  return (
    <Box
      key={key}
      component="li"
      {...listItemProps}
      sx={{
        margin: 0,
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        justifyContent: 'space-between',
        padding: '8px 10px 0 0',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          width: '100%',
        }}
      >
        {showIcon &&
          (option.person_data.male.value ? <IconMale /> : <IconFemale />)}

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <Typography className="body-regular">{option.person_name}</Typography>

          {option.conflict && (
            <Typography
              className="label-small-regular"
              color="var(--grey-350)"
              sx={{
                // stay muted when the row turns accent on hover
                '.MuiAutocomplete-option:hover &': {
                  color: 'var(--accent-400) !important',
                },
              }}
            >
              {formatAssignmentConflict(option.conflict, (time) =>
                t('tr_assignmentDurationShort', { time })
              )}
            </Typography>
          )}
        </Box>
      </Box>

      {!isWeekConflictField && (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Typography
            className="body-small-regular"
            align="center"
            sx={{
              color: 'var(--grey-350)',
              width: '85px',
            }}
          >
            {option.last_assignment}
          </Typography>
        </Box>
      )}
    </Box>
  );
};

const BrotherGroup = ({
  group,
  children,
}: {
  group: string;
  children: ReactNode;
}) => {
  const { t } = useAppTranslation();

  return (
    <>
      <Typography
        className="body-small-semibold"
        color="var(--accent-main)"
        sx={{ padding: '8px 12px 4px 16px' }}
      >
        {group === '0'
          ? t('tr_noOtherAssignments')
          : group === '1'
            ? t('tr_withMeetingParts')
            : t('tr_withDuties')}
      </Typography>
      <ul style={{ padding: 0, margin: 0 }}>{children}</ul>
    </>
  );
};

const renderBrotherGroup = (params: AutocompleteRenderGroupParams) => (
  <li key={params.key}>
    <BrotherGroup group={params.group}>{params.children}</BrotherGroup>
  </li>
);

const BrothersHeader = () => {
  const { t } = useAppTranslation();

  return (
    <>
      <Typography className="h3" sx={{ padding: '8px 0px' }}>
        {t('tr_brothers')}
      </Typography>

      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          justifyContent: 'space-between',
          padding: '8px 10px 0 0',
        }}
      >
        <Typography
          className="body-small-regular"
          sx={{
            color: 'var(--grey-350)',
            width: '200px',
          }}
        >
          {t('tr_name')}
        </Typography>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Typography
            className="body-small-regular"
            align="center"
            sx={{
              color: 'var(--grey-350)',
              width: '85px',
            }}
          >
            {t('tr_lastAssignment')}
          </Typography>
        </Box>
      </Box>
    </>
  );
};

const DutiesGenderHeader = ({
  gender,
  onChange,
}: {
  gender: DutiesGender;
  onChange: (e: MouseEvent<HTMLLabelElement>, value: DutiesGender) => void;
}) => {
  const { t } = useAppTranslation();

  return (
    <RadioGroup
      sx={{
        flexDirection: 'row',
        padding: '8px 0 8px 8px',
        width: '100%',
        gap: '16px',
        flexWrap: 'wrap',
      }}
      value={gender}
    >
      <FormControlLabel
        value="male"
        control={<Radio />}
        label={<Typography>{t('tr_male')}</Typography>}
        onClick={(e) => onChange(e, 'male')}
      />
      <FormControlLabel
        value="female"
        control={<Radio />}
        label={<Typography>{t('tr_female')}</Typography>}
        onClick={(e) => onChange(e, 'female')}
      />
    </RadioGroup>
  );
};

const SelectorAdornments = ({
  showAssignmentsHistory,
  hasValue,
  helperText,
  helperColor,
  isLinkedPart,
  desktopUp,
  onOpenHistory,
  onEditClick,
}: {
  showAssignmentsHistory: boolean;
  hasValue: boolean;
  helperText: string;
  helperColor: string;
  isLinkedPart: boolean;
  desktopUp: boolean;
  onOpenHistory: () => void;
  onEditClick?: () => void;
}) => {
  const { t } = useAppTranslation();

  const iconColor = helperText.length > 0 ? helperColor : 'var(--accent-main)';

  return (
    <>
      {showAssignmentsHistory && hasValue && (
        <IconButton
          sx={{ padding: 0, position: 'absolute', right: 35, top: 10 }}
          title={t('tr_assignmentHistory')}
          onClick={onOpenHistory}
        >
          <IconAssignmetHistory color={iconColor} />
        </IconButton>
      )}

      {onEditClick && (
        <IconButton
          sx={{ padding: 0, position: 'absolute', right: 35, top: 10 }}
          onClick={onEditClick}
        >
          <IconEdit color={iconColor} />
        </IconButton>
      )}

      {helperText.length > 0 && (
        <Typography
          className="label-small-regular"
          color={isLinkedPart ? 'var(--grey-350)' : helperColor}
          sx={{
            padding: '4px 16px 0 16px',
            maxWidth: desktopUp ? '350px' : '100%',
          }}
        >
          {helperText}
        </Typography>
      )}
    </>
  );
};

const BrotherSelector = (props: PersonSelectorType) => {
  const showIcon = props.showIcon ?? true;
  const showAssignmentsHistory = props.showAssignmentsHistory ?? true;

  const { desktopUp } = useBreakpoints();

  const {
    handleSaveAssignment,
    value,
    helperText,
    helperSeverity,
    isWeekConflictField,
    handleCloseHistory,
    handleOpenHistory,
    isHistoryOpen,
    personHistory,
    isFreeSolo,
    inputValue,
    handleValueChange,
    isLinkedPart,
    isMeetingConflict,
    showGenderSelector,
    gender,
    handleGenderChange,
    filterOptions,
    options,
  } = useBrotherSelector(props);

  let optionsHeader: ReactNode = <BrothersHeader />;

  if (isWeekConflictField) {
    optionsHeader = showGenderSelector ? (
      <DutiesGenderHeader gender={gender} onChange={handleGenderChange} />
    ) : null;
  }

  const valueIcon =
    value && !value.person_data.male.value ? <IconFemale /> : <IconMale />;

  let helperColor = 'var(--orange-dark)';

  if (isLinkedPart) {
    helperColor = 'var(--grey-350)';
  } else if (isMeetingConflict || helperSeverity === 'error') {
    helperColor = 'var(--red-main)';
  }

  return (
    <Box sx={{ position: 'relative' }}>
      {isHistoryOpen && (
        <AssignmentsHistoryDialog
          open={isHistoryOpen}
          onClose={handleCloseHistory}
          person={value?.person_name ?? ''}
          history={personHistory}
        />
      )}

      <AutoComplete
        freeSolo={isFreeSolo}
        readOnly={props.readOnly}
        label={props.label}
        isOptionEqualToValue={(option, value) =>
          typeof option !== 'string' &&
          typeof value !== 'string' &&
          option.person_uid === value.person_uid
        }
        getOptionLabel={(option) =>
          typeof option === 'string' ? option : (option.person_name ?? '')
        }
        options={options}
        filterOptions={filterOptions}
        value={value}
        endIcon={props.endIcon}
        inputValue={inputValue}
        onInputChange={(_, value) => handleValueChange(value)}
        onChange={(_, value) => {
          if (!Array.isArray(value)) void handleSaveAssignment(value);
        }}
        fullWidth={true}
        groupBy={isWeekConflictField ? dutiesGroupBy : undefined}
        renderGroup={isWeekConflictField ? renderBrotherGroup : undefined}
        slots={{
          popper(props) {
            return (
              <Popper
                {...props}
                style={{ minWidth: 320 }}
                placement="bottom-start"
              />
            );
          },
        }}
        renderOption={(optionProps, option) => (
          <BrotherOption
            key={option.person_uid}
            optionProps={optionProps}
            option={option}
            showIcon={showIcon}
            isWeekConflictField={isWeekConflictField}
          />
        )}
        optionsHeader={optionsHeader}
        styleIcon={false}
        height={44}
        startIcon={showIcon ? valueIcon : undefined}
        decorator={helperText.length > 0 && !isLinkedPart}
        decoratorColor={
          isMeetingConflict || helperSeverity === 'error'
            ? 'var(--red-main)'
            : undefined
        }
        clearIcon={<IconClose width={20} height={20} />}
        sx={{
          '& .MuiOutlinedInput-root': {
            height: '44px !important',
          },
          '& .MuiOutlinedInput-input': {
            paddingRight: props.endIcon ? '10px !important' : '80px !important',
          },
          '& .MuiAutocomplete-clearIndicator': {
            marginRight: value ? '30px' : 'initial',
          },
        }}
      />

      <SelectorAdornments
        showAssignmentsHistory={showAssignmentsHistory}
        hasValue={Boolean(value)}
        helperText={helperText}
        helperColor={helperColor}
        isLinkedPart={isLinkedPart}
        desktopUp={desktopUp}
        onOpenHistory={handleOpenHistory}
        onEditClick={props.onEditClick}
      />
    </Box>
  );
};

export default BrotherSelector;
