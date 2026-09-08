import { KeyboardEvent, useRef } from 'react';
import { Box } from '@mui/material';
import Typography from '@components/typography';
import { IconCheck } from '@components/icons';
import { useAppTranslation } from '@hooks/index';
import FontSizePreview from './FontSizePreview';
import useFontSizeSelector from './useFontSizeSelector';
import { FONT_SIZE_OPTIONS } from './constants';

const FontSizeSelector = () => {
  const { t } = useAppTranslation();

  const { fontSize, handleChangeFontSize } = useFontSizeSelector();

  const optionsRef = useRef<HTMLDivElement[]>([]);

  const activeIndex = FONT_SIZE_OPTIONS.findIndex(
    (option) => option.value === fontSize
  );

  const activeScale = FONT_SIZE_OPTIONS[activeIndex]?.scale ?? 1;

  const handleSelect = (index: number) => {
    const next = (index + FONT_SIZE_OPTIONS.length) % FONT_SIZE_OPTIONS.length;

    handleChangeFontSize(FONT_SIZE_OPTIONS[next].value);
    optionsRef.current[next]?.focus();
  };

  const handleKeyDown = (e: KeyboardEvent, index: number) => {
    const keys: Record<string, number> = {
      ArrowRight: index + 1,
      ArrowDown: index + 1,
      ArrowLeft: index - 1,
      ArrowUp: index - 1,
      Home: 0,
      End: FONT_SIZE_OPTIONS.length - 1,
      Enter: index,
      ' ': index,
    };

    const target = keys[e.key];

    if (target === undefined) return;

    e.preventDefault();
    handleSelect(target);
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
        <Typography className="h4">{t('tr_fontSize')}</Typography>
        <Typography className="label-small-regular" color="var(--grey-350)">
          {t('tr_fontSizeDesc')}
        </Typography>
      </Box>

      <Box
        role="radiogroup"
        aria-label={t('tr_fontSize')}
        sx={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}
      >
        {FONT_SIZE_OPTIONS.map((option, index) => {
          const isSelected = option.value === fontSize;

          return (
            <Box
              key={option.value}
              ref={(el: HTMLDivElement) => {
                optionsRef.current[index] = el;
              }}
              role="radio"
              aria-checked={isSelected}
              aria-label={t(option.labelKey)}
              // roving focus: the group is one tab stop, arrows move within it
              tabIndex={
                isSelected || (activeIndex === -1 && index === 0) ? 0 : -1
              }
              onClick={() => handleSelect(index)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              sx={{
                flex: '1 1 180px',
                minWidth: '160px',
                display: 'flex',
                flexDirection: 'column',
                gap: '10px',
                padding: '12px 14px',
                borderRadius: 'var(--radius-l)',
                border: isSelected
                  ? '1px solid var(--accent-main)'
                  : '1px solid var(--accent-200)',
                backgroundColor: isSelected
                  ? 'var(--accent-150)'
                  : 'transparent',
                cursor: 'pointer',
                outline: 'none',
                transition: 'all 0.2s ease-in-out',
                '&:focus-visible': {
                  boxShadow: '0 0 0 2px var(--accent-main)',
                },
                '&:hover': {
                  borderColor: isSelected
                    ? 'var(--accent-main)'
                    : 'var(--accent-300)',
                  backgroundColor: isSelected
                    ? 'var(--accent-150)'
                    : 'var(--accent-100)',
                },
              }}
            >
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '8px',
                }}
              >
                <Typography
                  className="body-small-semibold"
                  sx={{
                    color: isSelected ? 'var(--accent-main)' : 'var(--black)',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}
                >
                  {t(option.labelKey)}
                </Typography>

                {isSelected && (
                  <IconCheck
                    color="var(--accent-main)"
                    sx={{ width: '18px', height: '18px', flexShrink: 0 }}
                  />
                )}
              </Box>

              <FontSizePreview scale={option.scale} activeScale={activeScale} />
            </Box>
          );
        })}
      </Box>
    </Box>
  );
};

export default FontSizeSelector;
