import { useRecoilValue } from 'recoil';
import { useTranslation } from 'react-i18next';
import { Markup } from 'interweave';
import Box from '@mui/material/Box';
import Checkbox from '@mui/material/Checkbox';
import Typography from '@mui/material/Typography';
import { appLangState } from '../../states/main';
import { s89DataState } from '../../states/schedule';

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
                {/* S-89 Header */}
                <Typography
                  align="center"
                  sx={{
                    paddingTop: '10px',
                    fontFamily: 'Segoe UI',
                    fontWeight: 'bold',
                    fontSize: '15px',
                    lineHeight: 1.3,
                    color: 'black',
                  }}
                >
                  <Markup content={t('s89.title')} />
                </Typography>

                {/* Student name row */}
                <Box
                  sx={{
                    paddingTop: '5px',
                    paddingLeft: '10px',
                    paddingRight: '10px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '5px',
                  }}
                >
                  <Typography
                    sx={{
                      fontFamily: 'Segoe UI',
                      fontWeight: 'bold',
                      fontSize: '15px',
                      height: '20px',
                      color: 'black',
                    }}
                  >
                    {t('global.name')}:
                  </Typography>
                  <Typography
                    sx={{
                      fontFamily: 'Segoe UI',
                      fontSize: '13px',
                      color: 'black',
                      height: '20px',
                      borderBottom: '1px dotted black',
                      width: '100%',
                    }}
                  >
                    {data.studentName}
                  </Typography>
                </Box>

                {/* Assistant name row */}
                <Box
                  sx={{
                    paddingTop: '10px',
                    paddingLeft: '10px',
                    paddingRight: '10px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '5px',
                  }}
                >
                  <Typography
                    sx={{
                      fontFamily: 'Segoe UI',
                      fontWeight: 'bold',
                      fontSize: '15px',
                      color: 'black',
                      height: '20px',
                    }}
                  >
                    {t('global.assistant')}:
                  </Typography>
                  <Typography
                    sx={{
                      fontFamily: 'Segoe UI',
                      fontSize: '13px',
                      color: 'black',
                      width: '100%',
                      height: '20px',
                      borderBottom: '1px dotted black',
                    }}
                  >
                    {data.assistantName}
                  </Typography>
                </Box>

                {/* Assignment date row */}
                <Box
                  sx={{
                    paddingTop: '10px',
                    paddingLeft: '10px',
                    paddingRight: '10px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '5px',
                  }}
                >
                  <Typography
                    sx={{
                      fontFamily: 'Segoe UI',
                      fontWeight: 'bold',
                      fontSize: '15px',
                      color: 'black',
                      height: '20px',
                    }}
                  >
                    {t('global.date')}:
                  </Typography>
                  <Typography
                    align="center"
                    sx={{
                      fontFamily: 'Segoe UI',
                      fontSize: '13px',
                      color: 'black',
                      width: '100%',
                      height: '20px',
                      borderBottom: '1px dotted black',
                    }}
                  >
                    {data.assignmentDate}
                  </Typography>
                </Box>

                {/* Assignment label */}
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

                {/* Assignment type */}
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    paddingTop: '5px',
                    paddingLeft: '15px',
                    gap: '5px',
                  }}
                >
                  {/* 1st column */}
                  <Box sx={{ width: '150px', display: 'flex', flexDirection: 'column', gap: '2px' }}>
                    {/* Bible Reading */}
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
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
                    </Box>

                    {/* Initial Call or Memorial Invitation */}
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                      <Checkbox
                        color="default"
                        size="small"
                        sx={{
                          padding: 0,
                          '& .MuiSvgIcon-root': { fontSize: 15 },
                          color: 'black',
                        }}
                        checked={data.isMemorialInvite ? true : data.isInitialCall}
                        onChange={() => {}}
                      />
                      <Typography
                        sx={{
                          fontFamily: 'Segoe UI',
                          fontSize: '12px',
                          lineHeight: 1,
                          color: 'black',
                        }}
                      >
                        {data.isMemorialInvite ? t('global.memorialInvite') : t('global.initialCall')}
                      </Typography>
                    </Box>

                    {/* Initial Call or Memorial Invitation Part Indice */}
                    <Box sx={{ paddingLeft: '20px', marginTop: '-5px' }}>
                      <Typography
                        sx={{
                          fontFamily: 'Segoe UI',
                          fontSize: '12px',
                          lineHeight: 1,
                          color: 'black',
                          height: '20px',
                          borderBottom: '1px dotted black',
                        }}
                      >
                        {data.initialCallSpec}
                      </Typography>
                    </Box>

                    {/* Return Visit */}
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: '5px', marginTop: '2px' }}>
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
                      <Typography
                        sx={{
                          fontFamily: 'Segoe UI',
                          fontSize: '12px',
                          lineHeight: 1,
                          color: 'black',
                        }}
                      >
                        {t('global.returnVisit')}
                      </Typography>
                    </Box>

                    {/* Return Visit Part Indice */}
                    <Box sx={{ paddingLeft: '20px', marginTop: '-5px' }}>
                      <Typography
                        sx={{
                          fontFamily: 'Segoe UI',
                          fontSize: '12px',
                          lineHeight: 1,
                          color: 'black',
                          height: '20px',
                          borderBottom: '1px dotted black',
                        }}
                      >
                        {data.returnVisitSpec}
                      </Typography>
                    </Box>
                  </Box>

                  {/* 2nd column */}
                  <Box sx={{ width: '140px' }}>
                    {/* Bible Study */}
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
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
                    </Box>

                    {/* Talk */}
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
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
                    </Box>

                    {/* Other Assignment */}
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                        <Checkbox
                          color="default"
                          size="small"
                          sx={{
                            padding: 0,
                            '& .MuiSvgIcon-root': { fontSize: 15 },
                            color: 'black',
                          }}
                          checked={false}
                          onChange={() => {}}
                        />
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
                      </Box>
                      <Typography
                        sx={{
                          fontFamily: 'Segoe UI',
                          fontSize: '12px',
                          lineHeight: 1,
                          color: 'black',
                          height: '18px',
                          width: '100%',
                          borderBottom: '1px dotted black',
                        }}
                      ></Typography>
                    </Box>
                  </Box>
                </Box>

                {/* Class label */}
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

                <Box sx={{ paddingLeft: '15px', display: 'flex', flexDirection: 'column', gap: '3px' }}>
                  {/* 1st class */}
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
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
                  </Box>

                  {/* 2nd class */}
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
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
                  </Box>

                  {/* 3rd class */}
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <Checkbox
                      color="default"
                      size="small"
                      sx={{
                        padding: 0,
                        '& .MuiSvgIcon-root': { fontSize: 15 },
                        color: 'black',
                      }}
                      checked={false}
                      onChange={() => {}}
                    />
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
                  </Box>
                </Box>

                {/* S-89 Note */}
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

                {/* S-89 Footer */}
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
