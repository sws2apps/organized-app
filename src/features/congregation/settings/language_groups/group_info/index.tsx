import { Box, Stack } from '@mui/material';
import { useAppTranslation } from '@hooks/index';
import { GroupInfoProps } from './index.types';
import useGroupInfo from './useGroupInfo';
import Button from '@components/button';
import Dialog from '@components/dialog';
import LanguageGroupMembers from '../group_members';
import LanguageGroupDetails from '../group_details';
import Typography from '@components/typography';
import GroupDelete from '../group_delete';
import { CardSection, CardSectionContent, CardSectionHeader } from '../../shared_styles';

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

  const detailsContent = (
    <LanguageGroupDetails
      name={groupEdit.group_data.name}
      onNameChange={handleNameChange}
      circuit={circuit}
      onCircuitChange={handleCircuitChange}
      language={language}
      onLanguageChange={handleLanguageChange}
    />
  );

  const membersContent = (
    <LanguageGroupMembers
      readOnly={isProcessing}
      group={groupEdit}
      onChange={handleGroupChange}
    />
  );

  if (props.inline) {
    return (
      <>
        <CardSection>
          <CardSectionHeader
            title={props.group.group_data.name || t('tr_details')}
            description={t('tr_groupDetailsDesc') || 'Basic information'}
          />
          <CardSectionContent sx={{ '& > hr': { display: 'none' } }}>
            {detailsContent}
          </CardSectionContent>
        </CardSection>

        <CardSection>
          <CardSectionHeader
            title={t('tr_groupMembers')}
            description={t('tr_groupMembersDesc') || 'Assign overseers and publishers to this language group'}
          />
          <CardSectionContent sx={{ '& > hr': { display: 'none' } }}>
            {membersContent}
          </CardSectionContent>
        </CardSection>
      </>
    );
  }

  return (
    <Dialog
      onClose={handleClose}
      open={props.open}
      sx={{ padding: '24px', gap: '16px' }}
    >
      <Typography className="h2">{props.group.group_data.name || t('tr_details')}</Typography>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: '32px', margin: '8px 0' }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <Typography className="h4">{t('tr_details')}</Typography>
          {detailsContent}
        </Box>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <Typography className="h4">{t('tr_groupMembers')}</Typography>
          {membersContent}
        </Box>
      </Box>

      <Stack spacing="8px" width="100%" sx={{ mt: '8px' }}>
        <Button variant="main" onClick={handleClose}>
          {t('tr_done')}
        </Button>
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: '8px' }}>
          <GroupDelete group={props.group} />
        </Box>
      </Stack>
    </Dialog>
  );
};

export default GroupInfo;
