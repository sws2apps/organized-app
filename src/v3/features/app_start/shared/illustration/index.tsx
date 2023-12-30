import { Box, IconButton } from '@mui/material';
import { Typography } from '@components';
import { useAppTranslation } from '@hooks/index';
import MinistryAssignments from '@assets/img/illustration_ministryAssignments.svg?component';
import MultiPlattform from '@assets/img/illustration_multiPlattform.svg?component';
import MeetingSchedules from '@assets/img/illustration_meetingSchedules.svg?component';
import Secretary from '@assets/img/illustration_secretary.svg?component';
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
                <Typography className="h1" color="var(--always-white)" sx={{ marginBottom: '24px' }}>
                  {t('trans_illustrationMinistryAssignmentsHeader')}
                </Typography>
                <Typography className="body-regular" color="var(--always-white)">
                  {t('trans_illustrationMinistryAssignmentsDescription')}
                </Typography>
              </Box>
              <MinistryAssignments viewBox="0 0 748 457" style={{ width: '100%', height: 'auto' }} />
            </Box>
          </SwiperSlide>

          <SwiperSlide>
            <Box sx={styles}>
              <Box>
                <Typography className="h1" color="var(--always-white)" sx={{ marginBottom: '24px' }}>
                  {t('trans_illustrationMultiPlattformHeader')}
                </Typography>
                <Typography className="body-regular" color="var(--always-white)">
                  {t('trans_illustrationMultiPlattformDescription')}
                </Typography>
              </Box>
              <MultiPlattform viewBox="0 0 748 457" style={{ width: '100%', height: 'auto' }} />
            </Box>
          </SwiperSlide>

          <SwiperSlide>
            <Box sx={styles}>
              <Box>
                <Typography className="h1" color="var(--always-white)" sx={{ marginBottom: '24px' }}>
                  {t('trans_illustrationMeetingSchedulesHeader')}
                </Typography>
                <Typography className="body-regular" color="var(--always-white)">
                  {t('trans_illustrationMeetingSchedulesDescription')}
                </Typography>
              </Box>
              <MeetingSchedules viewBox="0 0 748 457" style={{ width: '100%', height: 'auto' }} />
            </Box>
          </SwiperSlide>

          <SwiperSlide>
            <Box sx={styles}>
              <Box>
                <Typography className="h1" color="var(--always-white)" sx={{ marginBottom: '24px' }}>
                  {t('trans_illustrationSecretaryHeader')}
                </Typography>
                <Typography className="body-regular" color="var(--always-white)">
                  {t('trans_illustrationSecretaryDescription')}
                </Typography>
              </Box>

              <Secretary viewBox="0 0 748 457" style={{ width: '100%', height: 'auto' }} />
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
