import { HTMLAttributes, ReactNode } from 'react';
import { AutocompleteRenderGroupParams, Box, Popper } from '@mui/material';
import { PersonOptionsType, PersonSelectorType } from '../index.types';
import {
  IconAssignmetHistory,
  IconClose,
  IconEdit,
  IconMale,
} from '@components/icons';
import { useAppTranslation, useBreakpoints } from '@hooks/index';
import useBrotherSelector from './useBrotherSelector';
import AutoComplete from '@components/autocomplete';
import AssignmentsHistoryDialog from '@features/meetings/assignments_history_dialog';
import IconButton from '@components/icon_button';
import Typography from '@components/typography';

const dutiesGroupBy = (option: PersonOptionsType) =>
  option.conflict?.length > 0 ? 'conflict' : 'free';

const getDecorator = (
  helperText: string,
  isLinkedPart: boolean,
  helperSeverity: string
) => {
  if (!helperText.length || isLinkedPart) return false;
  return helperSeverity === 'error' ? 'error' : true;
};

const BrotherOption = ({
  optionProps,
  option,
  showIcon,
  isDutiesField,
}: {
  optionProps: HTMLAttributes<HTMLLIElement>;
  option: PersonOptionsType;
  showIcon: boolean;
  isDutiesField: boolean;
}) => (
  <Box
    component="li"
    {...optionProps}
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
      sx={{ display: 'flex', alignItems: 'center', gap: '8px', width: '100%' }}
    >
      {showIcon && <IconMale />}

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
        <Typography className="body-regular">{option.person_name}</Typography>

        {option.conflict?.length > 0 && (
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
            {option.conflict}
          </Typography>
        )}
      </Box>
    </Box>

    {!isDutiesField && (
      <Box sx={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <Typography
          className="body-small-regular"
          color="var(--grey-350)"
          align="center"
          sx={{ width: '85px' }}
        >
          {option.last_assignment}
        </Typography>
      </Box>
    )}
  </Box>
);

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
        {group === 'free'
          ? t('tr_noOtherAssignments')
          : t('tr_withOtherAssignments')}
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
          color="var(--grey-350)"
          sx={{ width: '200px' }}
        >
          {t('tr_name')}
        </Typography>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Typography
            className="body-small-regular"
            color="var(--grey-350)"
            align="center"
            sx={{ width: '85px' }}
          >
            {t('tr_lastAssignment')}
          </Typography>
        </Box>
      </Box>
    </>
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
          sx={{ padding: 0, position: 'absolute', right: 35, top: 12 }}
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
    options,
    handleSaveAssignment,
    value,
    helperText,
    helperSeverity,
    isDutiesField,
    handleCloseHistory,
    handleOpenHistory,
    isHistoryOpen,
    personHistory,
    isFreeSolo,
    inputValue,
    handleValueChange,
    isLinkedPart,
  } = useBrotherSelector(props);

  const helperColor =
    helperSeverity === 'error' ? 'var(--red-main)' : 'var(--orange-dark)';

  return (
    <Box sx={{ position: 'relative' }}>
      {isHistoryOpen && (
        <AssignmentsHistoryDialog
          open={isHistoryOpen}
          onClose={handleCloseHistory}
          person={value.person_name}
          history={personHistory}
        />
      )}

      <AutoComplete
        freeSolo={isFreeSolo}
        readOnly={props.readOnly}
        label={props.label}
        isOptionEqualToValue={(option, value) =>
          option.person_uid === value.person_uid
        }
        getOptionLabel={(option: PersonOptionsType) => option.person_name}
        options={options}
        value={value}
        endIcon={props.endIcon}
        inputValue={inputValue}
        onInputChange={(_, value) => handleValueChange(value)}
        onChange={(_, value: PersonOptionsType) => handleSaveAssignment(value)}
        fullWidth={true}
        groupBy={isDutiesField ? dutiesGroupBy : undefined}
        renderGroup={isDutiesField ? renderBrotherGroup : undefined}
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
            isDutiesField={isDutiesField}
          />
        )}
        optionsHeader={isDutiesField ? null : <BrothersHeader />}
        styleIcon={false}
        startIcon={showIcon ? <IconMale /> : null}
        decorator={getDecorator(helperText, isLinkedPart, helperSeverity)}
        clearIcon={<IconClose width={20} height={20} />}
        sx={{
          // nudge only the resting label, not the floated one
          '& .MuiInputLabel-root[data-shrink=false]': {
            top: '-5px !important',
          },

          '& .MuiOutlinedInput-root': {
            height: '48px !important',
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
