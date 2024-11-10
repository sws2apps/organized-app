import { Box } from '@mui/material';
import { DetailsContainer } from '../shared_styles';
import { IconInfo, IconLoading } from '@components/icons';
import { useAppTranslation } from '@hooks/index';
import useUserDetails from '../useUserDetails';
import Markup from '@components/text_markup';
import Typography from '@components/typography';
import UserAdditionalRights from '../user_additional_rights';
import UserMainRoles from '../user_main_roles';

const UserRights = () => {
  const { t } = useAppTranslation();

  const { user, isProcessing } = useUserDetails();

  return (
    <DetailsContainer>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: '12px',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <Typography className="h2" color={'var(--black)'}>
            {t('tr_userRights')}
          </Typography>

          {isProcessing && <IconLoading color="var(--black)" />}
        </Box>

        <Box
          sx={{
            display: 'flex',
            gap: '8px',
            alignItems: 'center',
          }}
        >
          {user.profile.global_role === 'pocket' && <IconInfo />}

          <Markup
            className="body-regular"
            color="var(--grey-400)"
            content={
              user.profile.cong_role.includes('publisher')
                ? t('tr_publisherStatusDefault')
                : t('tr_midweekStudentStatusDefault')
            }
          />
        </Box>
      </Box>

      {user.profile.global_role === 'vip' && (
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
          }}
        >
          <UserMainRoles />
          <UserAdditionalRights />
        </Box>
      )}
    </DetailsContainer>
  );
};

export default UserRights;
