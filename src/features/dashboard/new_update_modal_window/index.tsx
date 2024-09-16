import { Box } from '@mui/material';
import { NewUpdateModalWindowProps } from './new_update_modal_window.types';
import useAppTranslation from '@hooks/useAppTranslation';
import IconButton from '@components/icon_button';
import { IconClose } from '@components/icons';
import Typography from '@components/typography';
import Button from '@components/button';
import { useState } from 'react';
import Dialog from '@components/dialog';

/**
 * `NewUpdateModalWindow` is a React functional component that displays a modal dialog window.
 * It is typically used to inform users about new updates or features, and includes a slider for
 * displaying multiple content cards, an improvement list, and action buttons.
 *
 * @component
 *
 * @example
 * // Example usage of NewUpdateModalWindow
 * <NewUpdateModalWindow
 *   isOpen={true}
 *   sliderCards={[
 *     { imageSrc: 'image1.png', title: 'Title 1', description: 'Description 1' },
 *     { imageSrc: 'image2.png', title: 'Title 2', description: 'Description 2' },
 *   ]}
 *   improvements={['Improvement 1', 'Improvement 2']}
 *   onCloseButtonClick={() => console.log('Close button clicked')}
 *   onNextButtonClick={() => console.log('Next button clicked')}
 *   onBackButtonClick={() => console.log('Back button clicked')}
 * />
 */
const NewUpdateModalWindow = (props: NewUpdateModalWindowProps) => {
  const { t } = useAppTranslation();

  const slides = props.sliderCards || [];

  const improvementList = () => {
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: '4px',
        }}
      >
        <Typography className="body-small-semibold" color={'var(--black)'}>
          {t('tr_improvements')}
        </Typography>
        {props.improvements.map((value) => {
          return (
            <Typography
              className="body-small-regular"
              color={'var(--grey-400)'}
              key={value}
            >
              {'• ' + value}
            </Typography>
          );
        })}
      </Box>
    );
  };

  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);

  // Ensure slides is not undefined or empty
  const validSlides = slides && slides.length > 0 ? slides : [];

  return (
    <Dialog
      open={props.isOpen}
      onClose={undefined}
      sx={{
        backgroundColor: 'var(--white)',
        padding: '0',
        overflowY: 'scroll',
      }}
    >
      <Box
        sx={{
          padding: '32px',
          display: 'flex',
          flexDirection: 'column',
          gap: '24px',
          borderRadius: 'var(--radius-xl)',
          backgroundColor: 'var(--white)',
          width: '100%',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
          }}
        >
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <Typography className="h2" color={'var(--black)'}>
              {t('tr_newOrganizedUpdate')}
            </Typography>
            <IconButton onClick={props.onCloseButtonClick}>
              <IconClose color="var(--black)" />
            </IconButton>
          </Box>
          <Typography className="body-regular" color={'var(--grey-400)'}>
            {t('tr_newOrganizedUpdateDesc')}
          </Typography>
        </Box>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: '24px',
            width: '100%',
          }}
        >
          <Box
            sx={{
              padding: '24px',
              display: 'flex',
              flexDirection: 'column',
              gap: '24px',
              borderRadius: 'var(--radius-l)',
              backgroundColor:
                validSlides[currentSlideIndex].backgroundColor ||
                'var(--accent-150)',
              width: '100%',
            }}
          >
            <Box
              component={'img'}
              src={validSlides[currentSlideIndex].imageSrc}
              sx={{
                width: '100%',
              }}
            />
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: '4px',
                textAlign: 'center',
              }}
            >
              <Typography
                color={
                  validSlides[currentSlideIndex].titleColor ||
                  'var(--accent-dark)'
                }
                className="h4"
              >
                {validSlides[currentSlideIndex].title}
              </Typography>
              <Typography
                color={
                  validSlides[currentSlideIndex].descriptionColor ||
                  'var(--accent-400)'
                }
                className="body-small-regular"
              >
                {validSlides[currentSlideIndex].description}
              </Typography>
            </Box>
          </Box>

          <Box
            sx={{
              display: 'flex',
              gap: '8px',
              justifyContent: 'center',
            }}
          >
            {validSlides.map((item, index) => (
              <Box
                sx={{
                  width: '12px',
                  height: '12px',
                  borderRadius: '50%',
                  backgroundColor:
                    currentSlideIndex === index
                      ? 'var(--accent-main)'
                      : 'var(--accent-200)',
                }}
                key={index}
              />
            ))}
          </Box>
          {props.improvements.length !== 0 ? improvementList() : null}

          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              gap: '8px',
            }}
          >
            <Button
              variant="main"
              onClick={(event) => {
                if (currentSlideIndex !== validSlides.length - 1) {
                  setCurrentSlideIndex((prev) => prev + 1);
                } else {
                  props.onOkButtonClick(event);
                }
              }}
            >
              {currentSlideIndex !== validSlides.length - 1
                ? t('tr_next')
                : t('tr_ok')}
            </Button>
            <Button
              variant="secondary"
              onClick={() => {
                if (currentSlideIndex !== 0) {
                  setCurrentSlideIndex((prev) => prev - 1);
                } else {
                  props.onCloseButtonClick();
                }
              }}
            >
              {t('tr_back')}
            </Button>
          </Box>
        </Box>
      </Box>
    </Dialog>
  );
};

export default NewUpdateModalWindow;
