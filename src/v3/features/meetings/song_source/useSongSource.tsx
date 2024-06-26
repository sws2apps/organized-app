import { useEffect, useState } from 'react';
import { useRecoilValue } from 'recoil';
import { sourcesState } from '@states/sources';
import { SongSourceType } from './index.types';
import { songsState } from '@states/songs';
import { JWLangState } from '@states/app';
import { useAppTranslation } from '@hooks/index';
import { userDataViewState } from '@states/settings';
import { SongType } from '@definition/songs';

const useSongSource = ({ meeting, type, week }: SongSourceType) => {
  const { t } = useAppTranslation();

  const sources = useRecoilValue(sourcesState);
  const songs = useRecoilValue(songsState);
  const lang = useRecoilValue(JWLangState);
  const dataView = useRecoilValue(userDataViewState);

  const [songTitle, setSongTitle] = useState('');
  const [selectedSong, setSelectedSong] = useState<SongType>(null);

  const songLocale = t('tr_song');

  const source = sources.find((record) => record.weekOf === week);

  const handleSongChange = async (value: SongType) => {
    console.log(value);
  };

  useEffect(() => {
    if (source && meeting === 'midweek') {
      if (type === 'opening') {
        const song = source.midweek_meeting.song_first[lang];
        const title = songs.find((record) => record.song_number === +song);

        const result = title ? `${songLocale} ${title.song_title}` : song;

        setSongTitle(result as string);
      }

      if (type === 'middle') {
        const song = source.midweek_meeting.song_middle[lang];
        const title = songs.find((record) => record.song_number === +song);

        const result = title ? `${songLocale} ${title.song_title}` : song;

        setSongTitle(result as string);
      }

      if (type === 'concluding') {
        const songOverride =
          source.midweek_meeting.song_conclude.override.find((record) => record.type === dataView)?.value || '';
        const songDefault = source.midweek_meeting.song_conclude.default[lang];
        const song = songOverride.length > 0 ? songOverride : songDefault;

        const title = songs.find((record) => record.song_number === +song);

        const result = title ? `${songLocale} ${title.song_title}` : song;

        setSongTitle(result as string);
        setSelectedSong(title ? title : null);
      }
    }
  }, [meeting, songs, source, lang, type, songLocale, dataView]);

  return { songTitle, songs, selectedSong, handleSongChange };
};

export default useSongSource;
