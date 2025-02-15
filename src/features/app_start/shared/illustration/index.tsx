import 'swiper/css';
import 'swiper/css/pagination';

import { Box, IconButton } from '@mui/material';
import { IconEllipse } from '@icons/index';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';
import { SlideItem } from './index.styles';
import useIllustration from './useIllustration';
import Typography from '@components/typography';
import SVGAsImage from '@components/svg_as_image';

const StartupIllustration = () => {
  const {
    currentImage,
    setCurrentImage,
    dotSize,
    handleSlide,
    swiperRef,
    slides,
  } = useIllustration();

  return (
    <Box
      sx={{
        flex: 1,
        background: 'var(--accent-main)',
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
          onRealIndexChange={(swiper) => setCurrentImage(swiper.realIndex)}
        >
          {slides.map((slide) => (
            <SwiperSlide key={slide.title}>
              <SlideItem>
                <Box>
                  <Typography
                    className="h1"
                    color="var(--always-white)"
                    sx={{ marginBottom: '24px' }}
                  >
                    {slide.title}
                  </Typography>
                  <Typography
                    className="body-regular"
                    color="var(--always-white)"
                  >
                    {slide.desc}
                  </Typography>
                </Box>
                <SVGAsImage
                  src={slide.src}
                  style={{ width: '100%', height: 'auto' }}
                />
              </SlideItem>
            </SwiperSlide>
          ))}
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
        {slides.map((item, index) => (
          <IconButton
            key={item.title}
            disableRipple
            sx={{
              opacity: currentImage === index ? 1 : 0.48,
              padding: 0,
              margin: 0,
              width: { mobile: '12px', laptop: '16px' },
            }}
            onClick={() => handleSlide(index)}
          >
            <IconEllipse
              color="var(--always-white)"
              width={currentImage === index ? dotSize.active : dotSize.inactive}
              height={
                currentImage === index ? dotSize.active : dotSize.inactive
              }
            />
          </IconButton>
        ))}
      </Box>
    </Box>
  );
};

export default StartupIllustration;
