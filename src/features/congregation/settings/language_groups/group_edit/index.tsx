import { Box, Stack } from '@mui/material';
import { IconEdit } from '@components/icons';
import { useAppTranslation } from '@hooks/index';
import { GroupEditProps } from './index.types';
import useGroupEdit from './useGroupEdit';
import Button from '@components/button';
import Dialog from '@components/dialog';
import IconButton from '@components/icon_button';
import IconLoading from '@components/icon_loading';
import LanguageGroupDetails from '../group_details';
import Tabs from '@components/tabs';
import Typography from '@components/typography';
import LanguageGroupMembers from '../group_members';

const GroupEdit = (props: GroupEditProps) => {
  const { t } = useAppTranslation();

  const {
    open,
    handleOpen,
    handleClose,
    isProcessing,
    handleSaveChange,
    groupEdit,
    handleCircuitChange,
    handleLanguageChange,
    handleNameChange,
    handleAdminDelete,
    handleAdminsChange,
    handleMemberDelete,
    handleMembersChange,
    members,
  } = useGroupEdit(props);

  return (
    <>
      <Dialog
        onClose={handleClose}
        open={open}
        sx={{ padding: '24px', gap: '16px' }}
      >
        <Typography className="h2">{t('tr_languageGroupEdit')}</Typography>

        <Box sx={{ margin: '0 0 -16px 0', width: '100%' }}>
          <Tabs
            tabs={[
              {
                label: t('tr_details'),
                Component: (
                  <LanguageGroupDetails
                    name={groupEdit.name}
                    onNameChange={handleNameChange}
                    circuit={groupEdit.circuit}
                    onCircuitChange={handleCircuitChange}
                    language={groupEdit.language}
                    onLanguageChange={handleLanguageChange}
                  />
                ),
              },
              {
                label: t('tr_groupMembers'),
                Component: (
                  <LanguageGroupMembers
                    readOnly={isProcessing}
                    admins={groupEdit.admins}
                    onAdminsChange={handleAdminsChange}
                    onAdminDelete={handleAdminDelete}
                    members={members}
                    onMembersChange={handleMembersChange}
                    onMemberDelete={handleMemberDelete}
                  />
                ),
              },
            ]}
          />
        </Box>

        <Stack spacing="8px" width="100%">
          <Button
            variant="main"
            onClick={handleSaveChange}
            endIcon={isProcessing && <IconLoading />}
          >
            {t('tr_save')}
          </Button>
          <Button variant="secondary" onClick={handleClose}>
            {t('tr_cancel')}
          </Button>
        </Stack>
      </Dialog>

      <IconButton onClick={handleOpen} sx={{ padding: 0.2 }}>
        <IconEdit color="var(--accent-main)" />
      </IconButton>
    </>
  );
};

export default GroupEdit;
