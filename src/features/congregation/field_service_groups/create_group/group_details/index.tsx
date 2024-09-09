import { Box, Stack } from '@mui/material';
import { useAppTranslation, useBreakpoints } from '@hooks/index';
import { GroupHeader, GroupItems } from './index.styles';
import { GroupDetailsProps, UsersOption } from './index.types';
import useGroupDetails from './useGroupDetails';
import Autocomplete from '@components/autocomplete';
import Button from '@components/button';
import Typography from '@components/typography';
import TextField from '@components/textfield';

const GroupDetails = (props: GroupDetailsProps) => {
  const { t } = useAppTranslation();

  const { tablet688Up } = useBreakpoints();

  const {
    overseers,
    handleOverseerChange,
    overseer,
    assistant,
    assistants,
    handleAssistantChange,
    name,
    handleNameChange,
  } = useGroupDetails(props);

  return (
    <Stack spacing="24px">
      <Stack spacing="16px">
        <Typography className="h2">{t('tr_createNewGroupTitle')}</Typography>
        <Typography color="var(--grey-400)">
          {t('tr_createNewGroupDesc')}
        </Typography>
      </Stack>

      <Stack spacing="16px">
        <TextField
          label={t('tr_groupNameOptional')}
          value={name}
          onChange={(e) => handleNameChange(e.target.value)}
        />

        <Box
          sx={{
            display: 'flex',
            flexDirection: tablet688Up ? 'row' : 'column',
            alignItems: 'center',
            gap: '16px',
          }}
        >
          <Autocomplete
            label={t('tr_groupOverseer')}
            options={overseers}
            groupBy={(option) =>
              option.elder ? t('tr_elders') : t('tr_ministerialServants')
            }
            renderGroup={(params) => (
              <li key={params.key}>
                <GroupHeader className="body-small-semibold">
                  {params.group}
                </GroupHeader>
                <GroupItems>{params.children}</GroupItems>
              </li>
            )}
            getOptionLabel={(option: UsersOption) => option.person_name}
            isOptionEqualToValue={(option, value) =>
              option.person_uid === value.person_uid
            }
            value={overseer}
            onChange={(_, value: UsersOption) => handleOverseerChange(value)}
            renderOption={(props, option) => (
              <Box
                component="li"
                {...props}
                sx={{ margin: 0, padding: 0 }}
                key={option.person_uid}
              >
                <Typography>{option.person_name}</Typography>
              </Box>
            )}
          />

          <Autocomplete
            label={t('tr_groupOverseerAssistant')}
            options={assistants}
            groupBy={(option) =>
              option.elder ? t('tr_elders') : t('tr_ministerialServants')
            }
            renderGroup={(params) => (
              <li key={params.key}>
                <GroupHeader className="body-small-semibold">
                  {params.group}
                </GroupHeader>
                <GroupItems>{params.children}</GroupItems>
              </li>
            )}
            getOptionLabel={(option: UsersOption) => option.person_name}
            isOptionEqualToValue={(option, value) =>
              option.person_uid === value.person_uid
            }
            value={assistant}
            onChange={(_, value: UsersOption) => handleAssistantChange(value)}
            renderOption={(props, option) => (
              <Box
                component="li"
                {...props}
                sx={{ margin: 0, padding: 0 }}
                key={option.person_uid}
              >
                <Typography>{option.person_name}</Typography>
              </Box>
            )}
          />
        </Box>
      </Stack>

      <Stack spacing="8px">
        <Button variant="main" onClick={props.action}>
          {t('tr_next')}
        </Button>
        <Button variant="secondary" onClick={props.onClose}>
          {t('tr_cancel')}
        </Button>
      </Stack>
    </Stack>
  );
};

export default GroupDetails;
