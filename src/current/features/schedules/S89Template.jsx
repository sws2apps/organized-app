import { useRecoilValue } from 'recoil';
import { useTranslation } from 'react-i18next';
import { Markup } from 'interweave';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import S89Header from './S89Header';
import S89DetailsRow from './S89DetailsRow';
import S89Subheading from './S89Subheading';
import S89Assignment from './S89Assignment';
import S89Class from './S89Class';
import { sourceLangState } from '../../states/main';
import { s89DataState } from '../../states/schedule';

const styles = {
  base: {
    fontFamily: 'Segoe UI',
    fontSize: '11px',
    marginTop: '10px',
    marginLeft: '10px',
    color: 'black',
  },
};

const S89Template = () => {
  const { t } = useTranslation('source');

  const sourceLang = useRecoilValue(sourceLangState);
  const s89Data = useRecoilValue(s89DataState);

  return (
    <Box>
      {s89Data.length > 0 && (
        <Box id="S89-wrapper" sx={{ backgroundColor: 'white' }}>
          {s89Data.map((data) => (
            <Box
              key={data.id}
              sx={{
                width: '321.6px',
                height: '426.8px',
              }}
            >
              <Box>
                {/* S-89 Header */}
                <S89Header />

                {/* Student name row */}
                <S89DetailsRow leftText={t('name', { lng: sourceLang })} rightText={data.studentName} />

                {/* Assistant name row */}
                <S89DetailsRow leftText={t('assistant', { lng: sourceLang })} rightText={data.assistantName} />

                {/* Assignment date row */}
                <S89DetailsRow
                  leftText={t('date', { lng: sourceLang })}
                  rightText={data.assignmentDate}
                  alignRight="center"
                />

                {/* Assignment label */}
                <S89Subheading subheading={t('assignment', { lng: sourceLang })} />

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
                    <S89Assignment
                      assignment={t('bibleReading', { lng: sourceLang, ns: 'source' })}
                      checked={data.isBRead}
                    />

                    {/* Initial Call or Memorial Invitation */}
                    <S89Assignment
                      assignment={
                        data.isMemorialInvite
                          ? t('memorialInvite', { lng: sourceLang, ns: 'source' })
                          : t('initialCall', { lng: sourceLang, ns: 'source' })
                      }
                      checked={data.isMemorialInvite ? true : data.isInitialCall}
                      assignmentSpec={data.initialCallSpec}
                    />

                    {/* Return Visit */}
                    <S89Assignment
                      assignment={t('returnVisit', { lng: sourceLang, ns: 'source' })}
                      checked={data.isReturnVisit}
                      assignmentSpec={data.returnVisitSpec}
                    />
                  </Box>

                  {/* 2nd column */}
                  <Box sx={{ width: '140px' }}>
                    {/* Bible Study */}
                    <S89Assignment
                      assignment={t('bibleStudy', { lng: sourceLang, ns: 'source' })}
                      checked={data.isBibleStudy}
                    />

                    {/* Talk */}
                    <S89Assignment assignment={t('talk', { lng: sourceLang, ns: 'source' })} checked={data.isTalk} />

                    {/* Other Assignment */}
                    <S89Assignment
                      assignment={t('otherPart', { lng: sourceLang, ns: 'source' })}
                      checked={false}
                      otherPart={true}
                    />
                  </Box>
                </Box>

                {/* Class label */}
                <S89Subheading subheading={t('s89ToBeGiven', { lng: sourceLang })} />

                <Box sx={{ paddingLeft: '15px', display: 'flex', flexDirection: 'column', gap: '3px' }}>
                  {/* 1st class */}
                  <S89Class checked={data.isMainHall} assignmentClass={t('mainHall', { lng: sourceLang })} />

                  {/* 2nd class */}
                  <S89Class checked={data.isAuxClass} assignmentClass={t('auxClass1', { lng: sourceLang })} />

                  {/* 3rd class */}
                  <S89Class checked={false} assignmentClass={t('auxClass2', { lng: sourceLang })} />
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
                    <Markup content={t('s89DescFooter', { lng: sourceLang })} />
                  </Typography>
                </Box>

                {/* S-89 Footer */}
                <Box sx={{ display: 'flex' }}>
                  <Typography sx={styles.base}>S-89-{sourceLang.toUpperCase()}</Typography>
                  <Typography sx={styles.base}>11/20</Typography>
                </Box>
              </Box>

              <Box className="html2pdf__page-break"></Box>
            </Box>
          ))}
        </Box>
      )}
    </Box>
  );
};

export default S89Template;
