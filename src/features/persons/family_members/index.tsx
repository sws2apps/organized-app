import { Box } from '@mui/material';
import { IconInfo } from '@components/icons';
import { useAppTranslation } from '@hooks/index';
import useFamilyMembers from './useFamilyMembers';
import MemberSelector from './member_selector';
import Markup from '@components/text_markup';
import Switch from '@components/switch';
import Typography from '@components/typography';

const FamilyMembers = () => {
  const { t } = useAppTranslation();

  const {
    isCurrentPersonMemberOfAFamily,
    onSetHead,
    isFamilyHead,
    familyHeadName,
  } = useFamilyMembers();

  return (
    <Box
      sx={{
        backgroundColor: 'var(--white)',
        border: '1px solid var(--accent-300)',
        display: 'flex',
        padding: '16px',
        flexDirection: 'column',
        borderRadius: 'var(--radius-xl)',
        flex: 1,
        width: '100%',
        gap: '16px',
      }}
    >
      <Typography className="h2" color="var(--black)">
        {t('tr_family')}
      </Typography>

      {isCurrentPersonMemberOfAFamily && (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <IconInfo color="var(--grey-350)" />
          <Markup
            className="body-regular"
            color="var(--grey-350)"
            content={t('tr_personAlreadyMemberOfFamily', {
              familyHead: familyHeadName,
            })}
          />
        </Box>
      )}

      {!isCurrentPersonMemberOfAFamily && (
        <>
          <Typography color="var(--grey-400)">
            {t('tr_setPersonToFamilyHead')}
          </Typography>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <Switch checked={isFamilyHead} onChange={onSetHead} />
            <Typography>{t('tr_familyHead')}</Typography>
          </Box>

          {isFamilyHead && <MemberSelector />}
        </>
      )}
    </Box>
  );
};

export default FamilyMembers;
