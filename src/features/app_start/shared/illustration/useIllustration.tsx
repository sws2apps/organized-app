import { useMemo, useRef, useState } from 'react';
import { useMediaQuery, useTheme } from '@mui/material';
import { SwiperRef } from 'swiper/react';
import { useAppTranslation } from '@hooks/index';

import IllustrationMinistryAssignments from '@components/illustrations/IllustrationMinistryAssignments';
import IllustrationMeetingSchedules from '@components/illustrations/IllustrationMeetingSchedules';
import IllustrationMultiPlatform from '@components/illustrations/IllustrationMultiPlatform';
import IllustrationSecretary from '@components/illustrations/IllustrationSecretary';
import IllustrationOtherSchedules from '@components/illustrations/IllustrationOtherSchedules';
// import Territories from '@assets/img/illustration_territories.svg?url';

const useIllustration = () => {
  const { t } = useAppTranslation();

  const theme = useTheme();
  const swiperRef = useRef<SwiperRef>();

  const laptopUp = useMediaQuery(theme.breakpoints.up('laptop'), {
    noSsr: true,
  });

  const [currentImage, setCurrentImage] = useState(0);

  const dotSize = useMemo(() => {
    if (laptopUp) {
      return { active: 16, inactive: 12 };
    }

    return { active: 12, inactive: 8 };
  }, [laptopUp]);

  const slides = useMemo(() => {
    return [
      {
        title: t('tr_illustrationMinistryAssignmentsHeader'),
        desc: t('tr_illustrationMinistryAssignmentsDescription'),
        component: (
          <IllustrationMinistryAssignments
            style={{ width: '100%', height: 'auto' }}
          />
        ),
      },
      {
        title: t('tr_illustrationMultiPlattformHeader'),
        desc: t('tr_illustrationMultiPlattformDescription'),
        component: (
          <IllustrationMultiPlatform
            style={{ width: '100%', height: 'auto' }}
          />
        ),
      },
      {
        title: t('tr_illustrationMeetingSchedulesHeader'),
        desc: t('tr_illustrationMeetingSchedulesDescription'),
        component: (
          <IllustrationMeetingSchedules
            style={{ width: '100%', height: 'auto' }}
          />
        ),
      },
      {
        title: t('tr_illustrationSecretaryHeader'),
        desc: t('tr_illustrationSecretaryDescription'),
        component: (
          <IllustrationSecretary style={{ width: '100%', height: 'auto' }} />
        ),
      },
      {
        title: t('tr_illustrationOtherSchedulesHeader'),
        desc: t('tr_illustrationOtherSchedulesDescription'),
        component: (
          <IllustrationOtherSchedules
            style={{ width: '100%', height: 'auto' }}
          />
        ),
      },
      // {
      //   title: t('tr_illustrationTerritoriesHeader'),
      //   desc: t('tr_illustrationTerritoriesDescription'),
      //   src: Territories,
      // },
    ];
  }, [t]);

  const handleSlide = (n) => {
    if (swiperRef.current) {
      swiperRef.current.swiper.slideToLoop(n);
    }
  };

  return {
    currentImage,
    dotSize,
    setCurrentImage,
    handleSlide,
    swiperRef,
    slides,
  };
};

export default useIllustration;
