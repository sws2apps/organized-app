import { PhotoProvider, PhotoView } from 'react-photo-view';
import 'react-photo-view/dist/react-photo-view.css';
import { Box, FormControlLabel } from '@mui/material';
import { useBreakpoints } from '@hooks/index';
import { S140TemplateItemType, S140TemplateSelectorType } from './index.types';
import useS89TemplateSelector from './useS140TemplateSelector';
import Radio from '@components/radio';
import Typography from '@components/typography';
import FullscreenButton from '../fullscreen_button';
import { useState } from 'react';

const S140TemplateItem = ({
  item,
  onChange,
  selected,
}: S140TemplateItemType) => {
  const [s140TemplateItemHovered, setS140TemplateItemHovered] = useState(false);

  return (
    <Box
      sx={{
        display: 'flex',
        gap: '16px',
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
      <PhotoView src={item.src}>
        <Box
          onMouseEnter={() => setS140TemplateItemHovered(true)}
          onMouseLeave={() => setS140TemplateItemHovered(false)}
          sx={{ position: 'relative', marginBottom: '-5px' }}
        >
          <img
            src={item.small}
            alt=""
            style={{
              width: 'auto',
              height: '240px',
              borderRadius: '2.97px',
              cursor: 'pointer',
              border:
                selected === item.id
                  ? '2px solid var(--accent-main)'
                  : '2px solid var(--accent-200)',
              boxShadow: '0px 1.48px 5.94px 0px #1C1C1C1F',
            }}
          />
          <FullscreenButton show={s140TemplateItemHovered} />
        </Box>
      </PhotoView>

      <Box
        sx={{
          display: 'flex',
          gap: '8px',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <FormControlLabel
          sx={{ marginRight: 0 }}
          onClick={() => onChange(item.id)}
          control={<Radio checked={selected === item.id} />}
          label={
            <Typography align="center" className="h4">
              {item.name}
            </Typography>
          }
        />
        <Typography
          align="center"
          className="body-small-regular"
          color="var(--grey-400)"
        >
          {item.desc}
        </Typography>
      </Box>
    </Box>
  );
};

const S140TemplateSelector = (props: S140TemplateSelectorType) => {
  const { tabletDown } = useBreakpoints();

  const { images, handleChange } = useS89TemplateSelector(props);

  return (
    <PhotoProvider maskClosable={false} maskOpacity={0.5}>
      <Box
        sx={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '10px',
          justifyContent: tabletDown ? 'center' : 'flex-start',
        }}
      >
        {images.map((item) => (
          <S140TemplateItem
            key={item.id}
            item={item}
            onChange={handleChange}
            selected={props.selected}
          />
        ))}
      </Box>
    </PhotoProvider>
  );
};

export default S140TemplateSelector;
