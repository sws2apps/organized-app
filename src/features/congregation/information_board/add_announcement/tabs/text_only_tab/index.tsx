import MenuItem from '@components/menuitem';
import Select from '@components/select';
import TextField from '@components/textfield';
import useAppTranslation from '@hooks/useAppTranslation';
import { Stack } from '@mui/material';
import useTabs from '../useTabs';
import Typography from '@components/typography';
import useTextOnlyTab from './useTextOnlyTab';
import { AddAnnouncementDraftProps } from '../../index.types';

const TextOnlyTab = (props: AddAnnouncementDraftProps) => {
  const { t } = useAppTranslation();
  const { categories } = useTabs();
  const { handleChangeTitle, handleChangeCategory, handleChangeText } =
    useTextOnlyTab(props.changeDraft);

  return (
    <Stack spacing={'16px'} marginBottom={'-24px'}>
      <Stack spacing={'16px'} direction="row">
        <TextField
          label={t('tr_title')}
          value={props.draft?.title || ''}
          onChange={handleChangeTitle}
        />
        <Select
          label={t('tr_category')}
          value={props.draft?.category || ''}
          onChange={(event) =>
            handleChangeCategory({
              target: { value: event.target.value },
            } as Parameters<typeof handleChangeCategory>[0])
          }
        >
          {categories.map((category) => (
            <MenuItem key={category.key} value={category.key}>
              <Typography className="body-regular" color="var(--black)">
                {category.title}
              </Typography>
            </MenuItem>
          ))}
        </Select>
      </Stack>
      <TextField
        multiline
        label={t('tr_text')}
        minRows={6}
        value={props.draft?.text || ''}
        onChange={handleChangeText}
        sx={{
          '& .MuiInputBase-input': {
            resize: 'vertical',
            overflow: 'auto',
          },
        }}
      />
    </Stack>
  );
};

export default TextOnlyTab;
