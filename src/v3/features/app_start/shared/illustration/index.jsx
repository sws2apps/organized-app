import { Box, IconButton } from '@mui/material';
import { Typography } from '@components';
import { useAppTranslation } from '@hooks/index';
import MinistryAssignments from '@assets/img/illustration_ministryAssignments.svg';
import MultiPlattform from '@assets/img/illustration_multiPlattform.svg';
import MeetingSchedules from '@assets/img/illustration_meetingSchedules.svg';
import Secretary from '@assets/img/illustration_secretary.svg';
import useIllustration from './useIllustration';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';
import { createArray } from '@utils/common';
import { IconEllipse } from '@icons';
import 'swiper/css';
import 'swiper/css/pagination';

const styles = {
  display: 'flex',
  padding: { mobile: '0px 24px', laptop: '0px 48px' },
  flexDirection: 'column',
  justifyContent: 'space-between',
  height: '100%',
  gap: '24px',
};

const StartupIllustration = () => {
  const { t } = useAppTranslation();

  const { index, setIndex, dotSize, handleSlide, swiperRef } = useIllustration();

  return (
    <Box
      sx={{
        flex: 1,
        background: '#5065D0',
        borderRadius: 'var(--radius-xxl)',
        padding: { mobile: '24px 0px', laptop: '48px 0px' },
        minWidth: '0px',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        gap: '32px',
      }}
    >
      <Box sx={{ flex: '1 0 0' }}>
        <Swiper
          ref={swiperRef}
          slidesPerView="auto"
          spaceBetween={0}
          centeredSlides={true}
          autoplay={{
            delay: 10000,
            disableOnInteraction: false,
          }}
          loop={true}
          modules={[Autoplay, Pagination]}
          className="mySwiper"
          style={{ height: '100%' }}
          onRealIndexChange={(swiper) => setIndex(swiper.realIndex)}
        >
          <SwiperSlide>
            <Box sx={styles}>
              <Box>
                <Typography variant="h1" color="var(--always-white)" sx={{ marginBottom: '24px' }}>
                  {t('illustrationMinistryAssignmentsHeader')}
                </Typography>
                <Typography variant="body-regular" color="var(--always-white)">
                  {t('illustrationMinistryAssignmentsDescription')}
                </Typography>
              </Box>
              <img src={MinistryAssignments} alt="Ministry Assignments" style={{ width: '100%' }} />
            </Box>
          </SwiperSlide>

          <SwiperSlide>
            <Box sx={styles}>
              <Box>
                <Typography variant="h1" color="var(--always-white)" sx={{ marginBottom: '24px' }}>
                  {t('illustrationMultiPlattformHeader')}
                </Typography>
                <Typography variant="body-regular" color="var(--always-white)">
                  {t('illustrationMultiPlattformDescription')}
                </Typography>
              </Box>
              <img src={MultiPlattform} alt="Multi Plattform" style={{ width: '100%' }} />
            </Box>
          </SwiperSlide>

          <SwiperSlide>
            <Box sx={styles}>
              <Box>
                <Typography variant="h1" color="var(--always-white)" sx={{ marginBottom: '24px' }}>
                  {t('illustrationMeetingSchedulesHeader')}
                </Typography>
                <Typography variant="body-regular" color="var(--always-white)">
                  {t('illustrationMeetingSchedulesDescription')}
                </Typography>
              </Box>
              <img src={MeetingSchedules} alt="Meeting Schedules" style={{ width: '100%' }} />
            </Box>
          </SwiperSlide>

          <SwiperSlide>
            <Box sx={styles}>
              <Box>
                <Typography variant="h1" color="var(--always-white)" sx={{ marginBottom: '24px' }}>
                  {t('illustrationSecretaryHeader')}
                </Typography>
                <Typography variant="body-regular" color="var(--always-white)">
                  {t('illustrationSecretaryDescription')}
                </Typography>
              </Box>
              <img src={Secretary} alt="Secretary" style={{ width: '100%' }} />
            </Box>
          </SwiperSlide>
        </Swiper>
      </Box>

      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: { mobile: '12px', laptop: '16px' },
        }}
      >
        {createArray(4).map((n) => (
          <IconButton
            key={n}
            disableRipple
            sx={{ opacity: n === index ? 1 : 0.48, padding: 0, margin: 0, width: { mobile: '12px', laptop: '16px' } }}
            onClick={() => handleSlide(n)}
          >
            <IconEllipse
              color="var(--always-white)"
              width={n === index ? dotSize.active : dotSize.inactive}
              height={n === index ? dotSize.active : dotSize.inactive}
            />
          </IconButton>
        ))}
      </Box>
    </Box>
  );
};

export default StartupIllustration;
