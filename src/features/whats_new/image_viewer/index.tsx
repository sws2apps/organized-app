import { Box } from '@mui/material';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';
import { useBreakpoints } from '@hooks/index';
import { ImageViewerProps } from './index.types';
import { SlideItem } from './index.styles';
import Typography from '@components/typography';

const ImageViewer = ({
  current,
  slides,
  swiperRef,
  onImageChange,
}: ImageViewerProps) => {
  const { tablet500Down } = useBreakpoints();

  return (
    <>
      <Box
        sx={{
          padding: '24px 0',
          display: 'flex',
          flexDirection: 'column',
          gap: '24px',
          borderRadius: 'var(--radius-l)',
          backgroundColor: 'var(--accent-150)',
          width: '100%',
          height: tablet500Down ? 'unset' : '340px',
        }}
      >
        <Box>
          <Swiper
            ref={swiperRef}
            slidesPerView="auto"
            spaceBetween={0}
            centeredSlides={true}
            autoplay={{ delay: 10000, disableOnInteraction: false }}
            modules={[Autoplay, Pagination]}
            className="mySwiper"
            style={{ height: '100%' }}
            onRealIndexChange={(swiper) => onImageChange(swiper.realIndex)}
          >
            {slides.map((slide) => (
              <SwiperSlide key={slide.src}>
                <SlideItem>
                  <Box
                    component="img"
                    src={slide.src}
                    sx={{ height: '200px', width: '100%' }}
                  />

                  <Box
                    sx={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '4px',
                      textAlign: 'center',
                    }}
                  >
                    <Typography className="h4" color="var(--accent-dark)">
                      {slides[current].tr_title}
                    </Typography>
                    <Typography
                      className="body-small-regular"
                      color="var(--accent-400)"
                    >
                      {slides[current].tr_desc}
                    </Typography>
                  </Box>
                </SlideItem>
              </SwiperSlide>
            ))}
          </Swiper>
        </Box>
      </Box>

      {slides.length > 1 && (
        <Box
          sx={{
            display: 'flex',
            gap: '8px',
            justifyContent: 'center',
            width: '100%',
          }}
        >
          {slides.map((item, index) => (
            <Box
              key={item.tr_title}
              sx={{
                width: '12px',
                height: '12px',
                borderRadius: '50%',
                backgroundColor:
                  current === index
                    ? 'var(--accent-main)'
                    : 'var(--accent-200)',
              }}
            />
          ))}
        </Box>
      )}
    </>
  );
};

export default ImageViewer;
