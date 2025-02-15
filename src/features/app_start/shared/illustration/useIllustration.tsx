import { useMemo, useRef, useState } from 'react';
import { useMediaQuery, useTheme } from '@mui/material';
import { SwiperRef } from 'swiper/react';
import { useAppTranslation } from '@hooks/index';
import MeetingSchedules from '@assets/img/illustration_meetingSchedules.svg?url';
import MinistryAssignments from '@assets/img/illustration_ministryAssignments.svg?url';
import MultiPlattform from '@assets/img/illustration_multiPlattform.svg?url';
import OtherSchedules from '@assets/img/illustration_otherSchedules.svg?url';
import Secretary from '@assets/img/illustration_secretary.svg?url';
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
        src: MinistryAssignments,
      },
      {
        title: t('tr_illustrationMultiPlattformHeader'),
        desc: t('tr_illustrationMultiPlattformDescription'),
        src: MultiPlattform,
      },
      {
        title: t('tr_illustrationMeetingSchedulesHeader'),
        desc: t('tr_illustrationMeetingSchedulesDescription'),
        src: MeetingSchedules,
      },
      {
        title: t('tr_illustrationSecretaryHeader'),
        desc: t('tr_illustrationSecretaryDescription'),
        src: Secretary,
      },
      {
        title: t('tr_illustrationOtherSchedulesHeader'),
        desc: t('tr_illustrationOtherSchedulesDescription'),
        src: OtherSchedules,
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
