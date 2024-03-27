import { Box, Collapse, IconButton, Table, TableBody, TableCell, TableRow } from '@mui/material';
import { IconCheck, IconClose, IconCollapse, IconEdit, IconExpand } from '@components/icons';
import Button from '@components/button';
import TextField from '@components/textfield';
import Typography from '@components/typography';
import { TalkLocaleType } from '@definition/sources';
import useTalkRow from './useTalkRow';
import { t } from 'i18next';
import { useBreakpoints } from '@hooks/index';

type TalkRowType = {
  talk: TalkLocaleType;
  isExpandAll: boolean;
};

const TalkRow = ({ talk, isExpandAll }: TalkRowType) => {
  const { laptopUp } = useBreakpoints();

  const {
    collapseOpen,
    handleToggleCollapse,
    handleToggleEdit,
    isEditMode,
    handleTalkTitleChange,
    talkTitleTmp,
    handleSaveTalkTile,
    handleHistoryFocused,
    handleHistoryUnfocused,
    isHistoryFocused,
  } = useTalkRow(talk.talk_number, talk.talk_title, isExpandAll);

  return (
    <>
      <TableRow
        className="talk-list-item"
        onClick={handleToggleCollapse}
        sx={{
          cursor: 'pointer',
          height: '48px',
          '& > .MuiTableCell-root': {
            borderBottomStyle: isEditMode ? 'solid' : 'none',
          },
          backgroundColor: isHistoryFocused ? 'var(--accent-150)' : 'initial',
          '& .MuiTypography-root': {
            color: isHistoryFocused ? 'var(--accent-dark)' : 'var(--black)',
          },
          '& .row-btn, & .row-btn g, & .row-btn path': {
            fill: isHistoryFocused ? 'var(--accent-dark)' : 'var(--grey-300)',
          },
          '&:hover': {
            backgroundColor: 'var(--accent-150)',
            '& .MuiTypography-root': {
              color: 'var(--accent-dark)',
            },
            '& .row-btn, & .row-btn g, & .row-btn path': {
              fill: 'var(--accent-dark)',
            },
            '& + .talk-history': {
              backgroundColor: 'var(--accent-150)',
            },
          },
        }}
      >
        <TableCell component="th" scope="row">
          <Typography className="h4">{talk.talk_number}</Typography>
        </TableCell>
        <TableCell colSpan={isEditMode ? 4 : 1}>
          {!isEditMode && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              {laptopUp && (
                <IconButton className="row-btn" sx={{ padding: 0 }} onClick={handleToggleEdit}>
                  <IconEdit color="var(--grey-300)" />
                </IconButton>
              )}

              <Typography className="h4">{talk.talk_title}</Typography>
            </Box>
          )}
          {isEditMode && (
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                flexDirection: laptopUp ? 'row' : 'column-reverse',
              }}
            >
              <Box
                sx={{
                  display: 'flex',
                  gap: '8px',
                  alignItems: 'center',
                  justifyContent: laptopUp ? 'flex-start' : 'space-between',
                  width: laptopUp ? 'fit-content' : '100%',
                  '& > .MuiButton-root': {
                    padding: '4px 8px',
                    height: '32px',
                    minHeight: '32px',
                  },
                }}
              >
                <Button
                  variant="small"
                  color="red"
                  onClick={handleToggleEdit}
                  disableAutoStretch
                  startIcon={<IconClose height={20} width={20} color="var(--red-main)" />}
                >
                  {t('tr_cancel')}
                </Button>
                <Button
                  variant="small"
                  onClick={handleSaveTalkTile}
                  disableAutoStretch
                  startIcon={<IconCheck height={20} width={20} color="var(--accent-main)" />}
                >
                  {t('tr_save')}
                </Button>
              </Box>
              <TextField
                variant="standard"
                value={talkTitleTmp}
                onChange={(e) => handleTalkTitleChange(e.target.value)}
                sx={{ padding: '0px 4px', '& .MuiInput-input': { color: 'var(--black)' } }}
              />
            </Box>
          )}
        </TableCell>
        {!isEditMode && (
          <>
            <TableCell>
              <Typography className="body-small-regular">01/01/24</Typography>
            </TableCell>
            <TableCell>
              <Typography className="body-small-regular" sx={{ flexGrow: 1 }}>
                Jason Bob
              </Typography>
            </TableCell>
            <TableCell>
              <Box className="row-btn" sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                {!collapseOpen && <IconExpand color="var(--black)" />}
                {collapseOpen && <IconCollapse color="var(--black)" />}
              </Box>
            </TableCell>
          </>
        )}
      </TableRow>
      {!isEditMode && (
        <TableRow
          className="talk-history"
          onClick={handleToggleCollapse}
          sx={{
            marginTop: '-5px',
            cursor: 'pointer',
            '&:hover': {
              backgroundColor: 'var(--accent-150)',
            },
          }}
          onMouseEnter={handleHistoryFocused}
          onMouseLeave={handleHistoryUnfocused}
        >
          <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={5}>
            <Collapse in={collapseOpen} timeout="auto" unmountOnExit>
              <Table
                size="small"
                sx={{
                  marginBottom: '16px',
                  '& .MuiTableCell-root': {
                    padding: 0,
                    boxSizing: 'content-box',
                  },
                  '& .MuiTableRow-root > .MuiTableCell-root': {
                    border: 'none',
                  },
                }}
              >
                <TableBody>
                  {[
                    { date: '12/08/22', name: 'Floyd Miles' },
                    { date: '06/08/20', name: 'Jason Brendon' },
                  ].map((history, index) => (
                    <TableRow
                      key={history.date}
                      sx={{
                        minHeight: 'fit-content',
                        '& .MuiTypography-root': {
                          color: 'var(--grey-350)',
                        },
                      }}
                    >
                      <TableCell sx={{ minWidth: '200px' }} align="left">
                        {index === 0 && !laptopUp && (
                          <Button
                            variant="small"
                            onClick={handleToggleEdit}
                            disableAutoStretch
                            startIcon={<IconEdit height={20} width={20} color="var(--accent-dark)" />}
                            sx={{ padding: '4px 8px', height: '32px', minHeight: '32px' }}
                          >
                            {t('tr_rename')}
                          </Button>
                        )}
                      </TableCell>
                      <TableCell align="left" sx={{ width: '78px' }}>
                        <Typography className="body-small-regular">{history.date}</Typography>
                      </TableCell>
                      <TableCell align="left" sx={{ width: '210px' }}>
                        <Typography className="body-small-regular">{history.name}</Typography>
                      </TableCell>
                      <TableCell sx={{ width: '16px' }} />
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Collapse>
          </TableCell>
        </TableRow>
      )}
    </>
  );
};

export default TalkRow;
