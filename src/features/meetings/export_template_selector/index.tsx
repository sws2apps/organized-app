import { useId, useRef, useState } from 'react';
import { Box, FormControlLabel, Stack } from '@mui/material';
import { PhotoSlider } from 'react-photo-view';
import 'react-photo-view/dist/react-photo-view.css';
import { useAppTranslation, useBreakpoints } from '@hooks/index';
import Button from '@components/button';
import Radio from '@components/radio';
import Typography from '@components/typography';
import FullscreenButton from '@features/meetings/midweek_export/fullscreen_button';
import { ExportTemplateSelectorProps } from './index.types';

const previewToolbar = (onClose: VoidFunction, label: string) => (
  <Box
    ref={(node: HTMLDivElement | null) =>
      node?.querySelector('button')?.focus()
    }
  >
    <Button variant="secondary" onClick={onClose}>
      {label}
    </Button>
  </Box>
);

const ExportTemplateSelector = <T extends string>({
  images,
  selected,
  onChange,
  label,
  onPreviewChange,
  showDescriptions = true,
}: ExportTemplateSelectorProps<T>) => {
  const { t } = useAppTranslation();
  const { mobile400Down, tablet500Down } = useBreakpoints();
  let columns = images.length;
  if (tablet500Down) columns = Math.min(2, images.length);
  if (mobile400Down) columns = 1;
  const name = useId();
  const trigger = useRef<HTMLElement | null>(null);
  const [preview, setPreview] = useState<number | null>(null);

  return (
    <>
      <Box
        role={images.length > 1 ? 'radiogroup' : 'group'}
        aria-label={label}
        sx={{
          display: 'grid',
          gridTemplateColumns: `repeat(${columns}, minmax(0, ${images.length > 2 ? '1fr' : '158px'}))`,
          justifyContent: tablet500Down ? 'center' : 'start',
          gap: '16px',
          width: '100%',
          alignItems: 'start',
        }}
      >
        {images.map((item, index) => (
          <Stack
            key={item.id}
            spacing="16px"
            sx={{
              width: '100%',
              maxWidth: mobile400Down ? 158 : '100%',
              justifySelf: 'center',
              minWidth: 0,
              alignItems: 'center',
            }}
          >
            <Button
              variant="tertiary"
              disableAutoStretch
              ariaLabel={t('tr_exportTemplatePreview', { template: item.name })}
              onClick={(event) => {
                trigger.current = event.currentTarget;
                onPreviewChange?.(true);
                setPreview(index);
              }}
              sx={{
                position: 'relative',
                boxSizing: 'border-box',
                width: '100%',
                padding: 0,
                minWidth: 0,
                borderRadius: 'var(--radius-xs)',
                border: `2px solid var(${selected === item.id ? '--accent-main' : '--accent-200'})`,
                boxShadow: 'var(--small-card-shadow)',
                overflow: 'hidden',
                transform: 'none',
                transition:
                  'border-color var(--motion-fast) var(--ease-standard)',
                // Keep the preview bounds fixed; the global button states use
                // a thinner border and press scaling for text actions.
                '&:hover': {
                  border: `2px solid var(${selected === item.id ? '--accent-main' : '--accent-dark'})`,
                  boxShadow: 'var(--small-card-shadow)',
                  transform: 'none',
                },
                '&:active': {
                  border: `2px solid var(${selected === item.id ? '--accent-main' : '--accent-dark'})`,
                  boxShadow: 'var(--small-card-shadow)',
                  transform: 'none',
                },
                '&:hover .export-fullscreen-button, &:focus-visible .export-fullscreen-button':
                  {
                    display: 'contents',
                  },
                '@media (hover: none)': {
                  '.export-fullscreen-button': { display: 'contents' },
                },
              }}
            >
              <Box
                component="img"
                src={item.small}
                alt=""
                sx={{ display: 'block', width: '100%', height: 'auto' }}
              />
              <Box
                className="export-fullscreen-button"
                sx={{ display: 'none' }}
              >
                <FullscreenButton show />
              </Box>
            </Button>
            <Stack spacing="8px" sx={{ alignItems: 'center' }}>
              {images.length > 1 ? (
                <FormControlLabel
                  sx={{ margin: 0, alignItems: 'center' }}
                  control={
                    <Radio
                      checked={selected === item.id}
                      onChange={() => onChange(item.id)}
                      value={item.id}
                      name={name}
                    />
                  }
                  label={
                    <Typography align="center" className="h4">
                      {item.name}
                    </Typography>
                  }
                />
              ) : (
                <Typography align="center" className="h4">
                  {item.name}
                </Typography>
              )}
              {images.length > 1 && showDescriptions && (
                <Typography
                  align="center"
                  className="body-small-regular"
                  color="var(--grey-400)"
                >
                  {item.desc}
                </Typography>
              )}
            </Stack>
          </Stack>
        ))}
      </Box>
      <PhotoSlider
        images={images.map((item) => ({ key: item.id, src: item.src }))}
        visible={preview !== null}
        index={preview ?? 0}
        onIndexChange={setPreview}
        onClose={() => setPreview(null)}
        afterClose={() => {
          onPreviewChange?.(false);
          trigger.current?.focus();
        }}
        toolbarRender={() =>
          previewToolbar(() => setPreview(null), t('tr_close'))
        }
        maskClosable={false}
        maskOpacity={0.5}
      />
    </>
  );
};

export default ExportTemplateSelector;
