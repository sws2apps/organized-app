import { PhotoProvider, PhotoView } from 'react-photo-view';
import 'react-photo-view/dist/react-photo-view.css';
import { Box, FormControlLabel } from '@mui/material';
import { S140TemplateItemType, S140TemplateSelectorType } from './index.types';
import Typography from '@components/typography';
import useS89TemplateSelector from './useS140TemplateSelector';
import Radio from '@components/radio';

const S140TemplateItem = ({
  item,
  onChange,
  selected,
}: S140TemplateItemType) => {
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
  const { images, handleChange } = useS89TemplateSelector(props);

  return (
    <PhotoProvider maskClosable={false} maskOpacity={0.5}>
      <Box style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
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
