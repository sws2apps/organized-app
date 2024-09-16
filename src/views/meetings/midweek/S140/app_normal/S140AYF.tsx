import { Fragment } from 'react';
import { View } from '@react-pdf/renderer';
import { S140AYFType } from '../shared/index.types';
import S140PartTime from './S140PartTime';
import S140Source from './S140Source';
import S140Person from './S140Person';
import styles from './index.styles';

const ApplyMinistryRow = ({
  meetingData,
  class_count,
  fullname,
}: S140AYFType) => {
  return (
    <>
      {[1, 2, 3, 4].map((index) => {
        const ayfType = meetingData[`ayf_part${index}_type`];
        const ayfTiming = meetingData.timing[`ayf_part${index}`];
        const ayfTypeName = meetingData[`ayf_part${index}_type_name`];
        const ayfTime = meetingData[`ayf_part${index}_time`];
        const ayfStudentNameA = meetingData[`ayf_part${index}_A_student_name`];
        const ayfAssistantNameA =
          meetingData[`ayf_part${index}_A_assistant_name`];
        const ayfStudentNameB = meetingData[`ayf_part${index}_B_student_name`];
        const ayfAssistantNameB =
          meetingData[`ayf_part${index}_B_assistant_name`];

        return (
          <Fragment key={`ayf-${meetingData.weekOf}-${index}`}>
            {ayfType && (
              <View
                style={{
                  ...styles.rowContainer,
                  backgroundColor: index % 2 === 0 ? '#FDF5E4' : '',
                }}
              >
                <S140PartTime
                  time={ayfTiming}
                  color="#956711"
                  backgroundColor="rgba(194, 130, 0, 0.08)"
                />

                <S140Source
                  source={ayfTypeName}
                  duration={ayfTime}
                  color="#956711"
                />

                {class_count === 2 && (
                  <S140Person
                    primary={ayfStudentNameB}
                    secondary={ayfAssistantNameB}
                    direction={fullname ? 'column' : 'row'}
                  />
                )}

                <S140Person
                  primary={ayfStudentNameA}
                  secondary={ayfAssistantNameA}
                  direction={fullname ? 'column' : 'row'}
                />
              </View>
            )}
          </Fragment>
        );
      })}
    </>
  );
};

export default ApplyMinistryRow;
