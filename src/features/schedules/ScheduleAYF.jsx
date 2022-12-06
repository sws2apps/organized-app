import { useRecoilValue } from 'recoil';
import { useTranslation } from 'react-i18next';
import { useTheme } from '@mui/material';
import { alpha } from '@mui/material/styles';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import EditIcon from '@mui/icons-material/Edit';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import { classCountState } from '../../states/congregation';
import { themeOptionsState } from '../../states/theme';

const boxStudentAYF = {
  display: 'flex',
  flexDirection: 'column',
  gap: '5px',
};

const typoStudentField = {
  height: '25px',
  lineHeight: '25px',
  width: '165px',
  padding: '2px 2px 2px 5px',
  borderRadius: 5,
  fontWeight: 'bold',
};

const boxStudentFldContainer = {
  display: 'flex',
  gap: '5px',
  alignItems: 'flex-end',
};

const iconButtonContainer = {
  padding: '1px',
};

const editIconButton = {
  fontSize: '24px',
};

const ScheduleAYF = (props) => {
  const theme = useTheme();
  const { t } = useTranslation();

  const themeOptions = useRecoilValue(themeOptionsState);

  const {
    assType,
    assTypeName,
    assTime,
    assSrc,
    stuA,
    assA,
    stuB,
    assB,
    stuAID,
    assAID,
    stuBID,
    assBID,
    isStuA,
    isAssA,
    isStuB,
    isAssB,
  } = props.params;
  const { loadStudentPicker, readOnly } = props;

  const classCount = useRecoilValue(classCountState);

  const studentPartWrapper1Styles = {
    width: {
      xs: '100%',
      sm: 'calc(100% - 200px)',
    },
  };

  const studentPartWrapper2Styles = {
    width: {
      xs: '100%',
      sm: 'calc(100% - 200px)',
      sm800: 'calc(100% - 400px)',
      lg: 'calc(100% - 200px)',
    },
    flexDirection: {
      sm800: 'row',
    },
  };

  const studentContainer1Styles = {
    display: 'flex',
    justifyContent: {
      xs: 'flex-start',
      sm: 'flex-end',
    },
  };

  const studentContainer2Styles = {
    display: 'flex',
    justifyContent: {
      xs: 'flex-start',
      sm: 'flex-end',
    },
    flexDirection: {
      xs: 'column',
      xs420: 'row',
      sm: 'column',
      sm800: 'row',
      lg: 'column',
    },
  };

  const loadStuPicker = (assID, assType, assTypeName, currentStudent, stuForAssistant, assTypeNameForAssistant) => {
    var obj = {};
    obj.assID = assID;
    obj.assType = assType;
    obj.assTypeName = assTypeName;
    obj.currentStudent = currentStudent;
    obj.stuForAssistant = stuForAssistant;
    obj.assTypeNameForAssistant = assTypeNameForAssistant;
    loadStudentPicker(obj);
  };

  return (
    <>
      {assSrc && (
        <Box
          sx={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
            marginBottom: '10px',
          }}
        >
          <Grid item sx={classCount === 1 ? studentPartWrapper1Styles : studentPartWrapper2Styles}>
            {assType !== 107 && (
              <Typography variant="body1" sx={{ fontWeight: 'bold', fontSize: '16px' }}>
                {assTypeName} ({assTime} min.)
              </Typography>
            )}
            <Typography variant="body1">{assSrc}</Typography>
          </Grid>
          {assType !== 105 && assType !== 106 && assType !== 107 && assType !== 117 && (
            <Grid item sx={classCount === 1 ? studentContainer1Styles : studentContainer2Styles}>
              <Box sx={boxStudentAYF}>
                <Box sx={boxStudentFldContainer}>
                  <Typography
                    sx={{
                      ...typoStudentField,
                      backgroundColor: alpha(theme.palette.common[themeOptions.searchBg], 0.15),
                    }}
                    variant="body1"
                  >
                    {stuA}
                  </Typography>
                  {readOnly === undefined && (
                    <>
                      {isStuA && (
                        <CircularProgress sx={{ padding: '1px' }} color="secondary" size={26} disableShrink={true} />
                      )}
                      {!isStuA && (
                        <IconButton
                          sx={iconButtonContainer}
                          onClick={() => loadStuPicker(stuAID, assType, assTypeName, stuA)}
                        >
                          <EditIcon sx={editIconButton} />
                        </IconButton>
                      )}
                    </>
                  )}
                </Box>
                {assType !== 104 && (
                  <Box sx={boxStudentFldContainer}>
                    <Typography
                      sx={{
                        ...typoStudentField,
                        backgroundColor: alpha(theme.palette.common[themeOptions.searchBg], 0.15),
                      }}
                      variant="body1"
                    >
                      {assA}
                    </Typography>
                    {readOnly === undefined && (
                      <>
                        {isAssA && (
                          <CircularProgress sx={{ padding: '1px' }} color="secondary" size={26} disableShrink={true} />
                        )}
                        {!isAssA && (
                          <IconButton
                            sx={iconButtonContainer}
                            onClick={() =>
                              loadStuPicker(assAID, assType, t('global.assistant'), assA, stuA, assTypeName)
                            }
                          >
                            <EditIcon sx={editIconButton} />
                          </IconButton>
                        )}
                      </>
                    )}
                  </Box>
                )}
              </Box>
              {classCount === 2 && (
                <Box sx={boxStudentAYF}>
                  <Box sx={boxStudentFldContainer}>
                    <Typography
                      sx={{
                        ...typoStudentField,
                        backgroundColor: alpha(theme.palette.common[themeOptions.searchBg], 0.15),
                      }}
                      variant="body1"
                    >
                      {stuB}
                    </Typography>
                    {readOnly === undefined && (
                      <>
                        {isStuB && (
                          <CircularProgress sx={{ padding: '1px' }} color="secondary" size={26} disableShrink={true} />
                        )}
                        {!isStuB && (
                          <IconButton
                            sx={iconButtonContainer}
                            onClick={() => loadStuPicker(stuBID, assType, assTypeName, stuB)}
                          >
                            <EditIcon sx={editIconButton} />
                          </IconButton>
                        )}
                      </>
                    )}
                  </Box>
                  {assType !== 104 && (
                    <Box sx={boxStudentFldContainer}>
                      <Typography
                        sx={{
                          ...typoStudentField,
                          backgroundColor: alpha(theme.palette.common[themeOptions.searchBg], 0.15),
                        }}
                        variant="body1"
                      >
                        {assB}
                      </Typography>
                      {readOnly === undefined && (
                        <>
                          {isAssB && (
                            <CircularProgress
                              sx={{ padding: '1px' }}
                              color="secondary"
                              size={26}
                              disableShrink={true}
                            />
                          )}
                          {!isAssB && (
                            <IconButton
                              sx={iconButtonContainer}
                              onClick={() =>
                                loadStuPicker(assBID, assType, t('global.assistant'), assB, stuB, assTypeName)
                              }
                            >
                              <EditIcon sx={editIconButton} />
                            </IconButton>
                          )}
                        </>
                      )}
                    </Box>
                  )}
                </Box>
              )}
            </Grid>
          )}
        </Box>
      )}
    </>
  );
};

export default ScheduleAYF;
