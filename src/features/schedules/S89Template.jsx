import { useRecoilValue } from 'recoil';
import { useTranslation } from 'react-i18next';
import { Markup } from 'interweave';
import Box from '@mui/material/Box';
import Checkbox from '@mui/material/Checkbox';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import { appLangState } from '../../states/main';
import { s89DataState } from '../../states/schedule';

const sharedStyles = {
  tblData: {
    padding: 0,
    borderBottom: 'none',
  },
};

const S89Template = () => {
  const { t } = useTranslation();

  const appLang = useRecoilValue(appLangState);
  const s89Data = useRecoilValue(s89DataState);

  return (
    <Box>
      {s89Data.length > 0 && (
        <Box id="S89-wrapper" sx={{ backgroundColor: 'white' }}>
          {s89Data.map((data) => (
            <Box key={data.id}>
              <Box
                sx={{
                  width: '321.6px',
                  height: '426.8px',
                }}
              >
                <TableContainer sx={{ paddingTop: '10px' }}>
                  <Table size="small">
                    <TableBody>
                      <TableRow>
                        <TableCell align="center" sx={sharedStyles.tblData}>
                          <Typography
                            sx={{
                              fontFamily: 'Segoe UI',
                              fontWeight: 'bold',
                              fontSize: '15px',
                              lineHeight: 1.3,
                              color: 'black',
                            }}
                          >
                            <Markup content={t('s89.title')} />
                          </Typography>
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </TableContainer>
                <TableContainer
                  sx={{
                    paddingTop: '5px',
                    paddingLeft: '10px',
                    paddingRight: '10px',
                  }}
                >
                  <Table size="small">
                    <TableBody>
                      <TableRow>
                        <TableCell
                          sx={{
                            ...sharedStyles.tblData,
                            width: 0,
                            paddingRight: '10px',
                          }}
                        >
                          <Typography
                            sx={{
                              fontFamily: 'Segoe UI',
                              fontWeight: 'bold',
                              fontSize: '15px',
                              color: 'black',
                            }}
                          >
                            {t('global.name')}:
                          </Typography>
                        </TableCell>
                        <TableCell
                          sx={{
                            ...sharedStyles.tblData,
                            borderBottom: '1px dotted black',
                          }}
                        >
                          <Typography
                            sx={{
                              fontFamily: 'Segoe UI',
                              fontSize: '13px',
                              color: 'black',
                            }}
                          >
                            {data.studentName}
                          </Typography>
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </TableContainer>
                <TableContainer
                  sx={{
                    paddingTop: '5px',
                    paddingLeft: '10px',
                    paddingRight: '10px',
                  }}
                >
                  <Table size="small">
                    <TableBody>
                      <TableRow>
                        <TableCell
                          sx={{
                            ...sharedStyles.tblData,
                            width: 0,
                            paddingRight: '10px',
                          }}
                        >
                          <Typography
                            sx={{
                              fontFamily: 'Segoe UI',
                              fontWeight: 'bold',
                              fontSize: '15px',
                              color: 'black',
                            }}
                          >
                            {t('global.assistant')}:
                          </Typography>
                        </TableCell>
                        <TableCell
                          sx={{
                            ...sharedStyles.tblData,
                            borderBottom: '1px dotted black',
                          }}
                        >
                          <Typography
                            sx={{
                              fontFamily: 'Segoe UI',
                              fontSize: '13px',
                              color: 'black',
                            }}
                          >
                            {data.assistantName}
                          </Typography>
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </TableContainer>
                <TableContainer
                  sx={{
                    paddingTop: '5px',
                    paddingLeft: '10px',
                    paddingRight: '10px',
                  }}
                >
                  <Table size="small">
                    <TableBody>
                      <TableRow>
                        <TableCell
                          sx={{
                            ...sharedStyles.tblData,
                            width: 0,
                            paddingRight: '10px',
                          }}
                        >
                          <Typography
                            sx={{
                              fontFamily: 'Segoe UI',
                              fontWeight: 'bold',
                              fontSize: '15px',
                              color: 'black',
                            }}
                          >
                            {t('global.date')}:
                          </Typography>
                        </TableCell>
                        <TableCell
                          align="center"
                          sx={{
                            ...sharedStyles.tblData,
                            borderBottom: '1px dotted black',
                          }}
                        >
                          <Typography
                            sx={{
                              fontFamily: 'Segoe UI',
                              fontSize: '13px',
                              color: 'black',
                            }}
                          >
                            {data.assignmentDate}
                          </Typography>
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </TableContainer>
                <Typography
                  sx={{
                    fontFamily: 'Segoe UI',
                    fontSize: '13px',
                    fontWeight: 'bold',
                    marginTop: '15px',
                    marginLeft: '10px',
                    color: 'black',
                  }}
                >
                  {t('global.assignment')}:
                </Typography>
                <TableContainer
                  sx={{
                    paddingTop: '5px',
                    paddingLeft: '15px',
                    paddingRight: '10px',
                  }}
                >
                  <Table size="small">
                    <TableBody>
                      <TableRow>
                        <TableCell
                          sx={{
                            ...sharedStyles.tblData,
                            width: 0,
                            paddingRight: '5px',
                            lineHeight: 1,
                          }}
                        >
                          <Checkbox
                            color="default"
                            size="small"
                            sx={{
                              padding: 0,
                              '& .MuiSvgIcon-root': { fontSize: 15 },
                              color: 'black',
                            }}
                            checked={data.isBRead}
                            onChange={() => {}}
                          />
                        </TableCell>
                        <TableCell
                          sx={{
                            ...sharedStyles.tblData,
                            lineHeight: 1,
                            width: '127px',
                          }}
                        >
                          <Typography
                            sx={{
                              fontFamily: 'Segoe UI',
                              fontSize: '12px',
                              lineHeight: 1,
                              color: 'black',
                            }}
                          >
                            {t('global.bibleReading')}
                          </Typography>
                        </TableCell>
                        <TableCell
                          sx={{
                            ...sharedStyles.tblData,
                            width: 0,
                            paddingRight: '5px',
                            paddingLeft: '5px',
                            lineHeight: 1,
                          }}
                        >
                          <Checkbox
                            color="default"
                            size="small"
                            sx={{
                              padding: 0,
                              '& .MuiSvgIcon-root': { fontSize: 15 },
                              color: 'black',
                            }}
                            checked={data.isBibleStudy}
                            onChange={() => {}}
                          />
                        </TableCell>
                        <TableCell
                          sx={{
                            ...sharedStyles.tblData,
                            lineHeight: 1,
                            width: '125px',
                          }}
                        >
                          <Typography
                            sx={{
                              fontFamily: 'Segoe UI',
                              fontSize: '12px',
                              lineHeight: 1,
                              color: 'black',
                            }}
                          >
                            {t('global.bibleStudy')}
                          </Typography>
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell
                          sx={{
                            ...sharedStyles.tblData,
                            width: 0,
                            paddingRight: '5px',
                            lineHeight: 1,
                          }}
                        >
                          <Checkbox
                            color="default"
                            size="small"
                            sx={{
                              padding: 0,
                              '& .MuiSvgIcon-root': { fontSize: 15 },
                              color: 'black',
                            }}
                            checked={data.isInitialCall}
                            onChange={() => {}}
                          />
                        </TableCell>
                        <TableCell
                          sx={{
                            ...sharedStyles.tblData,
                            lineHeight: 1,
                          }}
                        >
                          <Typography
                            sx={{
                              fontFamily: 'Segoe UI',
                              fontSize: '12px',
                              lineHeight: 1,
                              color: 'black',
                            }}
                          >
                            {t('global.initialCall')}
                          </Typography>
                        </TableCell>
                        <TableCell
                          sx={{
                            ...sharedStyles.tblData,
                            width: 0,
                            paddingRight: '5px',
                            paddingLeft: '5px',
                            lineHeight: 1,
                          }}
                        >
                          <Checkbox
                            color="default"
                            size="small"
                            sx={{
                              padding: 0,
                              '& .MuiSvgIcon-root': { fontSize: 15 },
                              color: 'black',
                            }}
                            checked={data.isTalk}
                            onChange={() => {}}
                          />
                        </TableCell>
                        <TableCell
                          sx={{
                            ...sharedStyles.tblData,
                            lineHeight: 1,
                          }}
                        >
                          <Typography
                            sx={{
                              fontFamily: 'Segoe UI',
                              fontSize: '12px',
                              lineHeight: 1,
                              color: 'black',
                            }}
                          >
                            {t('global.talk')}
                          </Typography>
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </TableContainer>
                <TableContainer
                  sx={{
                    paddingLeft: '30px',
                    paddingRight: '10px',
                  }}
                >
                  <Table size="small">
                    <TableBody>
                      <TableRow>
                        <TableCell
                          sx={{
                            ...sharedStyles.tblData,
                            width: 0,
                            paddingRight: '5px',
                            lineHeight: 1,
                          }}
                        ></TableCell>
                        <TableCell
                          sx={{
                            ...sharedStyles.tblData,
                            width: 0,
                            paddingRight: '127px',
                            lineHeight: 1,
                            borderBottom: '1px dotted black',
                          }}
                        >
                          <Typography
                            sx={{
                              fontFamily: 'Segoe UI',
                              fontSize: '12px',
                              lineHeight: 1,
                              color: 'black',
                            }}
                          >
                            {data.isInitialCallSpec}
                          </Typography>
                        </TableCell>
                        <TableCell
                          sx={{
                            ...sharedStyles.tblData,
                            width: 0,
                            paddingRight: '5px',
                            paddingLeft: '5px',
                            lineHeight: 1,
                          }}
                        >
                          <Checkbox
                            color="default"
                            size="small"
                            sx={{
                              padding: 0,
                              '& .MuiSvgIcon-root': { fontSize: 15 },
                              color: 'black',
                            }}
                          />
                        </TableCell>
                        <TableCell
                          sx={{
                            ...sharedStyles.tblData,
                            width: 0,
                            paddingRight: '2px',
                            lineHeight: 1,
                          }}
                        >
                          <Typography
                            sx={{
                              fontFamily: 'Segoe UI',
                              fontSize: '12px',
                              lineHeight: 1,
                              color: 'black',
                            }}
                          >
                            {t('global.otherPart')}:
                          </Typography>
                        </TableCell>
                        <TableCell
                          sx={{
                            ...sharedStyles.tblData,
                            borderBottom: '1px dotted black',
                            lineHeight: 1,
                          }}
                        >
                          <Typography
                            sx={{
                              fontFamily: 'Segoe UI',
                              fontSize: '12px',
                              lineHeight: 1,
                              color: 'black',
                            }}
                          ></Typography>
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </TableContainer>
                <TableContainer
                  sx={{
                    paddingTop: '3px',
                    paddingLeft: '15px',
                    paddingRight: '10px',
                    width: '175px',
                  }}
                >
                  <Table size="small">
                    <TableBody>
                      <TableRow>
                        <TableCell
                          sx={{
                            ...sharedStyles.tblData,
                            width: 0,
                            paddingRight: '5px',
                            lineHeight: 1,
                          }}
                        >
                          <Checkbox
                            color="default"
                            size="small"
                            sx={{
                              padding: 0,
                              '& .MuiSvgIcon-root': { fontSize: 15 },
                              color: 'black',
                            }}
                            checked={data.isReturnVisit}
                            onChange={() => {}}
                          />
                        </TableCell>
                        <TableCell
                          sx={{
                            ...sharedStyles.tblData,
                            lineHeight: 1.3,
                          }}
                        >
                          <Typography
                            sx={{
                              fontFamily: 'Segoe UI',
                              fontSize: '12px',
                              lineHeight: 1.3,
                              color: 'black',
                            }}
                          >
                            {t('global.returnVisit')}
                          </Typography>
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </TableContainer>
                <TableContainer
                  sx={{
                    paddingLeft: '30px',
                    paddingRight: '10px',
                    width: '173px',
                  }}
                >
                  <Table size="small" sx={{ height: '18px' }}>
                    <TableBody>
                      <TableRow>
                        <TableCell
                          sx={{
                            ...sharedStyles.tblData,
                            width: 0,
                            paddingRight: '5px',
                            lineHeight: 1,
                          }}
                        ></TableCell>
                        <TableCell
                          sx={{
                            ...sharedStyles.tblData,
                            borderBottom: '1px dotted black',
                            lineHeight: 1,
                          }}
                        >
                          <Typography
                            sx={{
                              fontFamily: 'Segoe UI',
                              fontSize: '12px',
                              lineHeight: 1,
                              color: 'black',
                            }}
                          >
                            {data.returnVisitSpec}
                          </Typography>
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </TableContainer>
                <Typography
                  sx={{
                    fontFamily: 'Segoe UI',
                    fontSize: '13px',
                    fontWeight: 'bold',
                    marginTop: '8px',
                    marginLeft: '10px',
                    color: 'black',
                  }}
                >
                  {t('s89.toBeGiven')}
                </Typography>
                <TableContainer
                  sx={{
                    paddingLeft: '15px',
                    paddingRight: '10px',
                  }}
                >
                  <Table size="small">
                    <TableBody>
                      <TableRow>
                        <TableCell
                          sx={{
                            ...sharedStyles.tblData,
                            width: 0,
                            paddingRight: '5px',
                            lineHeight: 1.2,
                          }}
                        >
                          <Checkbox
                            color="default"
                            size="small"
                            sx={{
                              padding: 0,
                              '& .MuiSvgIcon-root': { fontSize: 15 },
                              color: 'black',
                            }}
                            checked={data.isMainHall}
                            onChange={() => {}}
                          />
                        </TableCell>
                        <TableCell
                          sx={{
                            ...sharedStyles.tblData,
                            lineHeight: 1.2,
                          }}
                        >
                          <Typography
                            sx={{
                              fontFamily: 'Segoe UI',
                              fontSize: '12px',
                              lineHeight: 1.2,
                              color: 'black',
                            }}
                          >
                            {t('global.mainHall')}
                          </Typography>
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell
                          sx={{
                            ...sharedStyles.tblData,
                            width: 0,
                            paddingRight: '5px',
                            lineHeight: 1.2,
                          }}
                        >
                          <Checkbox
                            color="default"
                            size="small"
                            sx={{
                              padding: 0,
                              '& .MuiSvgIcon-root': { fontSize: 15 },
                              color: 'black',
                            }}
                            checked={data.isAuxClass}
                            onChange={() => {}}
                          />
                        </TableCell>
                        <TableCell
                          sx={{
                            ...sharedStyles.tblData,
                            lineHeight: 1.2,
                          }}
                        >
                          <Typography
                            sx={{
                              fontFamily: 'Segoe UI',
                              fontSize: '12px',
                              lineHeight: 1.2,
                              color: 'black',
                            }}
                          >
                            {t('global.auxClass1')}
                          </Typography>
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell
                          sx={{
                            ...sharedStyles.tblData,
                            width: 0,
                            paddingRight: '5px',
                            lineHeight: 1.2,
                          }}
                        >
                          <Checkbox
                            color="default"
                            size="small"
                            sx={{
                              padding: 0,
                              '& .MuiSvgIcon-root': { fontSize: 15 },
                              color: 'black',
                            }}
                          />
                        </TableCell>
                        <TableCell
                          sx={{
                            ...sharedStyles.tblData,
                            lineHeight: 1.2,
                          }}
                        >
                          <Typography
                            sx={{
                              fontFamily: 'Segoe UI',
                              fontSize: '12px',
                              lineHeight: 1.2,
                              color: 'black',
                            }}
                          >
                            {t('global.auxClass2')}
                          </Typography>
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </TableContainer>
                <Box>
                  <Typography
                    sx={{
                      fontFamily: 'Segoe UI',
                      fontSize: '9px',
                      marginTop: '5px',
                      marginLeft: '10px',
                      marginRight: '10px',
                      lineHeight: 1.2,
                      textAlign: 'justify',
                      color: 'black',
                    }}
                  >
                    <Markup content={t('s89.descFooter')} />
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex' }}>
                  <Typography
                    sx={{
                      fontFamily: 'Segoe UI',
                      fontSize: '11px',
                      marginTop: '10px',
                      marginLeft: '10px',
                      color: 'black',
                    }}
                  >
                    S-89-{appLang.toUpperCase()}
                  </Typography>
                  <Typography
                    sx={{
                      fontFamily: 'Segoe UI',
                      fontSize: '11px',
                      marginTop: '10px',
                      marginLeft: '10px',
                      color: 'black',
                    }}
                  >
                    11/20
                  </Typography>
                </Box>
              </Box>
              <div className="html2pdf__page-break"></div>
            </Box>
          ))}
        </Box>
      )}
    </Box>
  );
};

export default S89Template;
