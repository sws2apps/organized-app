import { useState } from 'react';
import { useRecoilValue } from 'recoil';
import { useTranslation } from 'react-i18next';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { publicTalksState } from '../states/sourceMaterial';
import { PublicTalkContainer, PublicTalkPagination } from '../features/publicTalks';

const PublicTalksList = () => {
  const { t } = useTranslation('ui');

  const publicTalks = useRecoilValue(publicTalksState);

  const [page, setPage] = useState(0);

  const handleChangePage = (_, newPage) => {
    setPage(newPage);
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: '10px', justifyContent: 'space-between', maxWidth: '900px' }}>
        <Typography sx={{ marginBottom: '10px', textTransform: 'uppercase', fontWeight: 'bold' }}>
          {t('publicTalksList')}
        </Typography>
      </Box>

      <Box sx={{ maxWidth: '900px' }}>
        {publicTalks.length > 0 && (
          <PublicTalkPagination count={publicTalks.length} page={page} handleChangePage={handleChangePage} />
        )}

        <Box sx={{ margin: '10px 0 20px 0' }}>
          {publicTalks.length > 0 && <PublicTalkContainer currentPage={page} />}
          {publicTalks.length === 0 && <Typography sx={{ marginTop: '20px' }}>{t('downloadPublicTalks')}</Typography>}
        </Box>

        {publicTalks.length > 0 && (
          <PublicTalkPagination count={publicTalks.length} page={page} handleChangePage={handleChangePage} />
        )}
      </Box>
    </Box>
  );
};

export default PublicTalksList;
