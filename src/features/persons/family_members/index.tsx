import { Box } from '@mui/material';
import { IconInfo } from '@components/icons';
import { useNavigate } from 'react-router';
import { useAppTranslation } from '@hooks/index';
import useFamilyMembers from './useFamilyMembers';
import InfoNote from '@components/info_note';
import MemberSelector from './member_selector';
import Markup from '@components/text_markup';
import Switch from '@components/switch';
import Typography from '@components/typography';

const FamilyMembers = () => {
  const { t } = useAppTranslation();
  
  const navigate = useNavigate();

  const {
    isCurrentPersonMemberOfAFamily,
    onSetHead,
    isFamilyHead,
    familyHeadName,
    familyHeadId,
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
        <InfoNote>
          <Markup
            className="body-small-regular"
            content={t('tr_personAlreadyMemberOfFamily', {
              familyHead: `<a href="/persons/${familyHeadId}">${familyHeadName}</a>`,
            })}
            anchorClick={(e) => {
              e.preventDefault();
              navigate(`/persons/${familyHeadId}`);
            }}
          />
        </InfoNote>
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
