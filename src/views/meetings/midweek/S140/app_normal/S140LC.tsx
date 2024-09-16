import { Fragment } from 'react';
import { View } from '@react-pdf/renderer';
import { S140LCType } from '../shared/index.types';
import S140PartTime from './S140PartTime';
import S140Source from './S140Source';
import S140Person from './S140Person';
import styles from './index.styles';

const LivingPartRow = ({ meetingData }: S140LCType) => {
  return (
    <>
      {[1, 2, 3].map((index) => {
        const lcTIming = meetingData.timing[`lc_part${index}`];
        const lcSrc: string = meetingData[`lc_part${index}_src`];
        const lcTime = meetingData[`lc_part${index}_time`];
        const lcName = meetingData[`lc_part${index}_name`];

        return (
          <Fragment key={`lc-${meetingData.weekOf}-${index}`}>
            {lcSrc?.length > 0 && (
              <View
                style={{
                  ...styles.rowContainer,
                  backgroundColor: index % 2 === 0 ? '' : '#FFF3F1',
                }}
              >
                <S140PartTime
                  time={lcTIming}
                  color="#942926"
                  backgroundColor="rgba(184, 43, 16, 0.08)"
                />

                <S140Source source={lcSrc} duration={lcTime} color="#942926" />

                <S140Person primary={lcName} />
              </View>
            )}
          </Fragment>
        );
      })}
    </>
  );
};

export default LivingPartRow;
