import { Box, Stack } from '@mui/material';
import { useAppTranslation } from '@hooks/index';
import { GroupInfoProps } from './index.types';
import useGroupInfo from './useGroupInfo';
import Button from '@components/button';
import Dialog from '@components/dialog';
import LanguageGroupMembers from '../group_members';
import LanguageGroupDetails from '../group_details';
import Tabs from '@components/tabs';
import Typography from '@components/typography';
import GroupDelete from '../group_delete';
import GroupFormat from '../group_format';
import { CardSection, CardSectionHeader } from '../../shared_styles';

const GroupInfo = (props: GroupInfoProps) => {
  const { t } = useAppTranslation();

  const {
    isProcessing,
    groupEdit,
    handleCircuitChange,
    handleLanguageChange,
    handleNameChange,
    circuit,
    handleClose,
    handleGroupChange,
    language,
  } = useGroupInfo(props);

  const content = (
    <>
      {!props.inline && <Typography className="h2">{props.group.group_data.name}</Typography>}
      {props.inline && <CardSectionHeader title={props.group.group_data.name} />}

      <Box
        sx={{
          width: '100%',
          // Override the Tabs panel's default 24px bottom padding in inline mode
          // to avoid extra whitespace inside the card. This targets MUI's Tabs
          // internal structure (CustomTabPanel > Box). If the Tabs component's
          // DOM changes, this selector must be updated accordingly.
          ...(props.inline && {
            '& [role="tabpanel"] > .MuiBox-root': {
              paddingBottom: 0,
            },
          }),
        }}
      >
        <Tabs
          tabs={[
            {
              label: t('tr_details'),
              Component: (
                <LanguageGroupDetails
                  name={groupEdit.group_data.name}
                  onNameChange={handleNameChange}
                  circuit={circuit}
                  onCircuitChange={handleCircuitChange}
                  language={language}
                  onLanguageChange={handleLanguageChange}
                />
              ),
            },
            {
              label: t('tr_groupMembers'),
              Component: (
                <LanguageGroupMembers
                  readOnly={isProcessing}
                  group={groupEdit}
                  onChange={handleGroupChange}
                />
              ),
            },
          ]}
        />
      </Box>

      {!props.inline && (
        <Box sx={{ margin: '16px 0' }}>
          <GroupFormat groupId={props.group.group_id} />
        </Box>
      )}

      {!props.inline && (
        <Stack spacing="8px" width="100%">
          <Button variant="main" onClick={handleClose}>
            {t('tr_done')}
          </Button>
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: '8px' }}>
            <GroupDelete group={props.group} />
          </Box>
        </Stack>
      )}
    </>
  );

  if (props.inline) {
    return <CardSection sx={{ gap: '12px' }}>{content}</CardSection>;
  }

  return (
    <Dialog
      onClose={handleClose}
      open={props.open}
      sx={{ padding: '24px', gap: '16px' }}
    >
      {content}
    </Dialog>
  );
};

export default GroupInfo;
