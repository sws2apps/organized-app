import { Box, Stack } from '@mui/material';
import { useAppTranslation } from '@hooks/index';
import { GroupInfoProps } from './index.types';
import useGroupInfo from './useGroupInfo';
import Button from '@components/button';
import Dialog from '@components/dialog';
import IconLoading from '@components/icon_loading';
import LanguageGroupMembers from '../group_members';
import LanguageGroupDetails from '../group_details';
import Tabs from '@components/tabs';
import Typography from '@components/typography';

const GroupInfo = (props: GroupInfoProps) => {
  const { t } = useAppTranslation();

  const {
    isProcessing,
    handleSaveChange,
    groupEdit,
    handleCircuitChange,
    handleLanguageChange,
    handleNameChange,
    circuit,
    handleClose,
    handleGroupChange,
    language,
  } = useGroupInfo(props);

  return (
    <Dialog
      onClose={handleClose}
      open={props.open}
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
  );
};

export default GroupInfo;
