import { View } from '@react-pdf/renderer';
import { S140AYFType } from '../shared/index.types';
import styles from './index.styles';
import S140Time from './S140Time';
import S140SourceComplex from './S140SourceComplex';
import S140Person from './S140Person';

const ApplyMinistryRow = ({ meetingData, class_count,lang }: S140AYFType) => {
  return (
    <>
      {[1, 2, 3, 4].map((index) => {
        const ayfType = meetingData[`ayf_part${index}_type`];
        const ayfTiming = meetingData.timing[`ayf_part${index}`];
        const ayfTypeName = meetingData[`ayf_part${index}_type_name`];
        const ayfTime = meetingData[`ayf_part${index}_time`];
        const ayfLabel = meetingData[`ayf_part${index}_label`];
        const ayfNameA = meetingData[`ayf_part${index}_A_name`];
        const ayfNameB = meetingData[`ayf_part${index}_B_name`];

        return (
          <View key={`ayf-${meetingData.weekOf}-${index}`}>
            {ayfType && (
              <View
                style={{
                  ...styles.rowBase,
                  marginBottom: '2px',
                }}
              >
                <S140Time time={ayfTiming} />
                <S140SourceComplex
                  source={ayfTypeName}
                  time={ayfTime}
                  bulletColor="#a56803"
                  partLabel={ayfLabel}
                  lang={lang}
                />
                <S140Person person={class_count === 1 ? '' : ayfNameB} />
                <S140Person person={ayfNameA} />
              </View>
            )}
          </View>
        );
      })}
    </>
  );
};

export default ApplyMinistryRow;
