import { Box, Link } from '@mui/material';
import { CongregationInfoViewType } from './index.types';
import { useAppTranslation, useBreakpoints } from '@hooks/index';
import Typography from '@components/typography';
import useCongregationInfo from './useCongregationInfo';

const CongregationInfoView = ({ congregation }: CongregationInfoViewType) => {
  const { t } = useAppTranslation();

  const { tabletDown } = useBreakpoints();

  const { midweekTime, weekendTime } = useCongregationInfo({ congregation });

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
        marginTop: '-8px',
        marginBottom: '-16px',
      }}
    >
      <Box
        sx={{
          borderBottom: '1px solid var(--accent-200)',
          display: 'flex',
          flexDirection: 'column',
          gap: '8px',
          paddingBottom: '8px',
        }}
      >
        <Box
          sx={{
            padding: '12px',
            backgroundColor: 'var(--accent-150)',
            borderRadius: 'var(--radius-l)',
          }}
        >
          <Typography className="label-small-regular" color="var(--accent-400)">
            {t('tr_kingdomHallAddress')}
          </Typography>
          <Typography className="body-small-semibold">
            {congregation.cong_data.cong_location.address.value}
          </Typography>
        </Box>

        <Box
          sx={{
            display: 'flex',
            alignItems: tabletDown ? 'flex-start' : 'center',
            flexWrap: 'wrap',
            gap: '8px',
            flexDirection: tabletDown ? 'column' : 'row',
          }}
        >
          <Box
            sx={{
              padding: '12px',
              backgroundColor: 'var(--accent-150)',
              display: 'flex',
              flexDirection: 'column',
              gap: '2px',
              flex: 1,
              width: '100%',
              borderRadius: 'var(--radius-l)',
            }}
          >
            <Typography
              className="label-small-regular"
              color="var(--accent-400)"
            >
              {t('tr_circuitNumber')}
            </Typography>
            <Typography className="body-small-semibold">
              {congregation.cong_data.cong_circuit.value}
            </Typography>
          </Box>

          <Box
            sx={{
              padding: '12px',
              backgroundColor: 'var(--accent-150)',
              display: 'flex',
              flexDirection: 'column',
              gap: '2px',
              flex: 1,
              width: '100%',
              borderRadius: 'var(--radius-l)',
            }}
          >
            <Typography
              className="label-small-regular"
              color="var(--accent-400)"
            >
              {t('tr_midweekMeeting')}
            </Typography>
            <Typography className="body-small-semibold">
              {midweekTime}
            </Typography>
          </Box>

          <Box
            sx={{
              padding: '12px',
              backgroundColor: 'var(--accent-150)',
              display: 'flex',
              flexDirection: 'column',
              gap: '2px',
              flex: 1,
              width: '100%',
              borderRadius: 'var(--radius-l)',
            }}
          >
            <Typography
              className="label-small-regular"
              color="var(--accent-400)"
            >
              {t('tr_weekendMeeting')}
            </Typography>
            <Typography className="body-small-semibold">
              {weekendTime}
            </Typography>
          </Box>
        </Box>
      </Box>

      <Box
        sx={{
          borderBottom: '1px solid var(--accent-200)',
          display: 'flex',
          gap: '8px',
          paddingBottom: '8px',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          flexDirection: tabletDown ? 'column' : 'row',
        }}
      >
        <Box
          sx={{
            padding: '12px',
            display: 'flex',
            flexDirection: 'column',
            gap: '4px',
          }}
        >
          <Typography className="label-small-regular" color="var(--accent-400)">
            {t('tr_publicTalkCoordinator')}
          </Typography>
          <Typography className="body-small-semibold">
            {congregation.cong_data.public_talk_coordinator.name.value}
          </Typography>
        </Box>

        <Box
          sx={{
            padding: '12px',
            display: 'flex',
            flexDirection: 'column',
            gap: '4px',
            alignItems: tabletDown ? 'flex-start' : 'flex-end',
          }}
        >
          {congregation.cong_data.public_talk_coordinator.email.value.length >
            0 && (
            <Link
              underline="none"
              href={`mailto:${congregation.cong_data.public_talk_coordinator.email.value}`}
            >
              <Typography
                className="body-small-semibold"
                color="var(--accent-main)"
              >
                {congregation.cong_data.public_talk_coordinator.email.value}
              </Typography>
            </Link>
          )}

          {congregation.cong_data.public_talk_coordinator.phone.value.length >
            0 && (
            <Link
              underline="none"
              href={`tel:${congregation.cong_data.public_talk_coordinator.phone.value}`}
            >
              <Typography
                className="body-small-semibold"
                color="var(--accent-main)"
              >
                {congregation.cong_data.public_talk_coordinator.phone.value}
              </Typography>
            </Link>
          )}
        </Box>
      </Box>

      <Box
        sx={{
          display: 'flex',
          gap: '8px',
          paddingBottom: '8px',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          flexDirection: tabletDown ? 'column' : 'row',
        }}
      >
        <Box
          sx={{
            padding: '12px',
            display: 'flex',
            flexDirection: 'column',
            gap: '4px',
          }}
        >
          <Typography className="label-small-regular" color="var(--accent-400)">
            {t('tr_coordinator')}
          </Typography>
          <Typography className="body-small-semibold">
            {congregation.cong_data.coordinator.name.value}
          </Typography>
        </Box>

        <Box
          sx={{
            padding: '12px',
            display: 'flex',
            flexDirection: 'column',
            gap: '4px',
            alignItems: tabletDown ? 'flex-start' : 'flex-end',
          }}
        >
          {congregation.cong_data.coordinator.email.value.length > 0 && (
            <Link
              underline="none"
              href={`mailto:${congregation.cong_data.coordinator.email.value}`}
            >
              <Typography
                className="body-small-semibold"
                color="var(--accent-main)"
              >
                {congregation.cong_data.coordinator.email.value}
              </Typography>
            </Link>
          )}

          {congregation.cong_data.coordinator.phone.value.length > 0 && (
            <Link
              underline="none"
              href={`tel:${congregation.cong_data.coordinator.phone.value}`}
            >
              <Typography
                className="body-small-semibold"
                color="var(--accent-main)"
              >
                {congregation.cong_data.coordinator.phone.value}
              </Typography>
            </Link>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default CongregationInfoView;
