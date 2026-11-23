import { Stack } from '@mui/material';
import { useAtomValue } from 'jotai';
import { useAppTranslation } from '@hooks/index';
import { userDataViewState } from '@states/settings';
import { MeetingFieldsProps, TalkField } from './index.types';
import useMeetingFields from './useMeetingFields';
import SongSource from '@features/meetings/song_source';
import TextField from '@components/textfield';
import Typography from '@components/typography';

const TALK_LABELS: Record<TalkField, string> = {
  midweek: 'tr_coTalk',
  public: 'tr_publicTalk',
  service: 'tr_serviceTalk',
};

// Talks and songs live in the meeting sources, so they also show in the
// meeting schedules.
const MeetingFields = (props: MeetingFieldsProps) => {
  const { t } = useAppTranslation();

  const dataView = useAtomValue(userDataViewState);

  const { hasSource, talks, talkFields, handleTalkChange } =
    useMeetingFields(props);

  if (!hasSource) return null;

  const songTypes =
    props.meeting === 'midweek'
      ? (['concluding'] as const)
      : (['opening', 'concluding'] as const);

  return (
    <Stack spacing={props.isEdit ? '16px' : '4px'}>
      {talkFields.map((field) =>
        props.isEdit ? (
          <TextField
            key={field}
            label={t(TALK_LABELS[field])}
            value={talks[field]}
            onChange={(e) => handleTalkChange(field, e.target.value)}
          />
        ) : (
          talks[field] && (
            <Typography key={field} className="body-small-regular">
              {`${t(TALK_LABELS[field])}: ${talks[field]}`}
            </Typography>
          )
        )
      )}

      {songTypes.map((type) => (
        <SongSource
          key={type}
          week={props.weekOf}
          meeting={props.meeting}
          type={type}
          isEdit={props.isEdit}
          dataView={dataView}
          label={t(type === 'opening' ? 'tr_openingSong' : 'tr_closingSong')}
        />
      ))}
    </Stack>
  );
};

export default MeetingFields;
