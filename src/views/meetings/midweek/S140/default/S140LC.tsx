import { View } from '@react-pdf/renderer';
import { S140LCType } from '../shared/index.types';
import styles from './index.styles';
import S140Time from './S140Time';
import S140Person from './S140Person';
import S140SourceExtended from './S140SourceExtended';
import S140PartMiniLabel from './S140PartMiniLabel';

const LivingPartRow = ({ meetingData,lang }: S140LCType) => {
  return (
    <>
      {[1, 2, 3].map((index) => {
        const lcTIming = meetingData.timing[`lc_part${index}`];
        const lcSrc: string = meetingData[`lc_part${index}_src`];
        const lcTime = meetingData[`lc_part${index}_time`];
        const lcName = meetingData[`lc_part${index}_name`];

        return (
          <View key={`lc-${meetingData.weekOf}-${index}`}>
            {lcSrc?.length > 0 && (
              <View style={styles.rowBase}>
                <S140Time time={lcTIming} />
                <S140SourceExtended
                  source={lcSrc}
                  time={lcTime}
                  bulletColor="#942926"
                  lang={lang}
                />
                <S140PartMiniLabel part="" />
                <S140Person person={lcName} />
              </View>
            )}
          </View>
        );
      })}
    </>
  );
};

export default LivingPartRow;
