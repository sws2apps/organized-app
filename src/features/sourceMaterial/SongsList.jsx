import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';

const SongsList = (props) => {
  const { t } = useTranslation();

  const [song, setSong] = useState('');
  const [songsList, setSongsList] = useState([]);

  const handleChangeSong = async (e) => {
    setSong(e.target.value);
    if (props.songPart === 1) {
      props.setSongFirst(e.target.value);
    } else if (props.songPart === 2) {
      props.setSongMiddle(e.target.value);
    } else if (props.songPart === 3) {
      props.setSongConclude(e.target.value);
    }
  };

  useEffect(() => {
    const N = 151;
    let i = 0;
    const a = Array(N);

    while (i < N) a[i++] = i;
    setSongsList(a);
  }, []);

  useEffect(() => {
    setSong(props.song);
    return () => {
      //clean
    };
  }, [props.song]);

  return (
    <TextField
      id="outlined-select-song"
      select
      label={t('global.song')}
      size="small"
      value={song}
      onChange={(e) => handleChangeSong(e)}
      sx={{ width: '100px' }}
    >
      <MenuItem value=""></MenuItem>
      {songsList.length > 0 &&
        songsList.map((song) => (
          <MenuItem key={`song-${song}`} value={song}>
            {song}
          </MenuItem>
        ))}
    </TextField>
  );
};

export default SongsList;
