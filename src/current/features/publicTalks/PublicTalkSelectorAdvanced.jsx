import { useState } from 'react';
import Box from '@mui/material/Box';
import Collapse from '@mui/material/Collapse';
import { Schedules } from '../../classes/Schedules';
import { PublicTalkContainer, PublicTalkPagination } from '../publicTalks';

const PublicTalkSelectorAdvanced = ({ advancedOpen, setPublicTalk }) => {
  const [page, setPage] = useState(0);
  const publicTalks = Schedules.talkHistory;

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  return (
    <Collapse in={advancedOpen} timeout="auto" unmountOnExit>
      <Box sx={{ marginTop: '10px', border: '1px outset', borderRadius: '5px', padding: '10px', maxWidth: '800px' }}>
        {publicTalks.length > 0 && (
          <PublicTalkPagination
            count={publicTalks.length}
            page={page}
            handleChangePage={handleChangePage}
            noLabel={true}
          />
        )}

        {publicTalks.length > 0 && <PublicTalkContainer currentPage={page} readOnly setPublicTalk={setPublicTalk} />}

        {publicTalks.length > 0 && (
          <PublicTalkPagination
            count={publicTalks.length}
            page={page}
            handleChangePage={handleChangePage}
            noLabel={true}
          />
        )}
      </Box>
    </Collapse>
  );
};

export default PublicTalkSelectorAdvanced;
