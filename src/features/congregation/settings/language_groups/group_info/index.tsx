import { Stack } from '@mui/material';
import { useAppTranslation } from '@hooks/index';
import { GroupInfoProps } from './index.types';
import {
  DeleteRow,
  DialogSection,
  DialogSectionsContainer,
} from './index.styles';
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
            description={t('tr_groupDetailsDesc')}
          />
          <CardSectionContent sx={{ '& > hr': { display: 'none' } }}>
            {detailsContent}
          </CardSectionContent>
        </CardSection>

        <CardSection>
          <CardSectionHeader
            title={t('tr_groupMembers')}
            description={t('tr_groupMembersDesc')}
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

      <DialogSectionsContainer>
        <DialogSection>
          <Typography className="h4">{t('tr_details')}</Typography>
          {detailsContent}
        </DialogSection>

        <DialogSection>
          <Typography className="h4">{t('tr_groupMembers')}</Typography>
          {membersContent}
        </DialogSection>
      </DialogSectionsContainer>

      <Stack spacing="8px" width="100%" sx={{ mt: '8px' }}>
        <Button variant="main" onClick={handleClose}>
          {t('tr_done')}
        </Button>
        <DeleteRow>
          <GroupDelete group={props.group} />
        </DeleteRow>
      </Stack>
    </Dialog>
  );
};

export default GroupInfo;
