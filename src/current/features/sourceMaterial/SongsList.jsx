import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';

const SongsList = ({ song, setSong, readOnly }) => {
  const { t } = useTranslation('ui');

  const [songsList, setSongsList] = useState([]);

  useEffect(() => {
    const N = 158;
    let i = 0;
    const a = Array(N);

    while (i < N) a[i++] = i;
    setSongsList(a);
  }, []);

  return (
    <TextField
      id="outlined-select-song"
      select
      label={t('song')}
      size="small"
      InputProps={{ readOnly }}
      value={songsList.length === 0 ? '' : song}
      onChange={(e) => setSong(e.target.value)}
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
